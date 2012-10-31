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
					aftersave: this.onSaved , 
					scope: this
				}
			});
			form = this[kind+"-form"];
			this.add(form);
		}
		this.show();
		this.setCardActive(form , options);
	} , 

	onSaved: function(data , record , curvalues){
		alert(111111111)
		var bd = $backNode(data);
		if (bd.isok){
			MB.hide();
			PM.msg("保存成功" , "保存信息成功!");
			var store = Ext.data.StoreManager.lookup('mp-store');
			if (curvalues.dangerid == 0){
				var reader = store.getProxy().getReader();
				var rs = reader.readRecords(bd.data);	
				store.add(rs.records);							
			}else{
				record.set(this.curMPValues);
				record.commit();
			}
			this.hide();
			MB.alert("错误","保存信息时发生错误!<br>"+bd.getErrorInfo());
		}else{
			MB.alert("错误","保存信息时发生错误!<br>"+bd.getErrorInfo());
		}

	}
});