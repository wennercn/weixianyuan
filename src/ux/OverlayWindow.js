Ext.define("WXY.ux.OverlayWindow" , {
	extend: "Ext.Window" , 
	width:800 ,
	height: 600 ,
	closeAction:"hide" ,
	border:true ,
	layout:"fit" , 
	maximizable: true ,
	title: "位置信息选取" , 

	_type:"mousetool",
	_events:[],
	
	marker:{},
	polyline:{},
	polygon:{},
	rectangle:{},
	circle:{},
	rule:{},
	measureArea:{},
	rectZoomIn:{},
	rectZoomOut:{} , 
	
	_mkr:{},//测距POI数组

	initComponent: function(){
		this.mpanel = Ext.widget("baidumap" , {
		});
		this.map = this.mpanel.map;
		this.items = this.mpanel;

		this.dockedItems = [
			{xtype:"toolbar" , dock:'top' , items:[
				'->' , 
				{text:"<b>确认当前坐标</b>" , iconCls:"ico_save" , handler:this.save , scope:this}
			]} , 
			{xtype:"panel" , html:"fasdfasdf" ,autoHeight:true , bodyPadding:10}
		];
		this.callParent();


	} , 

	open: function(options){
		options = options || {};
		if (!options.action) return;
		this.curAction = options.action;
		this.show();
		this.reset(options);
	} , 

	reset: function(options){
		this.map = this.mpanel.map;
		this.options = options;
		var map = this.map;

		if (options.mapZoom) map.setZoom(options.mapZoom);
		if (options.mapCenter) map.setCenter(options.mapCenter);
		map.clearOverlays();
		//去掉当前所有的事件
		this.removeEvents();

		//开始执行当前操作
		var action = this.curAction;
		action = action.substring(0 , 1).toUpperCase()+action.substring(1);
		action = (options.data ? "set" : "draw") + action;
		if (this[action]) this[action].call(this , options);
	} , 

	//保存数据
	save: function(){
		var action = this.curAction;
		action = "get"+action.substring(0 , 1).toUpperCase()+action.substring(1);
		var values;
		if (this[action]) values = this[action].call(this);
		if (!values) return;
		if (this.options.targetField){
			this.options.targetField.setValue(values);
			this.hide();	
		}
	} , 

	removeEvents: function(){
		var events = this._events;
		Ext.each(events , function(n){
			this.map.removeEventListener(n.type , n.ck);
		} , this);
		this._events = [];
	} , 


	/*
	 * 多边形操作
	 */
	//画多边形
	drawPolygon:function(opt){
		var me = this,map = this.map,opt = opt || {};

		//多边形覆盖物
		var poly = false;
		var ck = function(e){
			if(poly==false){//第一次添加覆盖物
				poly =  new BMap.Polygon([
					e.point , e.point
				] , {
					strokeColor:opt.strokeColor || "#1791fc",
					strokeOpacity:opt.strokeOpacity || 0.8,
					strokeWeight:opt.strokeWeight || 2,
					fillColor:opt.fillColor || "#1791fc",
					fillOpacity:opt.fillOpacity || 0.35 , 
					enableEditing: false
				});
				map.addOverlay(poly);
				map.disableDoubleClickZoom(); //禁止鼠标双击地图放大
			}else{//修改线覆盖物
				var arr = poly.getPath();
				var last = arr.pop();//删除最后一个元素
				arr.push(e.point,last);
				poly.setPath(arr);
			}
		};
				//注册单击事件，添加或编辑线，添加点覆盖
		this._events.push({type:"click",ck:ck});
		map.addEventListener("click",ck);

		
		//鼠标移动，更改线位置
		var mv = function(e){
			if(poly){
				var arr = poly.getPath();
				arr.pop();//删除最后一个元素
				arr.push(e.point);
				poly.setPath(arr);
			}
		};
		
		this._events.push({type:"mousemove",ck:mv});
		map.addEventListener("mousemove",mv);
		
		
		//注册双击事件，停止画线
		var dbl = function(e){
			me.polygon.object = poly;
			me.polygon.object.enableEditing();
			me.removeEvents();
			//map.trigger(me,"draw",poly);
			poly = false;
			map.enableDoubleClickZoom(); //还原鼠标双击地图状态

		};
		this._events.push({type:"dblclick",ck:dbl});
		map.addEventListener("dblclick",dbl);
		
		//注册右键单击事件，停止画多边形
		var rg = function(){
			if(poly){
				var arr = poly.getPath();
				arr.pop();//删除最后一个元素
				poly.setPath(arr);
				me.polygon.object = poly;	
				me.polygon.object.enableEditing();
				me.removeEvents();
			}
			//map.trigger(me,"draw",poly);
			poly = false;
			map.enableDoubleClickZoom(); //还原鼠标双击地图状态

		};
		this._events.push({type:"rightclick",ck:rg});
		map.addEventListener("rightclick",rg);

	} , 

	getPolygon: function(){
		var poly = this.polygon.object;
		if (!poly){
			MB.alert("错误" , "请在地图上画出区域!");
			return false;
		}
		var path = poly.getPath();
		var paths = [];
		Ext.each(path , function(n){
			paths.push([n.lng , n.lat]);
		});
		return paths.join(";");
	} , 

	setPolygon: function(options){
		var me = this,map = this.map,opt = opt || {};
		var lnglats = options.data;
		if (!lnglats) return;

		var path = [];
		Ext.each(lnglats.split(";") , function(n){
			var point = n.split(",");
        	path.push(new BMap.Point(point[0], point[1]));
		});

		var polygonOptions = {
			strokeColor:options.strokeColor || "#1791fc",
			strokeOpacity:options.strokeOpacity || 0.8,
			strokeWeight:options.strokeWeight || 2,
			fillColor:options.fillColor || "#1791fc",
			fillOpacity:options.fillOpacity || 0.4 , 
			enableEditing: true 
		};

		var polygon =  new BMap.Polygon(path , polygonOptions);
		this.polygon.object = polygon;
        map.addOverlay(polygon);

	}
});