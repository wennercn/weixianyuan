 /*主菜单*/
Ext.define('WXY.page.TopBar' , {
	extend: 'Ext.toolbar.Toolbar',
	alias: 'wd.custombar' ,
	id:"custombar" ,
	initComponent: function(){
		Ext.apply(this, {
			cls:"topbg" ,
			border:"0 0 0 0" ,
			border:false ,
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
				/*
				{text:"流程模板管理" ,  iconCls:"icon_workflow" , module:"WorkFlowTemplate.Home"} , '-' ,

				{text:"昼夜预编计划" , iconCls:"icon_yubian" , menu:{
					items: [
						{text:"分计划员确认" , module:"Plan.DayPlan.FenJiHua" , handler:this.onClick , scope:this} ,
						'-' ,
						{text:"航线计划员确认" , module:"Plan.DayPlan.HangXian" ,handler:this.onClick , scope:this} ,
						{text:"综合计划员确认" , module:"Plan.DayPlan.ZongHe" ,  handler:this.onClick , scope:this}
					]
				}} ,
				*/
				///{text:"<b>下达动态</b>" ,  iconCls:"icon_start" , module:"Plan.Create" , hidden: emp_id == "1" ? false : true} , {xtype: 'tbseparator' , hidden: emp_id == "1" ? false : true},
				//{text:"电子口岸导入" ,  iconCls:"icon_dbimport" , module:"EDI.ImportData" , hidden: emp_id == "1" ? false : true} ,
				//{xtype: 'tbseparator' , hidden: emp_id == "1" ? false : true},
				{iconCls:"ico_home" , text:"首页" , module:"page.Home"} , '-' ,
				//{text:"我的桌面" , iconCls:"icon_desktop" , module:"Desktop" , handler:this.onClick , scope:this} , '-' ,
				{
					iconCls:"icon_bar_rsview" ,
					text:"<b>监控预警</b>" ,
					module:"GIS" ,
					handler: this.onClick ,
					method:"loadData" ,
					scope:this ,
					xtype:"splitbutton" ,
					menu:{
						items: [
							{text:"GIS地图监控" , module:"GIS"} ,
							{text:"视频监控"}
						]
					}
				} ,'-' , {
					iconCls:"icon_bar_checkin" ,
					text:"数据采集" ,
					//module:"Demand" ,
					handler: this.onClick ,
					scope:this
				} ,  '-' , {
					iconCls:"icon_bar_balance" ,
					text:"数据分析" ,
					//module:"Demand" ,
					handler: this.onClick ,
					xtype:"splitbutton" ,
					scope:this ,
					menu: {
						items:[
						{text:"数据统计分析"} ,
						{text:"事故后果模拟"} ,
						{text:"人员疏散模拟"} ,
						{text:"应急过程日志及评价"}

						]
					}
				} ,  '-' , {
					iconCls:"icon_plan_vip" ,
					text:"<b>应急预案库</b>" ,
					module:"Demand" ,
					handler: this.onClick ,
					scope:this
				} ,  '-' , {
					iconCls:"icon_schedule" ,
					text:"<b>基础数据库</b>" ,
					module:"BaseInfo" ,
					handler: this.onClick ,
					scope:this
				} ,  '-' , {
					text:"系统设置" ,
					iconCls:"icon_bar_sys" ,
					module:"SysInfo" ,
					handler:this.onClick ,
					scope:this ,
					xtype:"splitbutton" ,
					menu:{
						items: [
							{text:"系统基本设置" , iconCls:"icon_baseinfo" , module:"SysInfo" , handler:this.onClick , scope:this} , '-' ,
							{text:"人员管理" , iconCls:"icon_opera" , tooltip:"人员管理" , module:"Manager" , handler:this.onClick , scope:this} , '-' ,
							{text:"数据备份/还原"} ,
							{text:"查看系统日志"} ,
							'-' ,
							{text:"使用帮助" , iconCls:"icon_help" , page:"help" , handler:this.gourl , scope:this} ,
							{text:"关于本系统" , iconCls:"icon_about" ,  handler1:this.about , scope:this.parent}

						]
					}
				} ,

				//{iconCls:"icon_user" , text: '你好 , <b>'+WXY.admin.Admin.Name+'</b> !'} ,'-' ,
				//{text:"修改密码" , iconCls:"icon_password"} , '-' ,
				{text:"退出" , iconCls:"icon_logout" , handler:function(){
					WXY.admin.Admin.logout();
				} , scope:this} , ' '
			]
		});
		this.addEvents(
			'menuclick'
		);
		this.callParent(arguments);

		this.on("render" , this.initMenu , this);

	} ,
	onClick: function(menu , e){
		if (!menu) return;
		this.fireEvent('menuclick', menu , 'menu');
	} ,


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