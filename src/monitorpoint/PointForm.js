/**
* 设备点表单
*/
Ext.define("WXY.monitorpoint.PointForm" , {
    extend: 'Ext.form.Panel',
    xtype: 'monitorpointform-point' , 
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
				{xtype:"combobox" , fieldLabel:"所属作业区" , name:"parentid", store:"space-store" , editable:false , 
					valueField:"dangerid" , displayField:"dangername" , queryMode: 'local' , allowBlank:false , afterLabelTextTpl:req} ,
				{xtype:"mycombo" , fieldLabel:"类型" , name:"dangertype" , _data:configData.dangerTypeComboData , 
					allowBlank:false , value:'sensor' , editable:false , afterLabelTextTpl:req} , 
				{fieldLabel:"名称"  , name:"dangername" , allowBlank:false , afterLabelTextTpl:req},
				{fieldLabel:"物理编码"  ,  name:"dangercode" , allowBlank:false , afterLabelTextTpl:req} ,
				{fieldLabel:"位置坐标"  , name:"lnglat" , allowBlank:false , readOnly:true ,afterLabelTextTpl:req} , 
				{xtype:"mycombo" , fieldLabel:"状态" , name:"status" , _data:[['ok' , '正常'] , ['disable' , '停用']] , value:'ok' , editable:false} , 
				//{xtype:"mycombo" , fieldLabel:"所在位置" , name:"location" , _data:configData.locationComboData} , 
				//{fieldLabel:"地址说明"  , name:"address"} ,
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
			success: function(data){
				this.fireEvent("aftersave" , data , this.record , this.curMPValues);
			},
			failure: $failure ,
			scope: this
		});
	}
});