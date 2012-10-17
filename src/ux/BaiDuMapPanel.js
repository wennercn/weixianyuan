/**
 * 百度地图
 */
Ext.define('WXY.ux.BaiDuMapPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'baidumap',
    border: false ,

    mapCenterLng: 117.131169 ,//默认中心的经度
    mapCenterLat: 39.102512 , //默认中心的纬度
    mapZoom: 14 ,               //默认缩放级别

    initComponent : function(){
        var me = this;
        me.callParent();
    },

    afterFirstLayout : function(){
        this.callParent();
        this.createMap();
    },

    //创建地图
    createMap: function(center) {
        var me = this;
        //创建地图
        me.map = new BMap.Map(this.body.dom);

		var map = me.map;
        //初始化
        var cpoint = new BMap.Point(me.mapCenterLng,me.mapCenterLat);
        map.centerAndZoom(cpoint, me.mapZoom);

        //添加控件
        //缩放导航
		map.addControl(new BMap.NavigationControl()); 
        /*
        //地图类型
        map.addControl(new BMap.MapTypeControl({
            anchor: BMAP_ANCHOR_TOP_RIGHT , 
            offset: new BMap.Size(15, 10)
        }));
        */

		//允许滚轮
		map.enableScrollWheelZoom()

        //设置中心位置
        this.setCenter();
    } , 
    //设置中心点
    setCenter: function(){
        var me = this;       

        //定位当前位置
        if (me.useLocation == true){
            var gl = new BMap.Geolocation();
            gl.getCurrentPosition(function(point){
                if(gl.getStatus() == BMAP_STATUS_SUCCESS){
                    me.map.setCenter(point);
                }        
            });
        //根据地址获取坐标
        }else if(me.mapCenterAddress){
             me.findAddress(me.mapCenterAddress , me.mapCenterCity);           
        }

    },

    //通过地址查找中心点坐标
    findAddress : function(address , city) {
        var me = this;
        //地址解析器
        var geoCoder = new BMap.Geocoder();
        //获取指定地址的坐标
        geoCoder.getPoint(
            address , 
            function(point){
                me.map.setCenter(point);
            } , 
            city
        );
    },

    addMarker: function(marker) {
        marker = Ext.apply({
            map: this.gmap
        }, marker);

        if (!marker.position) {
            marker.position = new google.maps.LatLng(marker.lat, marker.lng);
        }
        var o =  new google.maps.Marker(marker);
        Ext.Object.each(marker.listeners, function(name, fn){
            google.maps.event.addListener(o, name, fn);
        });
        return o;
    },

    afterComponentLayout : function(w, h){
        this.callParent(arguments);
        this.redraw();
    },

    redraw: function(){
        var map = this.gmap;
        if (map) {
            //google.maps.event.trigger(map, 'resize');
        }
    }

});
