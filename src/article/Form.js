/**
* 文章信息表单
*/
Ext.define("WXY.article.Form" , {
    extend: 'Ext.form.Panel',
	bodyPadding:15 ,
	defaults: {
		labelAlign:"left" ,
		labelWidth: 75 ,
		anchor:"100%" ,
		padding:"3 0 3 0" ,
		msgTarget: 'side' ,
		inputType: "password"
	},
	defaultType:"textfield" ,
    initComponent: function(){
		var req = "<span style='color:red'>*</span>";
		Ext.apply(this , {
			items: [
				{xtype:"fieldcontainer" , layout:"hbox" , fieldLabel:"所属分类" , afterLabelTextTpl:req , items:[
					{xtype: "mycombo" , name:"catalog" , allowBlank:false , _data:["fasdfasdf" , "fasdfasdf"] , flex:1} ,
					{xtype:"button" , text:"分类管理" , handler:this.showCataLog , scope:this , margin:"0 0 0 5"}
				]} , 
				{fieldLabel: "标题" , name:"title" , allowBlank:false , afterLabelTextTpl:req} ,
				{xtype:"textarea" , fieldLabel: "内容" , name:"content" , allowBlank:false , anchor:"100% -90" , afterLabelTextTpl:req}
			] ,
			dockedItems: [
				{xtype:"toolbar" , dock:"top" , items:[
					{text:"返回列表" , iconCls:"ico_back" ,  handler:this.backToList , scope:this} , 
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
		this.win = this.up("window");
		this.win.setTitle("添加 "+this.win.moduleConfig.type +" 内容");
		if (config.disableInit) return;
		this.getForm().reset();
	} , 
	//返回列表
	backToList: function(){
		this.win.setCardActive(this.win.list);
	} , 
	//分类管理
	showCataLog: function(){
		if (!this.win.catalog){
			this.win.catalog = this.win.add(
				Ext.create("WXY.article.Catalog")
			);
		}
		this.win.setCardActive(this.win.catalog);
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

		var pa = {};
		var xml = json2xml(fv , "form");

		pa.data = escape(xml);

		Ext.Ajax.request({
			url: "ws/article.asmx/Save" ,
			params: pa ,
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
			this.backToList();
		}else{
			MB.alert("错误","保存信息时发生错误!<br>"+bd.getErrorInfo());
		}
	}

});