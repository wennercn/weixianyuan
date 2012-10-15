Ext.define("WXY.article.store.Catalog" , {
	extend:"Ext.data.Store" , 
	requires: ["WXY.article.model.Catalog"] ,
	model: 'WXY.article.model.Catalog',
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