Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath({
	'Ext.ux' :'jslib/ext/ux' ,
	'WXY' : 'src' ,
	'Ext' : 'jslib/ext'
});
Ext.BLANK_IMAGE_URL = "jslib/ext/resources/s.gif";
//加载必须的文件
Ext.require([
	'WXY.GlobolConfig' , 
	'WXY.App' , 
	'WXY.Common' ,  
	'WXY.admin.Admin' , 
	'WXY.util.ParseResponse' , 	
]);
Ext.onReady(function(){
	$APP.check();
});