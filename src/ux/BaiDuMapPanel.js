Ext.define('Ext.ux.BaiDuMapPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.bmappanel',
    initComponent : function(){
        Ext.applyIf(this,{
            plain: true,
            gmapType: 'map',
            border: false
        });
        this.callParent();
    },

    afterFirstLayout : function(){
        var center = this.center;
        this.callParent();

        if (center) {
            if (center.geoCodeAddr) {
                this.lookupCode(center.geoCodeAddr, center.marker);
            } else {
                this.createMap(center);
            }
        } else {
            Ext.Error.raise('center is required');
        }

    },

    createMap: function(center, marker) {
        options = Ext.apply({}, this.mapOptions);
        options = Ext.applyIf(options, {
            zoom: 14,
            center: center
            //mapTypeId: google.maps.MapTypeId.HYBRID
        });



        this.gmap = new BMap.Map(this.body.dom)//, options);
		var point = new BMap.Point(117.7482,  38.9730);  // 创建点坐标
		this.gmap.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别
		return
        if (marker) {
            this.addMarker(Ext.applyIf(marker, {
                position: center
            }));
        }

        Ext.each(this.markers, this.addMarker, this);
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

    lookupCode : function(addr, marker) {
        this.geocoder = new google.maps.Geocoder();
        this.geocoder.geocode({
            address: addr
        }, Ext.Function.bind(this.onLookupComplete, this, [marker], true));
    },

    onLookupComplete: function(data, response, marker){
        if (response != 'OK') {
            Ext.MessageBox.alert('Error', 'An error occured: "' + response + '"');
            return;
        }
        this.createMap(data[0].geometry.location, marker);
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
