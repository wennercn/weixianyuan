Ext.define('WXY.monitorpoint.Tree', {
    extend: 'Ext.tree.Panel',
    xtype: 'mp-tree',
	autoScroll: true ,
	hideHeaders: true ,
	rootVisible: false,

	columns: [
		{text:'status' , width:25 , dataIndex:'status' , renderer:function(v , td , r){
			td.tdCls = 'mp-grid-status ico_status_'+v;
			return "";
		}} , 
		{text:"名称" , dataIndex:"dangername" , xtype:"treecolumn" , flex:1}
	] ,

	initComponent: function(){
		var me = this;

		Ext.apply(me , {
			store: 'mp-store' , //Ext.data.StoreManager.lookup('mp-store') || me.createStore() , 
			dockedItems: me.createDockedItems() , 
			viewConfig: {
				preserveScrollOnRefresh : true, 
				deferEmptyText: false ,
				emptyText:"<div style='color:blue;padding:15px'>还没有相关记录!</div>" , 
				getRowClass: me.getRowClass
			}
		});
		
		this.callParent();
		
		this.on({
			itemcontextmenu: this.onCtxMenu , 
			itemdblclick: this.onDblclick , 
			selectionchange: this.onSelectionChange , 
			destroy: this.onDestroy ,
			scope: this
		});
	} ,

	initMain: function(config){
		config = config || {};
		this.win = this.up("window");
		this.mappanel = this.win.parent;
		this.map = this.mappanel.map;
	} , 

    /**
     * 创建DOCKEDS
     * @return {Array}
     */
	createDockedItems: function(){

		var addmenus = [];
		Ext.iterate(WXY.gis.Config.dangerKindData , function(key , v){
			addmenus.push({text:v.name , handler:this.onCreate , scope:this , value:key});
		} , this);


		var dockes = [
			{xtype:"toolbar" , dock:'top' , enableOverflow: true , items:[
				/*
				{xtype:'textfield' , enableKeyEvents:true , emptyText:'请输入关键字...' , listeners:{
					keyup: function(el){
						var v = el.getValue();
						if (Ext.isEmpty(v)) {
							this.getStore().clearFilter();
							return;
						}
						this.getStore().filterBy(function(r){
							return r.get("dangername").indexOf(v) > -1 || r.get("dangercode").indexOf(v) > -1;
						})
					} , 
					scope: this
				}} , 
				*/
				'->' , 
				{text:'操作' , iconCls1:'x-toolbar-more-icon' , menu:{
					items:[
						{text:"添加" , iconCls:"ico_add" , handler: this.onCreate , scope:this , value:"point" , menu:addmenus} , '-' , 
						{text:"修改" , iconCls:"ico_edit" , itemId:"edit" , disabled:true , handler: this.onEdit , scope:this} , 
						{text:"删除" , iconCls:"ico_delete" , itemId:"delete" , disabled:true , handler: this.onDelete , scope:this} ,  
						{text:"查看" , iconCls:"ico_view" , itemId:"detail" , disabled:true , handler: this.onDetail , scope:this} , '-' , 
						{text:'刷新' , iconCls:'ico_refresh' , handler:this.onRefresh , scope:this}
					]
				}}
			]}
		];
		return dockes;
	} , 





	load: function(params){
		params  = params || {};
		var me = this;
		if (me.loadMaskType == "loadmask") {
			me.setLoading("读取STAR服务标准数据...");
		}else{
			MB.loading("读取STAR服务标准数据");
		}
		
		//this.getRootNode().removeAll();

		this.store.load({
			url: params.url ||  this.store.getProxy().url , 
			params: params , 
			callback:function(store , rs , succ){
				if (succ) {
					this.getRootNode().expand(true);
					this.afterExpand();
				}
				if (me.loadMaskType == "loadmask") {
					me.setLoading(false);
				}else{
					if (succ) MB.hide();
				}	
			} , 
			scope: this
		});
		/*
		this.getRootNode().expand(true , function(){
			if (me.loadMaskType == "loadmask") {
				me.setLoading(false);
			}else{
				MB.hide();
			}		
		});
		*/
	} ,
	afterExpand: Ext.emptyFn , 
	formatJS: function(v , td , r){
		if (!r.get("leaf")) return "";
		return (!v || v == 0) ? "" : (( v < 0 ? "前" : "后")+" <b>"+Math.abs(v)+"</b> 小时")
	} ,

	formatParent: function(v , td , r){
		return r.get("leaf") ? v : "";
	} ,

	//选择一行 , enable按钮
	changeSelection: function(sm , rs){
		var btns = ["apply" , "edit" , "delete" , "detail"];
		Ext.each(btns , function(n){
			var btn = this.down("#"+n);
			if (btn) btn.setDisabled(rs.length == 0);
		} , this);
	} ,

	onCheckChange: function(node , checked){
		//check下级
		node.cascadeBy(function(cnode) {
			cnode.set('checked', checked);
		});

		//上级
		node.bubble(function(parentNode) {
			if (checked) {
				parentNode.set('checked', checked);
			}else{
				var haschecked = false;
				parentNode.eachChild(function(pcnode){
					if (pcnode.get("checked") == true) haschecked = true;
				})
				parentNode.set('checked' , haschecked);
			}
		});
	} ,
    showActions: function(view, task, node, rowIndex, e) {
		if (this.hasCheck) {
			var r = view.getRecord(view.findTargetByEvent(e));
			if (r && !r.get("checked")) return;
		}
        var icons = Ext.DomQuery.select('.x-action-col-icon', node);
        Ext.each(icons, function(icon){
            Ext.get(icon).removeCls('x-hidden');
        });
    },
    hideActions: function(view, task, node, rowIndex, e) {
        var icons = Ext.DomQuery.select('.x-action-col-icon', node);
        Ext.each(icons, function(icon){
            Ext.get(icon).addCls('x-hidden');
        });
    } ,

	getAllNode: function(){
		var root = this.getRootNode();
		var rs = [];
		root.cascadeBy(function(n){
			rs.push(n);
		} , this);
		return rs;
	} , 

	//添加
	onCreate: function(btn){
		var kind = btn.value;
		var mpw = this.getMPWindow();
		mpw.showForm({
			kind: kind
		});
	} , 

	//修改
	onEdit: function(){
		var record = this.getSelectionModel().getSelection()[0];
		if (!record) return;
		var mpw = this.getMPWindow();
		mpw.showForm({
			kind: record.get("kind") , 
			record: record
		});
	} , 

	//删除
	onDelete: function(){
		var record = this.getSelectionModel().getSelection()[0];
		if (!record) return;
		record.delete();
	} , 

	//查看
	onDetail: function(){
		var record = this.getSelectionModel().getSelection()[0];
		if (!record) return;
		record.detail();
	} , 

	//刷新
	onRefresh: function(){
		this.getStore().load();
	} , 

	/**
	*当表格选择发生变化时候进行处理
	*/
	onSelectionChange: function(sm , rs){
		var btns = ["apply" , "edit" , "delete" , "detail"];
		Ext.each(btns , function(n){
			var btn = this.down("#"+n);
			if (btn) btn.setDisabled(rs.length == 0);
		} , this);
	} ,

	/**
	* 双击表格
	*/
	onDblclick: function(view , record , el , rindex , ev){
		record.panToMarker();
	} , 

	/**
	 * 右键菜单
	 */
	onCtxMenu: function(view , record , el , index , ev){
		this.markerCtxMenu = Ext.getCmp("marker-ctxmenu");
		if (!this.markerCtxMenu){
			this.markerCtxMenu = Ext.create("WXY.gis.MarkerCtxMenu");
		}
		this.markerCtxMenu.open({
			x: ev.getX() , 
			y: ev.getY() , 
			record: record , 
			ev: ev , 
			parent: this
		});
	} , 

	//获取表单窗口
	getMPWindow: function(){
		this.mpwindow = Ext.getCmp("monitorpoint-window");
		/*
		if (!this.mpwindow){
			this.mpwindow = Ext.create("WXY.monitorpoint.Window");			
		}
		*/
		return this.mpwindow;
	}

})
