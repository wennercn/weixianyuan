Ext.define("WXY.gis.MarkerCtxMenu" , {
	extend:'Ext.menu.Menu' , 
	xtype:'markerctxmenu' , 
	id:'marker-ctxmenu' , 
	initComponent: function(){
		var me = this;
		var items = [];
		items.push(
			{text:"监控点" , itemId:"title" , iconCls:"" , style:{fontWeight:"bold"} , hideOnClick:false} ,
			{xtype:'menuseparator'} , 			
			{text:'查看信息' , iconCls:"ico_detail" , handler:this.detailMP , scope:this} , 			
			{xtype:'menuseparator'} , 
			{text:'数据控制' , iconCls:"ico_control" , menu:{
				items:[
					{text:"关闭监控" , handler: this.stopMP , scope:this} , 
					{text:"忽略当前预警" , handler: this.stopWarning , scope:this}
				]
			}} , 	
			{xtype:'menuseparator'} , 
			{text:"修改" , iconCls:'ico_edit' , itemId:'edit' , handler:this.editMP , scope:this} ,
			{text:"删除" , iconCls:'ico_delete' , itemId:'delete' , handler:this.deleteMP , scope:this}
		);

		me.items = items;
		me.callParent();
	} , 
	open: function(cfg){
		var record = cfg.record;
		var ev = cfg.ev;
		this.record = record;
		this.showAt(cfg.x , cfg.y);
		this.getComponent(0).setText('<b style="color:blue">'+record.get("dangertypename")+":"+record.get("dangername")+"</b>&nbsp;&nbsp;&nbsp;&nbsp;");

		ev.preventDefault();
		ev.stopPropagation();
	} , 

	//编辑监控点
	editMP: function(){
		var mpw = Ext.getCmp("monitorpoint-window");
		mpw.showForm({
			record: this.record
		});
	} , 

	getMPWindow: function(){
		this.mpwindow = Ext.getCmp("monitorpoint-window")
		if (!this.mpwindow){
			this.mpwindow = Ext.create("WXY.monitorpoint.Window");			
		}
		return this.mpwindow;
	} , 

	//删除
	deleteMP: function(){
		this.record.delete();
	} , 

	detailMP: function(){	
		this.record.detail();
	} , 
	
	stopMP: function(){
		this.record.stop();
	} , 

	stopWarning: function(){
		this.record.stopWarning();	
	}
});