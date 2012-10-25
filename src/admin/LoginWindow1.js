Ext.define('WXY.admin.LoginWindow' , {
	extend: "Ext.Window" ,
	initComponent: function(){
		this.addEvents(
			'afterlogin'
		);
		var form = this.formpanel = Ext.create("Ext.form.FormPanel" , {
			bodyPadding:"150 0 0 0" ,
			border:false ,
			bodyCls: "loginwin" ,
			fieldDefaults: {
				msgTarget: 'side',
				labelWidth: 50 ,
				margin:"15 0 0 330" ,
				labelStyle:"font:bold 14px tahoma;font-size:14px"
			},
			defaultType: 'textfield',
			items:[
				{xtype:"hidden" , name:"action" , value:"login"} ,
				//{fieldLabel:"用户名" , itemId:"username" , name:"u_name" , allowBlank:false} ,
				Ext.create("Ext.ux.myCombo" , {
					fieldLabel:"用户名" ,
					mode: 'local' ,
					queryMode:"local" ,
					triggerAction: 'all' ,
					itemId:"username" ,
					name:"u_name" , 
					allowBlank:false , 
					blankText:"请输入用户名!"
				}) ,
				{inputType:"password" , type:"password" , fieldLabel:"密码" , itemId:"password" , name:"u_pass" , allowBlank:false , blankText :"请输入密码!"}
			]
		})

		this.btn = Ext.create("Ext.button.Button" , {text:"<B> 登录 </B>" , scale:"medium" ,	cls:"login_btn" , itemId:"login_btn" , iconCls:"icon_savemedium" , handler:this.login , scope:this});

		Ext.apply(this , {
			title:"用户登录" ,
			bodyBorder:false ,
			width: 600 ,
			height: 380 ,
			buttonsAlign: 'left',
			padding:"5 10 5 10" ,
			closable: false,
			plain: true,
			resizable: false ,
			//bodyStyle:"border:#999 solid 1px;margin:5px" ,
			//modal: true ,
			layout:"fit" ,
			items: form ,
			buttons:[
				this.btn ,
				{text:"清除登录历史" , scale:"medium" , handler:function(){
					Ext.util.Cookies.clear("userlogin_history");
					this.loadUserLoginHistory();
				} , scope:this}
			]
		});

		this.on("render" , function(){
			this.loadUserLoginHistory();
			form.getComponent("username").focus(true);
			var keynav = new Ext.KeyNav(this.body, {
				"enter" : this.login ,
				scope : this
			});
		} , this)

		this.callParent(arguments);
	} ,

	loadUserLoginHistory: function(){
		//从cookie读取已经登录过的用户
		var uh = Ext.util.Cookies.get("userlogin_history");
		uh = uh ? uh.split(",") : [];
		var usernames = [];
		Ext.each(uh , function(n){
			var tmp = n.split("/");
			usernames.push([tmp[0] , tmp[1]+(tmp[1] == tmp[0] ? "" : "("+tmp[0]+")")]);
		});
		var empcombo = this.down("#username");
		empcombo.store.loadData(usernames)
	} ,

	login: function(){
		this.startloading();
		var f = this.formpanel.getForm()
		var valid = f.isValid()
		if (!valid){
			Ext.MessageBox.alert("信息错误","请填写用户名和密码!" , this.endloading , this);
			return;
		}
		var fvs = f.getValues();

		Ext.Ajax.request({
			//url:"ws/admin.asmx/CheckLogin" ,
			params : fvs ,
			callback: this._loginasp ,
			scope: this
		})
	} ,
	_loginasp: function(op , succ , bd){
		if (!succ){
			$failure(bd);
			this.endloading();
			return;
		}
		this.bd = $back(bd);
		//返回数据成功
		if (!this.bd.isok){
			Ext.MessageBox.alert("验证错误" , "登录验证时发生错误!<Br>"+this.bd.getErrorInfo() , this.endloading , this)
			return;
		}

		var user = Ext.DomQuery.selectNode("rowset/row" , this.bd.data);
		WXY.admin.Admin.setInfo(user);

		//写COOKIE
		var uh = Ext.util.Cookies.get("userlogin_history");
		uh = uh ? uh.split(",") : [];
		var code = WXY.admin.Admin.Code;
		var name = WXY.admin.Admin.Name
		if (Ext.Array.indexOf(uh , code+"/"+name) == -1) {
			uh.push(code+"/"+name);
			Ext.util.Cookies.set("userlogin_history" , uh.join(","));
		}


		//App.User.name =this.bd.msg;

		this.hide()
		this.endloading();
		this.fireEvent('afterlogin', this);
	} ,

	startloading : function(){
		if (!this.loadmask){
			this.loadmask = new Ext.LoadMask(this.body , {msg:"登录验证中,请稍等..."});
		}
		this.loadmask.show()
		this.btn.disable();
		this.btn.setText("登录中...");
	} ,
	endloading : function(){
		this.loadmask.hide();
		this.btn.enable()
		this.btn.setText("<B> 登录 </B>")
	}
})