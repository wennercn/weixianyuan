Ext.define("WXY.monitorpoint.Window" , {
	extend:"WXY.util.AppWindow" , 
	requires:[
		'WXY.monitorpoint.Form'
	] , 
	id: 'monitorpoint-window' , 
	width:550 , 
	height:400 , 
	layout:'card' , 
	wsUrl: $CONFIG.wsPath+"monitorpoint.asmx/" , 	
	initComponent: function(){
		var me = this;
		me.callParent();
	} , 

	//显示表单
	showForm: function(options){
		if (!this.form){
			this.form = Ext.widget({
				xtype: 'monitorpointform'
			});
			this.add(this.form);
		}
		this.show();
		this.setCardActive(this.form , options);
	}

});