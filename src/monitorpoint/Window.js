Ext.define("WXY.monitorpoint.Window" , {
	extend:"WXY.util.AppWindow" , 
	requires:[
		'WXY.monitorpoint.AreaForm' , 
		'WXY.monitorpoint.SpaceForm' , 
		'WXY.monitorpoint.PointForm'
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
		options = options || {};
		var kind = options.kind || "point";
		var form = this[kind+"-form"];
		if (!form){
			this[kind+"-form"] = Ext.widget({
				xtype: 'monitorpointform-'+kind , 
				listners:{
					beforesave: this.save , 
					scope: this
				}
			});
			form = this[kind+"-form"];
			this.add(form);
		}
		this.show();
		this.setCardActive(form , options);
	}
});