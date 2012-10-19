Ext.define("WXY.gis.Index" , {
	extend:"WXY.ux.BaiDuMapPanel" ,
	requires:[
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
		'<p>位置: {location}</p>'
	] , 

	initComponent: function(){
		var me = this;

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

		Ext.apply(me , {
			dockedItems:[
				{xtype:"maptoolbar" , parent: me}
			]
		})
		
		me.on({
			afterlayout: this.showConsole , 
			mapctxmenu: this.onMapCtxMenu , 
			markerctxmenu: this.onMarkerCtxMenu ,
			scope: this
		})
		me.callParent();
	} , 
	initMain: function(){
		var me = this;
	} , 
	//显示控制台
	showConsole: function(){
		this.console.setSizeAndPosition();
		this.console.show();
	} , 
	//显示右键菜单
	onMapCtxMenu: function(obj , ev){
		this.mapCtxData = obj;
		if (!this.mapCtxMenu){
			this.mapCtxMenu = Ext.create("WXY.gis.MapCtxMenu" , {parent:this})
		}
		this.mapCtxMenu.showAt(obj.clientX , obj.clientY);
		ev.preventDefault();
        ev.stopPropagation();
	} , 
	//显示标记的右键菜单
	onMarkerCtxMenu: function(obj , record , ev){
		this.markerCtxData = obj;
		if (!this.markerCtxMenu){
			this.markerCtxMenu = Ext.create("WXY.gis.MarkerCtxMenu" , {parent:this})
		}
		var menu = this.markerCtxMenu;
		this.markerCtxMenu.showAt(obj.clientX , obj.clientY);
		//船名
		menu.getComponent(0).setText('<b style="color:blue">'+record.get("dangername")+"</b>&nbsp;&nbsp;&nbsp;&nbsp;");

   		ev.preventDefault();
        ev.stopPropagation();
	} , 

	//添加监控点
	addMPOnCtxMenu: function(){
		var mpw = this.getMPWindow();
		var data = this.mapCtxData;
		var point = data.point;
		mpw.showForm({
			data:{lnglat:point.lng+","+point.lat}
		});
	} , 
	//编辑监控点
	editMPOnCtxMenu: function(){
		var mpw = this.getMPWindow();
		var data = this.markerCtxData;
		var marker = data.target;
		mpw.showForm({
			record: marker.record
		});
	} , 
	getMPWindow: function(){
		if (!this.mpwindow){
			this.mpwindow = Ext.create("WXY.monitorpoint.Window" , {
				parent: this
			});			
		}
		return this.mpwindow;
	} , 

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
		var marker = this.addMarkerFromRecord(rs);
	} , 
	onStoreRemove: function(){
		alert("remove");
	} , 
	onStoreUpdate: function(ds , record , opera , fields , opt){
		if (opera == 'commit'){
			//alert("update");			
		}
	} , 
	onStoreClear: function(){
		alert("clear");
	}
});