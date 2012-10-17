Ext.define("WXY.gis.Index" , {
	extend:"WXY.ux.BaiDuMapPanel" ,
	mapOptions: {
	} ,
	center1: {
		lat: 38.9730 ,
		lng: 117.7482
		//geoCodeAddr: '天津市国际创业中心'
		//marker: {title: '办公地点:天津市国际创业中心'}
	},
	markers: [{
		lat: 42.339641,
		lng: -71.094224,
		title: 'Boston Museum of Fine Arts',
		listeners: {
			click: function(e){
				Ext.Msg.alert('It\'s fine', 'and it\'s art.');
			}
		}
	},{
		lat: 42.339419,
		lng: -71.09077,
		title: 'Northeastern University'
	}] , 
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