Ext.define("WXY.gis.MapCtxMenu" , {
	extend:'Ext.menu.Menu' , 
	id: 'map-ctxmenu' , 
	initComponent: function(){
		var me = this;
		var items = [];
		items.push(
			{text:"添加新监控点" , iconCls:'ico_add' , handler:this.addMP , scope:this}
		);

		me.items = items;
		me.callParent();
	} , 

	open: function(cfg){
		var ev = cfg.ev;
		this.point = cfg.point;
		this.showAt(cfg.x , cfg.y);
   		ev.preventDefault();
        ev.stopPropagation();
	} , 

	//添加监控点
	addMP: function(){
		var mpw = Ext.getCmp("monitorpoint-window");
		var data = this.point;
		var point = data.point;
		mpw.showForm({
			data:{lnglat:point.lng+","+point.lat}
		});
	} , 
	getMPWindow: function(){
		this.mpwindow = Ext.getCmp("monitorpoint-window")
		if (!this.mpwindow){
			this.mpwindow = Ext.create("WXY.monitorpoint.Window");			
		}
		return this.mpwindow;
	}
});