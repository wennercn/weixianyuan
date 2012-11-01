Ext.define("WXY.monitorpoint.store.MonitorPoint" , {
	extend:"Ext.data.Store" , 
	requires: [	'WXY.gis.Config' , "WXY.monitorpoint.model.MonitorPoint"] ,
	model: 'WXY.monitorpoint.model.MonitorPoint',
	constructor: function(config){
		var me = this;
		me.proxy = {
			type: 'ajax',
			url: config.url || "" ,
			extraParams: config.extraParams || {} ,
			reader: {
				type: 'xml',
				record: config.recordPath || 'Danger'
			} ,
			listeners: {
				"exception" : function(proxy , data , operation){
					MB.alert("错误" , data.responseText);
					return;
				}
			}
		};
		this.callParent([config]);
	}
});