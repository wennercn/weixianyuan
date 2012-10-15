Ext.define('WXY.article.List', {
	extend: 'Ext.grid.Panel',
	/*
	requires:[
		"Penavico.plan.Common"
	] ,
	//方法集合
	mixins: ['Penavico.plan.list.Handlers'] , 
	*/
	//title: "文章列表" ,
	//iconCls:"ico_plan" ,
	//cls:"planlist" , 
	autoScroll: true ,
	columnLines: true ,
	/**
	 * @cfg {String/Object} defaultOpenConfig 默认双击打开的参数
	 */
	defaultOpenConfig: "detail" , 
	/**
	 * @cfg {String} wsUrl 读取数据的webservices 地址
	 */
	wsUrl: "http://192.168.0.110/weixianyuanservice/DangerWebService.asmx" ,
	/**
	 * @cfg {String} wsMethod 读取数据的webservices 方法
	 */
	wsMethod: "GetAll" , 

	rowLines: false , 
	selModel: {mode: 'SINGLE'} ,

	columns: [
		{xtype: 'rownumberer' , text:"序号" , width:30},
		{text:"标题" , dataIndex:'title'} , 
		{text:'日期'}
	] ,
	
	initComponent: function(){
		var me = this;

		Ext.apply(me , {
			store: me.createStore() , 
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
		this.win.setTitle("查看 "+this.win.moduleConfig.type+" 列表");
		if (config.disableInit) return;
		this.load();
	} , 

	/**
	* 读取数据;
	*/
	load: function(params){
		this.setLoading("读取数据...");
		var pa = this.getParams();
		this.store.load({
			url: this.wsUrl+"/"+this.wsMethod , 
			params: pa , 
			callback: function(records , ops , succ){
				this.setLoading(false);
				if (!succ) return;
				if (this.afterLoad) this.afterLoad(records);
			} ,
			scope: this
		});
	} , 

	getParams: function(){
		var pa = {};
		pa.type = this.win.moduleConfig.type;
		return pa;
	} , 

	/**
	 * 创建STORE
	 * @return {Ext.data.Store}
	 */
	createStore: function(){
		var store = Ext.create("WXY.article.store.Article" , {
		});	
		return store;
	} , 

    /**
     * 创建DOCKEDS
     * @return {Array}
     */
	createDockedItems: function(){
		var dockes = [
			{xtype:"toolbar" , dock:'top' , items:[
				{text:"<b>添加</b>" , iconCls:"ico_add" , handler: this.onCreate , scope:this} , '-' , 
				{text:"修改" , iconCls:"ico_edit" , itemId:"edit" , disabled:true , handler: this.onEdit , scope:this} , '-' , 
				{text:"删除" , iconCls:"ico_delete" , itemId:"delete" , disabled:true , hander: this.onDelete , scope:this} , '-' , 
				{text:"查看" , iconCls:"ico_detail" , itemId:"detail" , disabled:true , handler: this.onDetail , scope:this} , 
				'->' , 
				{text:'刷新' , iconCls:'ico_refresh' , handler:this.onRefresh , scope:this}
			]}
		];
		return dockes;
	} , 

	//添加
	onCreate: function(){
		var win = this.win;
		if (!win.form){
			win.form = win.add(this.createForm());
		}
		win.setCardActive(win.form);
	} , 

	//创建表单
	createForm: function(){
		var form = Ext.create("WXY.article.Form" , {
		});
		return form;
	} , 

	//修改

	//删除

	//查看

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