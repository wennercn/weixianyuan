/**
* 工作区表单
*/
Ext.define("WXY.monitorpoint.SpaceForm" , {
    extend: 'Ext.form.Panel',
    xtype: 'monitorpointform-space' , 
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
    	var configData = WXY.gis.Config;
		var req = "<span style='color:red'>*</span>";
		Ext.apply(this , {
			items: [
				{xtype:"combobox" , fieldLabel:"所属作业区" , name:"parentid", store:"area-store" , editable:false , 
					valueField:"dangerid" , displayField:"dangername" , queryMode: 'local' , allowBlank:false , afterLabelTextTpl:req} ,
				{fieldLabel:"名称"  , name:"dangername" , allowBlank:false , afterLabelTextTpl:req},
				{fieldLabel:"区域坐标"  , name:"lnglats" , allowBlank:false , readOnly:true ,afterLabelTextTpl:req} , 
				{fieldLabel:"地址说明"  , name:"address"} ,
				{fieldLabel:"备注"  , xtype:"textarea" , name:"description"},
				{xtype:'hidden' , name:'dangerid' , value:0},
				{xtype:'hidden' , name:'kind' , value:"space"}
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
		this.win.setTitle("添加工作区");
		this.win.setIconCls('ico_add');
		if (config.disableInit) return;
		this.getForm().reset();
		var values = null;
		if (config.data){
			values = config.data;
		}else if(config.record){
			this.record = config.record;
			this.win.setTitle("修改工作区 " +this.record.get("dangername")+ " 信息");
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
		this.curMPValues = fv;
		MB.loading("保存信息");

		Ext.Ajax.request({
			url: this.win.wsUrl+"Save" , //(this.record ? "UpdateKnowledge" : "AddKnowledge") ,
			params: $params(fv) ,
			success: function(data){
				this.fireEvent("aftersave" , data , this.curMPValues);
			},
			failure: $failure ,
			scope: this
		});
	}
});