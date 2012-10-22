Ext.define('WXY.monitorpoint.List', {
	extend: 'Ext.grid.Panel',
	autoScroll: true ,
	features: {ftype:"grouping" , groupHeaderTpl: '{name} ({rows.length})'} , 
	hideHeaders: true , 
	columns: [
		//{xtype: 'rownumberer' , text:"序号" , width:30},
		{text:'status' , width:35 , dataIndex:'status' , renderer:function(v , td , r){
			td.tdCls = 'mp-grid-status ico_status_'+v;
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
			itemcontextmenu: this.onCtxMenu , 
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
			{xtype:"toolbar" , dock:'top' , enableOverflow: true , items:[
				{xtype:'textfield' , enableKeyEvents:true , emptyText:'请输入关键字...' , listeners:{
					keyup: function(el){
						var v = el.getValue();
						this.getStore().filterBy(function(r){
							return r.get("dangername").indexOf(v) > -1 || r.get("dangercode").indexOf(v) > -1;
						})
					} , 
					scope: this
				}} , '->' , 
				{text:'操作' , iconCls1:'x-toolbar-more-icon' , menu:{
					items:[
						{text:"添加监控点" , iconCls:"ico_add" , handler: this.onCreate , scope:this} , '-' , 
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

	//添加
	onCreate: function(){
		var mpw = this.getMPWindow();
		mpw.showForm();
	} , 

	//修改
	onEdit: function(){
		var record = this.getSelectionModel().getSelection()[0];
		if (!record) return;
		var mpw = this.getMPWindow();
		mpw.showForm({
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

});