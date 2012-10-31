/**
 * 配置
 */
Ext.define("WXY.gis.Config" , {
	singleton: true , 

	dangerKindData: {
		area: {name:'区域' , code:'area'} , 
		space: {name:'工作区' , code:'space'} , 
		point: {name:'设备点' , code:'point'}
	} , 

	dangerTypeData:{
		sensor: {name:'传感器' , code:'sensor'} , 
		webcam: {name:'监控摄像头' , code:'webcam'} , 
		machine: {name:'控制设备' , code:'machine'}
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

		me.dangerKindComboData = [];

    }	
});