Ext.define("WXY.monitorpoint.model.MonitorPoint" , {
	extend:"Ext.data.Model" , 
	idProperty: 'dangerid' , 
	fields:[
		{name:"dangerid" , mapping:"dangerid"},
		{name:"parentid" , mapping:"parentid"},
		{name:"parentId" , mapping:"parentid"},
		{name:"parentname" , mapping:"parentname"},
		{name:"parenttype" , mapping:"parenttype"},
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
		{name:"lnglats" , mapping:"lnglats"} , 
		{name:"kind" , mapping:"kind"} , 
		{name:"kindname" , convert:function(v , r){
			var kind = WXY.gis.Config.dangerKindData[r.get("kind")]
			return kind ? kind.name : "";
		}} , 
		{name:"status" , mapping:"status"} , 

		//{name:"loaded" , defaultValue: true} , 
		{name:"expand"} , 
		{name:"leaf"}
	] , 


	createOverlay:function(parent , options){
		var record = this;
		var kind = this.get("kind");
		var overlay = false;
		switch (kind){
			case "area":
				break;
			case "space":
				overlay = this.createPolygon(parent , options);
				break;
			case "point":
				overlay = this.createMarker(parent , options);
				break;
		}

		return overlay;
	} , 


	createPolygon: function(parent , options){
		var record = this;
		var lnglats = record.get("lnglats");
		if (Ext.isEmpty(lnglats)) return false;

		var path = [];
		Ext.each(lnglats.split(";") , function(n){
			var point = n.split(",");
        	path.push(new BMap.Point(point[0], point[1]));
		});

		var polygonOptions = {
			strokeColor:options.strokeColor || "blue",
			strokeOpacity:options.strokeOpacity || 0.8,
			strokeWeight:options.strokeWeight || 2,
			fillColor:options.fillColor || "blue" || "#1791fc",
			fillOpacity:options.fillOpacity || 0.4
		};

		var polygon =  new BMap.Polygon(path , polygonOptions);
		polygon.record = record;
        record.polygon = polygon;

		return polygon;
	} , 

	createMarker: function(parent , options){

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

        marker.setAnimation(BMAP_ANIMATION_DROP);
        marker.addEventListener("rightclick" , function(e){
            parent.fireEvent('markerctxmenu' , e , record , e.domEvent);
        }); 
		return marker;
	} , 

	getDangerTypeData: function(){
		var dangerTypeData = WXY.gis.Config.dangerTypeData;
		return dangerTypeData[this.get("dangertype")];
	} , 
	getDangerStatusData: function(){
		var dangerStatusData = WXY.gis.Config.dangerStatusData;
		return dangerStatusData[this.get("status")];
	} , 
	//获取标注图标
	getMarkerIcon: function(){
		var dtd = this.getDangerTypeData();
		var status = this.get("status");
		var dsd = this.getDangerStatusData();
		var image = "res/img/"+dtd.code+"_"+status+(status == 'warning' ? ".gif" : ".png");

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

	//更新了坐标
	updateLng: function(){

	} , 

	updateLat: function(){

	} , 

	updateLngLat: function(){


	} , 

	//更新了区域的位置
	updateLngLats: function(){
		alert(111111);

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
		if (this.marker){
			var marker = this.marker;
			//if (!marker) return;
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
	   	} else if (this.polygon){
	   		var polygon = this.polygon;
			var map = polygon.getMap();
			if (!map) return;
			var point = polygon.getBounds().getCenter();
			map.panTo(point);	

	   	}
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
				//从STORE中删除
				var storeClass = Ext.getClassName(this.store);
				if (storeClass.indexOf("NodeStore")>-1){	//树
					this.remove();
				}else{
					this.store.remove(this);	//普通
				}

				MB.hide();
			},
			failure: $failure ,
			scope: this
		});	
	} , 


	stop: function(){
		MB.loading("停止"+this.get("dangername")+"监控");
		setTimeout(function(){
			MB.hide();
			PM.msg("成功" , "已经停止监控!");
		} , 1000);	
	} , 

	stopWarning: function(){
		var me = this;
		MB.loading("忽略"+this.get("dangername")+"当前的预警");
		setTimeout(function(){
			me.set("status" , "ok");
			me.commit();
			MB.hide();
			PM.msg("成功" , "当前已经忽略"+me.get("dangername")+"预警!");
		} , 500);
	} , 

	detail: function(){
		if (!this.detailWin) {
			this.detailWin = Ext.create("WXY.util.AppWindow" , {
				width:500 , 
				height:300 , 
				iconCls:"ico_detail" , 
				items:[
					{xtype:"panel"	 , bodyPadding:10}
				]
			})
		}
		
		if (!this.detailTemplate) {
			this.detailTemplate = new Ext.XTemplate(
				'<ul style="line-height:200%">' , 
				'<li style="border-bottom:#eee solid 1px">ID: {dangerid}</li>' ,
				'<li style="border-bottom:#eee solid 1px">状态: {status}</li>' ,
				'<li style="border-bottom:#eee solid 1px">类别: {dangertypename}</li>' ,
				'<li style="border-bottom:#eee solid 1px">名称: {dangername}</li>' ,
				'<li style="border-bottom:#eee solid 1px">编码: {dangercode}</li>' ,
				'<li style="border-bottom:#eee solid 1px">坐标: {lnglat}</li>' ,
				'<li style="border-bottom:#eee solid 1px">位置: {location}</li>' ,
				'<li style="border-bottom:#eee solid 1px">地址: {address}</li>' ,
				'<li style="border-bottom:#eee solid 1px">备注: {description}</li>' ,
				'</ul>'
			)			
		}		
		this.detailWin.show();				
		this.detailWin.setTitle("查看 "+this.get("dangername")+" 信息");

		var p = this.detailWin.down("panel");
		p.update(this.detailTemplate.apply(this.data));	
	}

})