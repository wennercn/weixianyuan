Ext.define("WXY.dangers.store.Dangers" , {
	extend:"Ext.data.Store" ,
	requires: ["WXY.dangers.model.Dangers"],
	model: 'WXY.dangers.model.Dangers',
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