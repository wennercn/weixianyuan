/**
 * 配置
 */
Ext.define("WXY.GlobolConfig" , {
	singleton: true , 
	version:"1.0.0" , 
	homeModule : "gis.Index" , 
	wsPath: "http://192.168.0.120/weixianyuanservice/" , 
	ServerDate: new Date() , 
	constructor: function(config) {
		var me = this;
		setInterval(function(){
			me.ServerDate = Ext.Date.add(me.ServerDate , Ext.Date.SECOND , 1);	
		} , 1000);
    }	
});
window.$CONFIG = WXY.GlobolConfig;