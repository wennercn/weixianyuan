Ext.define("WXY.common.Store" , {
	extend: "Ext.data.Store" ,
    requires: ['Ext.data.reader.Xml'],
	constructor: function(config){
		config = config || {};
		if (!config.proxy) {
			config.proxy = {
				type: 'ajax',
				url: wsurl ,
				extraParams: config.action ? {action: config.action} : "" ,
				reader: {
					type: 'xml',
					record: config.recordPath || 'row'
				}
			}
		}

		ls = config.listeners || {};
		Ext.applyIf(ls , {
			load: function(st , rs){
				var data = st.getProxy().getReader().rawData;
				var bd = $back(data);
				if (!bd.isok){
					MB.alert("错误" , bd.getErrorInfo());
				}
			}
		})
		config.listeners = ls;

		this.callParent([config]);
	}
	//sorters:[]
    //sortInfo: {property: 'pubDate',direction: 'DESC'}
});