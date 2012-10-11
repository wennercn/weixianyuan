Ext.define("WXY.gis.Index" , {
	extend:"Ext.ux.BaiDuMapPanel" ,
	mapOptions: {

	} ,
	center: {
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
	}]
});