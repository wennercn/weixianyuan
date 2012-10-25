Ext.define("WXY.gis.Index" , {
	extend:"WXY.ux.BaiDuMapPanel" ,
	requires:[
		'WXY.gis.Config' , 
		'WXY.gis.Toolbar' , 
		'WXY.gis.MapCtxMenu' ,
		'WXY.gis.MarkerCtxMenu' , 
		'WXY.monitorpoint.Window'
	] ,
	mapCenterAddress: '国际创业中心' , 
	mapCenterCity: '天津' ,
	mapZoom: 18 , 
	useLocation: false , 

	tipTemplate: [
		'<h3>{dangertypename}: {dangername}</h3>' , 
		'<p>物理编码: {dangercode}</p>' , 
		'<p>位置: {location}</p>' , 
		'<p>状态: {status}</p>'
	] , 

	initComponent: function(){
		var me = this;

		//监控点STORE
		me.mpStore = Ext.data.StoreManager.lookup('mp-store');
		me.mpStore.on({
            load: me.onStoreRefresh ,
            add: me.onStoreAdd,
            remove: me.onStoreRemove,
            update: me.onStoreUpdate,
            clear: me.onStoreClear , 
            scope: this
        });

		//控制台窗口
		me.console = Ext.create("WXY.gis.console.Window" , {
			parent: me
		});

		//监控点信息窗口
		me.mpWindow = Ext.create("WXY.monitorpoint.Window");



		Ext.apply(me , {
			dockedItems:[
				{xtype:"maptoolbar" , parent: me}
			]
		})
		
		me.on({
			mapload: this.showConsole , 
			mapctxmenu: this.onMapCtxMenu , 
			markerctxmenu: this.onMarkerCtxMenu ,
			scope: this
		});

		me.callParent();
	} , 
	initMain: function(){
		var me = this;
	} , 

	//显示控制台
	showConsole: function(){
		if (!this.hasListener('afterlayout')){
			this.on('afterlayout' , this.showConsole , this);
		}
		this.console.setSizeAndPosition();
		this.console.show();
	} , 

	//显示右键菜单
	onMapCtxMenu: function(obj , ev){
		//this.mapCtxData = obj;
		this.mapCtxMenu = Ext.getCmp("map-ctxmenu")
		if (!this.mapCtxMenu){
			this.mapCtxMenu = Ext.create("WXY.gis.MapCtxMenu")
		}
		this.mapCtxMenu.open({
			point: obj , 
			x: obj.clientX , 
			y: obj.clientY , 
			parent: this , 
			ev: ev
		});
	} , 

	//显示标记的右键菜单
	onMarkerCtxMenu: function(obj , record , ev){
		//this.markerCtxData = obj;
		this.markerCtxMenu = Ext.getCmp("marker-ctxmenu");
		if (!this.markerCtxMenu){
			this.markerCtxMenu = Ext.create("WXY.gis.MarkerCtxMenu");
		}
		this.markerCtxMenu.open({
			x: obj.clientX , 
			y: obj.clientY , 
			record: record , 
			ev: ev , 
			parent: this
		});
	} , 

	//STORE事件
	onStoreRefresh: function(){
		var me = this;
		var map = me.map;
		//清除所有标记
		map.clearOverlays();
		//加入标记
		this.addMarkerFromRecord(me.mpStore.getRange());
	} , 

	//store添加
	onStoreAdd: function(ds , rs , ix){
		this.addMarkerFromRecord(rs);
	} , 
	onStoreRemove: function(ds , record , index){
		this.removeMarkerFromRecord(record);
	} , 
	onStoreUpdate: function(ds , record , opera , fields , opt){	
		if (opera == 'commit') return;
		record.update();
	} , 
	onStoreClear: function(){
		alert("clear");
	}
});