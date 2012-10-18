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
				{xtype:"mycombo" , fieldLabel:"类型" , name:"dangertype" , _data:[[1, "传感器"] ,[2 , "监控摄像头"]] , allowBlank:false , value:1 , editable:false} , 
				{fieldLabel:"名称"  , name:"dangername" , allowBlank:false},
				{fieldLabel:"物理编码"  ,  name:"dangercode" , allowBlank:false} ,
				{fieldLabel:"位置坐标"  , name:"lnglat" , allowBlank:false} , 
				{xtype:"mycombo" , fieldLabel:"所在位置" , name:"location" , _data:[["华天道" ,"梅苑路"]]} , 
				{fieldLabel:"地址说明"  , name:"address"} ,
				{fieldLabel:"备注"  , xtype:"textarea" , name:"description"},
				{xtype:'hidden' , name:'dangerid' , value:0}
			] ,
			dockedItems: [
				{xtype:"toolbar" , dock:"top" , items:[
					{text:"返回列表" , iconCls:"ico_back" ,  handler:function(){
						this.backToList(false)
					} , scope:this} , 
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
		if (config.record){
			this.record = config.record;
			this.win.setTitle("修改 " +this.record.get("dangername")+ " 信息");
			this.win.setIconCls('ico_edit');
			this.getForm().loadRecord(this.record);
		}
		var prevPanel = this.win.prevPanel;
		if (!prevPanel || prevPanel == this){
			this.down("button[iconCls=ico_back]").hide();
		}
	} , 
	//返回列表
	backToList: function(loadstore){
		this.win.setCardActive(this.win.list , {disableInit:!loadstore});
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
		var bd = $back(o);
		if (bd.isok){
			MB.hide();
			PM.msg("保存成功" , "保存信息成功!");
			//this.backToList(true);
		}else{
			MB.alert("错误","保存信息时发生错误!<br>"+bd.getErrorInfo());
		}
	}

});