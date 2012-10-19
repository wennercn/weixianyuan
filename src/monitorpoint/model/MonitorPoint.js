Ext.define("WXY.monitorpoint.model.MonitorPoint" , {
	extend:"Ext.data.Model" , 
	idProperty: 'dangerid' , 
	fields:[
		{name:"dangerid" , mapping:"dangerid"},
		{name:"dangername" , mapping:"dangername"},
		{name:"dangercode" , mapping:"dangercode"},
		{name:"dangertype" , mapping:"dangertype"},
		{name:"dangertypename" , mapping:"dangertype" , convert:function(v){
			return ['' , "传感器" , '监控摄像头'][v];
		}},
		{name:"description" , mapping:"description"} ,
		{name:"address" , mapping:"address"},
		{name:"area_id" , mapping:"area_id"},
		{name:"area_name" , mapping:"area_name"},
		{name:"grade" , mapping:"grade"},
		{name:"location" , mapping:"location"},
		{name:"lat" , mapping:"lat"},
		{name:"lng" , mapping:"lng"},
		{name:"lnglat" , convert:function(v , r){
			return [r.get("lng") , r.get('lat')].join(",");
		}},
		{name:"status" , mapping:"status"}
	] , 

	setMarker: function(marker){
		this.marker = marker;
	} , 

	//移动到当前点
	panToMarker: function(){
		var marker = this.marker;
		if (!marker) return;
		var map = marker.getMap();
		if (!map) return;
		var point = marker.point;
		if (map.curMarker){
			map.prevMarker = map.curMarker;
			map.prevMarker.setAnimation()			
		}
		map.curMarker = marker;
		map.panTo(point);
        marker.setAnimation(BMAP_ANIMATION_BOUNCE);
        setTimeout(function(){
        	marker.setAnimation()
        } , 5000);

	}
})