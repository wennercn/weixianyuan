Ext.define("WXY.article.store.Article" , {
	extend:"Ext.data.Store" , 
	requires: ["WXY.article.model.Article"] ,
	model: 'WXY.article.model.Article',
	sorters: [
		{property:"sort" , direction:"ASC"} , 
		{property:"etb1" , direction:"ASC"} 
	] , 
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