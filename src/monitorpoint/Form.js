/**
* 监控点表单
*/
Ext.define("WXY.monitorpoint.Form" , {
    extend: 'Ext.form.Panel',
    xtype: 'monitorpointform' , 
	bodyPadding:15 ,
	defaults: {
		labelAlign:"left" ,
		labelWidth: 75 ,
		anchor:"100%" ,
		padding:"3 0 3 0" ,
		msgTarget: 'side'
	},
	defaultType:"textfield" ,
    initComponent: function(){
		var req = "<span style='color:red'>*</span>";
		Ext.apply(this , {
			items: [
				{xtype:"mycombo" , fieldLabel:"类型" , name:"dangertype" , _data:[['1', "传感器"] ,['2' , "监控摄像头"]] , 
					allowBlank:false , value:'1' , editable:false , afterLabelTextTpl:req} , 
				{fieldLabel:"名称"  , name:"dangername" , allowBlank:false , afterLabelTextTpl:req},
				{fieldLabel:"物理编码"  ,  name:"dangercode" , allowBlank:false , afterLabelTextTpl:req} ,
				{fieldLabel:"位置坐标"  , name:"lnglat" , allowBlank:false , readOnly:true ,afterLabelTextTpl:req} , 
				{xtype:"mycombo" , fieldLabel:"所在位置" , name:"location" , _data:["华天道" ,"梅苑路"]} , 
				{fieldLabel:"地址说明"  , name:"address"} ,
				{fieldLabel:"备注"  , xtype:"textarea" , name:"description"},
				{xtype:'hidden' , name:'dangerid' , value:0}
			] ,
			dockedItems: [
				{xtype:"toolbar" , dock:"top" , items:[
					'->' , 
					{text:"<b>保存信息</b>" , iconCls:"ico_save" ,   handler:this.save , scope:this}
				]}
			]
		});
		this.callParent();
	} , 
	//初始化
	initMain: function(config){	
		config = config || {};
		this.record = null;
		this.win = this.up("window");
		this.win.setTitle("添加监控点");
		this.win.setIconCls('ico_add');
		if (config.disableInit) return;
		this.getForm().reset();
		var values = null;
		if (config.data){
			values = config.data;
		}else if(config.record){
			this.record = config.record;
			this.win.setTitle("修改 " +this.record.get("dangername")+ " 信息");
			this.win.setIconCls('ico_edit');
			values = this.record.data;
			//this.getForm().loadRecord(this.record);
		}
		this.getForm().setValues(values);

		/*
		var prevPanel = this.win.prevPanel;
		if (!prevPanel || prevPanel == this){
			this.down("button[iconCls=ico_back]").hide();
		}
		*/
	} , 

	//保存
	save: function(){
		var f = this.getForm();
		var valid = f.isValid();
		if (!valid){
			MB.alert("错误","请填写必填信息!"  , this);
			return;
		}
		var fv = f.getValues();
		if (fv.lnglat.indexOf(",")==-1){
			MB.alert("错误","请选择监控点的坐标信息!"  , this);
			return;
		}
		var lnglat = fv.lnglat.split(",");
		fv.lng = lnglat[0];
		fv.lat = lnglat[1];

		this.curMPValues = fv;

		MB.loading("保存信息");

		/*
		var pa = {};
		var xml = json2xml(fv , "form");
		pa.data = escape(xml);
		*/

		Ext.Ajax.request({
			url: this.win.wsUrl+"Save" , //(this.record ? "UpdateKnowledge" : "AddKnowledge") ,
			params: $params(fv) ,
			success: this._save,
			failure: $failure ,
			scope: this
		});
	} ,

	_save: function(o){
		var bd = $backNode(o);
		if (bd.isok){
			MB.hide();
			PM.msg("保存成功" , "保存信息成功!");
			var store = Ext.data.StoreManager.lookup('mp-store');
			if (this.curMPValues.dangerid == 0){
				var reader = store.getProxy().getReader();
				var rs = reader.readRecords(bd.data);	
				store.add(rs.records);							
			}else{
				this.record.set(this.curMPValues);
				this.record.commit();
			}
			this.win.hide();
		}else{
			MB.alert("错误","保存信息时发生错误!<br>"+bd.getErrorInfo());
		}
	}

});