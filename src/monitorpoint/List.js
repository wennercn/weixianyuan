Ext.define('WXY.monitorpoint.List', {
	extend: 'Ext.grid.Panel',
	autoScroll: true ,
	features: {ftype:"grouping" , groupHeaderTpl: '{name} ({rows.length})'} , 
	hideHeaders: true , 
	columns: [
		//{xtype: 'rownumberer' , text:"序号" , width:30},
		{text:'status' , width:35 , dataIndex:'status' , renderer:function(v , td , r){
			td.tdCls = 'mp-grid-status ico_status_ok';
			return "";
		}} , 
		{text:"标题" , dataIndex:'dangername' , flex:1}
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
			itemdblclick: this.onDblclick , 
			selectionchange: this.onSelectionChange , 
			destroy: this.onDestroy ,
			scope: this
		});
	} ,
	/**
	 * 显示每行的cls
	 */
	getRowClass: function(r , rindxe , rp , ds){
		return "";
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
		var dockes = [
			/*
			{xtype:"toolbar" , dock:'top' , enableOverflow: true , items:[
				{text:"<b>添加</b>" , iconCls:"ico_add" , handler: this.onCreate , scope:this} , '-' , 
				{text:"修改" , iconCls:"ico_edit" , itemId:"edit" , disabled:true , handler: this.onEdit , scope:this} , '-' , 
				{text:"删除" , iconCls:"ico_delete" , itemId:"delete" , disabled:true , handler: this.onDelete , scope:this} , '-' , 
				{text:"查看" , iconCls:"ico_view" , itemId:"detail" , disabled:true , handler: this.onDetail , scope:this} , 
				'->' , 
				{xtype:'textfield' , enableKeyEvents:true , emptyText:'请输入关键字...' , listeners:{
					keyup: function(el){
						var v = el.getValue();
						console.log(v);
						this.getStore().filterBy(function(r){
							return r.get("title").indexOf(v) > -1 || r.get("detail").indexOf(v) > -1;
						})
					} , 
					scope: this
				}} , '-' , 
				{text:'刷新' , iconCls:'ico_refresh' , handler:this.onRefresh , scope:this}
			]}
			*/
		];
		return dockes;
	} , 

	//添加
	onCreate: function(){
		this.win.setCardActive(this.getForm());
	} , 

	//创建表单
	getForm: function(){
		if (!this.win.form){
			var form = Ext.create("WXY.article.Form" , {
			});
			this.win.form = this.win.add(form);
		}
		return this.win.form;
	} , 

	//修改
	onEdit: function(){
		var record = this.getSelectionModel().getSelection()[0];
		if (!record) return;
		this.win.setCardActive(this.getForm() , {record: record});
	} , 

	//删除
	onDelete: function(){
		var record = this.getSelectionModel().getSelection()[0];
		if (!record) return;
		this.forDeleteRecord = record;
		MB.confirm("删除信息?" , "是否要删除该条记录!" , this.execDelete , this);
	} , 

	execDelete: function(result){
		if (result == "no") return;
		MB.loading("删除信息");
		Ext.Ajax.request({
			url: this.win.wsUrl+"DeleteKnowledge" , 
			params: {knowledgeid: this.forDeleteRecord.get("knowledgeid")} ,
			success: function(data){
				var bd = $back(data);
				if (!bd.isok){
					MB.alert("错误" , bd.getErrorInfo());
					return;
				}
				MB.hide();
				this.getStore().remove(this.forDeleteRecord);
				this.forDeleteRecord = null;
			},
			failure: $failure ,
			scope: this
		});
	} , 

	//查看
	onDetail: function(){
		var record = this.getSelectionModel().getSelection()[0];
		if (!record) return;
		this.showDetail(record);
	} , 

	//刷新
	onRefresh: function(){
		this.load();
	} , 

	/**
	*右键菜单
	*/
	onCtxClick: function(v , r , item , i , ev){
		if (!this.ctxMenu) {
			this.ctxMenu = Ext.create("WXY.article.CtxMenu" , {});
		}
		var menu = this.ctxMenu;
		ev.stopEvent();
		menu.setPlan(r);
		this.ctxrecord = r;
		menu.showAt(ev.getXY());
		//船名
		//menu.getComponent(0).setText('<b style="color:blue">'+r.get("shipname")+"</b>&nbsp;&nbsp;&nbsp;&nbsp;");
	} ,

	/**
	*当表格选择发生变化时候进行处理
	*/
	onSelectionChange: function(sm , rs){
		//按钮
		var btns = ["apply" , "edit" , "delete" , "detail"];
		Ext.each(btns , function(n){
			var btn = this.down("#"+n);
			if (btn) btn.setDisabled(rs.length == 0);
		} , this);

		//过滤树
		var tree = this.down("#planlist_tree");
		if (!tree) return;
		//alert(tree.getSelectionModel().getSelection())
	} ,

	/**
	* 双击表格打开详细信息
	*/
	onDblclick: function(view , record , el , rindex , ev){
		record.panToMarker();
	} , 

	showDetail: function(record){
		var win = this.win;
		if (!win.detail){
			win.detail = win.add(Ext.create("WXY.article.Detail" , {

			}));
		}
		win.setCardActive(win.detail , {
			record: record	
		});

	}
});