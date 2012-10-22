Ext.define("WXY.monitorpoint.model.MonitorPoint" , {
	extend:"Ext.data.Model" , 
	idProperty: 'dangerid' , 
	fields:[
		{name:"dangerid" , mapping:"dangerid"},
		{name:"dangername" , mapping:"dangername"},
		{name:"dangercode" , mapping:"dangercode"},
		{name:"dangertype" , mapping:"dangertype"},
		{name:"dangertypename" , mapping:"dangertype" , convert:function(v){
			var d = WXY.gis.Config.dangerTypeData[v];
			return d ? d.name : "";
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

	setMarker:function(options){
		var record = this;
        var lng = record.get("lng");
        var lat = record.get("lat");
        if (Ext.isEmpty(lng) || Ext.isEmpty(lat)) return false;

        //坐标点
        var point = new BMap.Point(lng, lat);

        var markerOptions = {};
        var mIcon = this.getMarkerIcon();
        if (mIcon) markerOptions.icon = mIcon;
        var mShadow = this.getMarkerShadow();
        if (mShadow) markerOptions.shadow = mShadow;

        var marker = new BMap.Marker(point , markerOptions);
		marker.record = record;
        record.marker = marker;

        if (options.label){
            var label = new BMap.Label( 
                record.get("dangername"),
                {offset:new BMap.Size(20,-10)}
            );
            marker.setLabel(label);
        }

        return marker;
	} , 
	getDangerTypeData: function(){
		var dangerTypeData = WXY.gis.Config.dangerTypeData;
		return dangerTypeData[this.get("dangertype")];
	} , 
	//获取标注图标
	getMarkerIcon: function(){
		var dtd = this.getDangerTypeData();
		var status = this.get("status");
		var image = "res/img/"+dtd.code+"_"+status+".png";

		var icon = new BMap.Icon(
			image , 
			new BMap.Size(24,24)
		);
		return icon;
	} , 

	//获取标注阴影
	getMarkerShadow: function(){
		var dtd = this.getDangerTypeData();
		var image = "res/img/"+dtd.code+"_shadow.png";

		var shadow = new BMap.Icon(
			image , 
			new BMap.Size(37 , 24) , 
			{
				anchor: new BMap.Size(10 , 12) , 
				imageOffset: new BMap.Size(0,0)
			}
		);
		return shadow;
	} , 

	//更新
	update: function(){
		//是否可以更新图标
		this.updateiconEnable = true;

		var changes = this.getChanges();
		Ext.iterate(changes , function(key , v){
			var method = key.toLowerCase();
			method = method.substr(0 , 1).toUpperCase()+method.substr(1);
			method = this["update"+method];
			if (method){
				method.call(this);
			}
		} , this);
	} , 

	//更新类型
	updateDangertype: function(){
		this.updateStatus();
	} , 

	//更新状态
	updateStatus: function(){
		if (!this.marker) return;
		//更新图标
		this.marker.setIcon(this.getMarkerIcon());
		this.marker.setShadow(this.getMarkerShadow());
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
	} , 

	//删除
	delete: function(){
		MB.confirm("删除信息?" , "是否要删除该条记录!" , this._delete , this);
	} , 
	_delete: function(result){
		if (result != "yes") return;
		MB.loading("删除"+this.get("dangertypename")+":"+this.get("dangername"));
		Ext.Ajax.request({
			url: $CONFIG.wsPath+"monitorpoint.asmx/Delete" , 
			params: {dangerid: this.get("dangerid")} ,
			success: function(data){
				var bd = $backNode(data);
				if (!bd.isok){
					MB.alert("错误" , bd.getErrorInfo());
					return;
				}
				PM.msg("成功" , "删除信息成功!");
				this.store.remove(this);
				MB.hide();
			},
			failure: $failure ,
			scope: this
		});	
	}
})