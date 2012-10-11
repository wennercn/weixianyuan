/**
 * @管理员
 */
Ext.define('WXY.admin.Admin' , {
	alias: 'wd.admin' ,
	singleton: true,
	constructor: function(){

	} ,
	setInfo: function(node){
		this.Name = node.getAttribute("fullname");
		this.Code = node.getAttribute("mname");
		this.Id = node.getAttribute("id");
	} ,
	checkSession: function(options){
		//this.startApp();
		//return;
		this.from = options ? options.from : "";
		Ext.Ajax.request({
			url:"ws/admin.asmx/CheckSession" ,
			params: {action:"checksession"} ,
			callback: this._checkSession ,
			scope:this
		});
	} ,
	_checkSession: function(options , succ , rp){
		var bd = $back(rp);
		if (bd.isok){
			var user = Ext.DomQuery.selectNode("rowset/row" , bd.data);
			this.setInfo(user);
			//App.User.name = bd.msg;
			this.startApp();
		}else{
			if (this.from !="init"){
				MB.alert("错误" , bd.getErrorInfo() || "登录检测失败!" , this.startLogin , this);
			}else{
				if (bd.getErrorInfo().indexOf("失效")>-1) PM.msg("错误" , bd.getErrorInfo());
				this.startLogin();
			}
		}
	} ,
	startApp: function(){
		WXY.App.start();
	} ,
	updateUser: function(){

	} ,
	startLogin: function(){
		$APP.hideDomLoad();
		var logincls = window.location.href.indexOf("otd") > -1 ? "WXY.admin.OTDLoginWindow" : "WXY.admin.LoginWindow";
		var loginwin = Ext.create(logincls , {});
		loginwin.on("afterlogin" , this.startApp , this);
		loginwin.show();
		if (Ext.isIE6 || Ext.isIE7){
			//alert("强烈建议您使用其他非IE内核浏览器(chrome , safari , firefox , opera)登录本系统!");
		}
	} ,
	logout: function(){
		MB.loading("退出系统");
		Ext.Ajax.request({
			//url: "ws/admin.asmx/Logout" ,
			params: {action:"logout"} ,
			method:"POST",
			success:function(){
				window.location.reload();
			} ,
			failure: function(o){
				MB.alert("错误" , o.responseText)
			} ,
			scope: this
		});
	}
});

window.$ADMIN = WXY.admin.Admin;