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

		
		Ext.apply(me , {
			dockedItems:[
				{xtype:"toolbar" ,dock:'top' , margin1:10 , items:[
					'地图类型:' , 
					{xtype:"mycombo" , width:75 , editable:false , _data:[
						[BMAP_NORMAL_MAP , "普通地图"] , 
						//[BMAP_SATELLITE_MAP , "卫星"]
						[BMAP_HYBRID_MAP , '卫星地图'] , 
						[BMAP_PERSPECTIVE_MAP , "三维地图"]
					] , value:BMAP_NORMAL_MAP , listeners:{
						select: function(cb){
							this.map.setMapType(cb.getValue());
						} , 
						scope: this
					}}
				]}
			]
		})
		

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