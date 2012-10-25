﻿ /*主菜单*/
Ext.define('WXY.page.LogoBar' , {
	extend: 'Ext.toolbar.Toolbar',
	alias: 'wd.logobar' ,
	id:"logobar" ,
	cls:'logobar' , 
	initComponent: function(){
		Ext.apply(this, {
			cls:"topbg" ,
			//border:false ,
			defaults: {
				//scale: 'medium',
				textAlign:"center" ,
				scale:"small" ,
				iconAlign:'top' ,
				handler:this.onClick ,
				scope:this ,
				defaults: {
					scope:this
				}
			} ,
			items: [
				'->' ,
				{iconCls:"ico_gis" , text:"监控地图" , module:"gis.Index"} , '-' ,
				{iconCls:'ico_article' , text:'知识库' , module1:'article.Window' , menu:{
					defaults: {scope:this , handler:this.onClick , isWindow:true} , 
					items:[
						{text:'常见危险化学品理化性质表' , module:"article.Window" , moduleConfig:{type:"常见危险化学品理化性质表" , id:1}} , 
						{text:'常见危险化学品事故处置程序' , module:"article.Window" , moduleConfig:{type:"常见危险化学品事故处置程序" , id:2}} , 
						{text:'常见危化品事故救援人员防护措施' , module:"article.Window" , moduleConfig:{type:"常见危化品事故救援人员防护措施" , id:3}} , 
						{text:'危化品中毒人员救治措施' , module:"article.Window" , moduleConfig:{type:"危化品中毒人员救治措施" , id:4}}
					]
				}} , '-' , 
				{iconCls:'ico_preplan' , text:'应急预案' , module:'article.Window' , moduleConfig:{type:"应急预案" , id:4} , isWindow: true} , '-' , 
				{iconCls:"ico_baseinfo" ,text:"基础数据" , menu:{
					defaults: {handler: this.onClick , scope:this , isWindow:true} , 
					items:[
						{text:'重大危险源分级' , module: 'article.Window' , moduleConfig:{type:"重大危险源分级" , id:5} , isWindow:true} , 
						{xtype:'menuseparator'} , 
						//{text:'传感器管理' , disabled1:true , module:'temp.Window' , isWindow:true} , 
						//{xtype:'menuseparator'} , 
						{text:'事故相应级别管理' , module: 'article.Window' , moduleConfig:{type:"事故相应级别管理" , id:5} , isWindow:true} , 
						{text:'企业基本信息' , module: 'article.Window' , moduleConfig:{type:"企业基本信息" , id:5} , isWindow:true}
					]
				}} , '-' ,
				{iconCls:"ico_stat" ,text:"数据分析" , menu: {
					defaults: {handler: this.onClick , scope:this , isWindow:true} , 
					items:[
						{text:"数据统计分析" , module:'temp.Window' , isWindow:true , moduleConfig:{bg:"tj.jpg" , width:897 , height:595}} 
						/*
						{text:"事故后果模拟" , module:'temp.Window' , isWindow:true} ,
						{text:"人员疏散模拟" , module:'temp.Window' , isWindow:true} ,
						{text:"应急过程日志及评价" , module:'temp.Window' , isWindow:true}
						*/
					]}
				} ,  '-' , 
				/*
				{iconCls:"ico_setting" , text:"系统设置" , menu:{
					items: [
						{text:"系统基本设置" , iconCls:"icon_baseinfo" , module:'temp.Window' , isWindow:true , handler:this.onClick , scope:this} , '-' ,
						{text:"人员管理" , iconCls:"icon_opera" , tooltip:"人员管理" , module:'temp.Window' , isWindow:true , handler:this.onClick , scope:this} , '-' ,
						{text:"数据备份/还原" , module:'temp.Window' , isWindow:true} ,
						{text:"查看系统日志" , module:'temp.Window' , isWindow:true} ,
						'-' ,
						{text:"使用帮助" , iconCls:"icon_help"  , module:'temp.Window' , isWindow:true , handler:this.onClick , scope:this} ,
						{text:"关于本系统" , iconCls:"icon_about" , module:'temp.Window' , isWindow:true , handler:this.onClick , scope:this}
					]}
				} , '-' ,
				*/
				{text:"退出" , iconCls:"ico_logout" , module:'temp.Window' , isWindow:true , handler:function(){
					$ADMIN.logout();
				} ,  scope:this} , ' '
			]
		});
		this.addEvents(
			'menuclick'
		);
		this.callParent(arguments);

		//this.on("render" , this.initMenu , this);

	} ,
	onClick: function(menu , e){
		if (!menu) return;
		this.fireEvent('menuclick', menu , 'menu');
	} ,


	//onrender 读取当前用户的菜单
	//已取消 , 这样读取速度太慢 , 显示不友好
	initMenu: function(){
		/*
		if (WXY.admin.Admin.Code == "admin"){
			this.down("#btn_admin").show();
			this.down("#space1").show();
		}else{
			this.down("#btn_admin").hide();
			this.down("#space1").hide();
		}
		*/

		this.startMessage();
		return;
		var me = this;
		Ext.Ajax.request({
			url: "ws/page.asmx/GetBarMenu" ,
			success : function(data ){
				var setscope = function(arr , scope){
					for (var i=0; i<arr.length; i++) {
						if (!Ext.isString(arr[i])) {
							Ext.apply(arr[i] , {
								handler: me.onClick ,
								scope: me
							});
							if (arr[i].menu && arr[i].menu.items) {
								setscope(arr[i].menu.items , scope);
							}
						}
					}
				}
				var bd = Ext.decode(data.responseText);
				setscope(bd , me);
				this.insert(1 , bd)
			} ,
			failure: $failure ,
			scope: this
		})
	} ,

	//开始获取消息
	startMessage: function(){
		var runner = new Ext.util.TaskRunner();
		runner.start({
			run: this.getMessage ,
			scope: this,
			interval: 1000*30
		});
	} ,

	//获取消息
	getMessage: function(){
		Ext.Ajax.request({
			params:{action: "getmessage"} ,
			scope: this
		});

	} ,
	_getMessage: function(data){
		var bd = $back(data);
		if (!bd.isok) return;

		var rs = Ext.query("RowSet R" , bd.data);
		var count = rs.length;
		var btn = this.getComponent("btn_message");
		var el = btn.getEl();

		if (!btn) return;
		if (this.titleshan) {
			clearInterval(this.titleshan);
		}


		btn.setText("我的消息");
		btn.setIconCls("icon_message_empty");
		document.title = document.title.indexOf("]") > -1 ? document.title.split("]")[1] : document.title;

		if (count > 0) {
			//Ext.core.DomHelper.append(el , "<span style='background:red;font-weight:bold;top:2px;right:7px;position:absolute;color:#fff;width:15px;height:15px;text-align:center'>"+count+"</span>");
			btn.setText("<b style='color:#FF6600'>"+count+"条新消息</b>")
			btn.setIconCls("icon_message");
			var title = document.title;
			document.title = "["+count+"条新消息]"+document.title;
			return
			var step = 1;
			this.titleshan = setInterval(function(){
				var str = count+"条新消息";
				//var len = step % str.length;
				//var t = str.substring(len)+str.substring(0 , len);
				document.title = "["+str+"]"+title;
				step++;
			} , 300);


		}
	}

})