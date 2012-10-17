Ext.define("WXY.gis.Index" , {
	extend:"WXY.ux.BaiDuMapPanel" ,

	mapCenterAddress: '百货大楼' , 
	mapCenterCity: '天津' ,
	mapZoom: 18 , 
	useLocation: false , 

	initComponent: function(){
		var me = this;
		me.console = Ext.create("WXY.gis.console.Window" , {
			parent: me
		});
		me.on("afterlayout" , this.showConsole , this);
		me.callParent();
	} , 
	initMain: function(){
		var me = this;
	} , 
	showConsole: function(){
		this.console.setSizeAndPosition();
		this.console.show();
	}
});