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

    tipTemplate:"{dangername}", 
    tipCls:'mp-tip' , 

    initComponent : function(){
        var me = this;

        this.addEvents("mapctxmenu" , "markerctxmenu");
        if (Ext.isString(me.tipTemplate) || Ext.isArray(me.tipTemplate)){
            me.tipTemplate = new Ext.XTemplate(me.tipTemplate);
        }

        me.callParent();
    },

    afterFirstLayout : function(){
        var me = this;
        me.callParent()
        me.setLoading("读取数据信息");
        me.createMap();
    },

    //创建地图
    createMap: function(center) {
        var me = this; 
        //创建地图
        me.map = new BMap.Map(this.body.dom);
        var map = me.map;

        //设置时间
        //右键
        map.addEventListener("rightclick", function(obj){
            //obj: type, target, point, pixel, overlay
            me.fireEvent('mapctxmenu' , obj , obj.domEvent);
        });

        //如果已经添加了一个点,认为已经load
        map.addEventListener('addoverlay' , function(){
            var ols = map.getOverlays();
            if (ols.length == 1){
                me.fireEvent('mapload');
                me.setLoading(false);           
            }
        })


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

        //设置信息框
        this.setTip(); 
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

    setTip: function(){
        var me = this;
        me.tip = Ext.create('Ext.tip.ToolTip', {
            target: me.getEl(),
            dismissDelay: 0 , 
            showDelay: 0 , 
            delegate: ".BMap_Marker",
            cls: me.tipCls , 
            trackMouse: true,
            renderTo: me.body,
            listeners: {
                beforeshow: function updateTipBody(tip) {
                    var marker = me.getOverlayByElement(tip.triggerElement);
                    if (!marker) return false;
                    var record = marker.record;
                    tip.update(me.tipTemplate.apply(record.data));
                }
            }
        });

    } , 

    //通过HTML标记查找MARKER
    getOverlayByElement: function(element){
        var ols = this.map.getOverlays();
        var ol = null;
        Ext.each(ols , function(n , i){
            if (n.domElement == element) {
                ol = n;
                return false;
            }
        })
        return ol;
    } , 

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

    afterComponentLayout : function(w, h){
        this.callParent(arguments);
        this.redraw();
    },

    redraw: function(){
    } , 

    removeMarkerFromRecord: function(record){
        var map = this.map;
        map.removeOverlay(record.marker);
    } , 

    addMarkerFromRecord: function(record , options){
        var me = this;
        options = options || {};

        if (Ext.isArray(record)){
            Ext.each(record , function(n , i){
                me.addMarkerFromRecord(n , options);
            } , me);
            return;
        }
        var map = me.map;
        //添加标注点
        //TODO: 改为自定义的标记

        var marker = record.setMarker(options);
        if (!marker) return;

        map.addOverlay(marker);
        marker.setAnimation(BMAP_ANIMATION_DROP);

        marker.addEventListener("rightclick" , function(e){
            me.fireEvent('markerctxmenu' , e , record , e.domEvent);
        });

        return marker;

    }
});
