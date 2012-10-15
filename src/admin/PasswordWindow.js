/**
* 修改密码窗口
*/
Ext.define("WXY.admin.PasswordWindow" , {
    extend: 'Ext.Window',
	title: "修改密码" ,
	iconCls:"ico_password" ,
	closeAction: "hide" ,
	width: 300 ,
	height: 200 ,
	layout:"fit" ,
    initComponent: function(){

		this.form = Ext.create("Ext.form.Panel" , {
			border: false ,
			bodyPadding:15 ,
			fieldDefaults: {
				labelAlign:"left" ,
				labelWidth: 75 ,
				anchor:"100%" ,
				padding:"3 0 3 0" ,
				msgTarget: 'side' ,
				inputType: "password"
			},
			defaultType:"textfield" ,
			items: [
				{fieldLabel: "<b>原密码</b>" , name:"opass" , allowBlank:false} ,
				{fieldLabel: "<b>新密码</b>" , name:"npass" , allowBlank:false} ,
				{fieldLabel: "<b>新密码确认</b>" , name:"vpass" , allowBlank:false}
			]
		});

		Ext.apply(this , {
			items: this.form ,
			dockedItems: [
				{xtype:"panel" , bodyCls:"dock_tip" , html:"请在下面填写各项内容"} , 
			] , 
			buttons:[
				{text:"保存密码" , iconCls:"ico_save" ,   handler:this.save , scope:this} ,  '-' ,
				{text:"关闭窗口" , iconCls:"ico_cancel" ,  handler:function(){this.hide()} , scope:this}
			]
		});
		this.callParent();
	} , 

	open: function(){
		this.form.getForm().reset();
		this.show();
	} , 

	//保存
	save: function(){
		var f = this.form.getForm();
		var valid = f.isValid();
		if (!valid){
			MB.alert("错误","请填写每项密码信息!"  , this);
			return;
		}
		var fv = f.getValues();
		if (fv.npass != fv.vpass) {
			MB.alert("错误" , "两次输入的新密码不相同,请检查!");
			return;
		}

		if (fv.opass == fv.npass) {
			MB.alert("错误" , "原密码与新密码相同!");
			return;
		}

		MB.loading("保存密码")

		Ext.Ajax.request({
			url: "ws/admin.asmx/UpdatePassword" ,
			params: fv ,
			success: this._save,
			failure: $failure ,
			scope: this
		});
	} ,

	_save: function(o){
		var bd = $back(o)
		if (bd.isok){
			MB.hide();
			this.hide();
			PM.msg("保存成功" , "已经成功修改您的密码!");
		}else{
			MB.alert("错误","保存信息时发生错误!<br>"+bd.getErrorInfo());
		}
	}

});