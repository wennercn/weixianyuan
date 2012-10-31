Ext.define("WXY.gis.MapCtxMenu" , {
	extend:'Ext.menu.Menu' , 
	id: 'map-ctxmenu' , 
	initComponent: function(){
		var me = this;
		var items = [];
		items.push(
			{text:"添加设备点" , iconCls:'ico_add' , value:"point" , handler:this.addMP , scope:this}
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
	addMP: function(btn){
		var mpw = Ext.getCmp("monitorpoint-window");
		var data = this.point;
		var point = data.point;
		var kind = btn.value;
		mpw.showForm({
			kind: kind , 
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