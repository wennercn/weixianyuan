Ext.define("WXY.dangers.store.Catalog" , {
	extend:"Ext.data.Store" , 
	requires: ["WXY.dangers.model.Catalog"] ,
	model: 'WXY.dangers.model.Catalog',
	constructor: function(config){
		var me = this;
		me.proxy = {
			type: 'ajax',
			url: config.url || "" ,
			extraParams: config.extraParams || {} ,
			reader: {
				type: 'xml',
				record: config.recordPath || 'R'
			} ,
			listeners: {
				"exception" : function(proxy , data , operation){
					MB.alert("错误" , data.responseText);
					return;
				}
			}
		}
		this.callParent([config]);
	}
});