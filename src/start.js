Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath({
	'Ext.ux' :'jslib/ext/ux' ,
	'WXY' : 'src' ,
	'Ext' : 'jslib/ext'
});
Ext.BLANK_IMAGE_URL = "ext/resources/s.gif";
Ext.require([
	'WXY.App' , 
	'WXY.Common' ,  
	'WXY.admin.Admin'
]);
Ext.onReady(function(){
	$APP.check();
});