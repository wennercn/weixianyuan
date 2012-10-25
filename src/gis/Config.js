/**
 * 配置
 */
Ext.define("WXY.gis.Config" , {
	singleton: true , 

	dangerTypeData:{
		1: {name:'传感器' , code:'sensor'} , 
		2: {name:'监控摄像头' , code:'webcam'}
	} , 

	dangerStatusData: {
		ok : '正常' , 
		disable : '停用' , 
		unkonw: '未知' , 
		disconnect: '未连接' , 
		warning: '警告'
	} ,

	locationComboData: ['华天道' , '梅苑路'] , 

	constructor: function(config) {
		var me = this;
		me.dangerTypeComboData = [];

		Ext.iterate(me.dangerTypeData , function(key , v){
			me.dangerTypeComboData.push([key , v.name]);
		});
    }	
});