Ext.define("WXY.gis.Toolbar" , {
	extend: "Ext.toolbar.Toolbar" , 
	xtype:'maptoolbar' , 
	dock: 'top' , 
	initComponent: function(){
		var me = this;
		var items = [];

		items.push({xtype:'tbfill'});

		//地图类型
		items.push(
			'地图类型:' , 
			{xtype:"mycombo" , width:75 , editable:false , _data:[
				[BMAP_NORMAL_MAP , "普通地图"] , 
				//[BMAP_SATELLITE_MAP , "卫星"]
				[BMAP_HYBRID_MAP , '卫星地图'] , 
				[BMAP_PERSPECTIVE_MAP , "三维地图"]
			] , value:BMAP_NORMAL_MAP , listeners:{
				select: function(cb){
					var map = this.up("baidumap").map;
					this.up("baidumap").map.setMapType(cb.getValue());
				} , 
				scope: this
			}}
		);


		me.items = items;

		me.callParent();
	}

});