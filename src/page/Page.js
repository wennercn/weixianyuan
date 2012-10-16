Ext.define('WXY.page.Page' , {
	    extend: 'Ext.panel.Panel',
		alias: 'wd.page' ,
		initComponent: function(){

			this.logobar = Ext.create('WXY.page.LogoBar', {
				listeners: {
					"menuclick": this.onBarClick ,
					scope: this
				}
			});

			this.statusbar = Ext.create('WXY.page.StatusBar' , {
				listeners: {
					"menuclick": this.onBarClick ,
					scope: this
				}
			});
			
			/*
			this.leftnav = Ext.create("Ext.tab.Panel" , {
				region:"west" , width:200 , title:"导航菜单" , iconCls:"ico_nav" , sp1lit:true , margins:2 , collapsible:true ,
				items:[
					Ext.create("WXY.page.JiGou" , {listeners: {treeclick: this.onBarClick ,scope:this}}) ,
					Ext.create("WXY.page.JuJia" , {listeners: {treeclick: this.onBarClick ,scope:this}})
				]
			});
			*/

			this.wrap = Ext.create('WXY.page.Main', {
				layout:"card"
			});


			Ext.apply(this, {
				layout: 'border',
				margins:0 ,
				padding:0 ,
				//border: false ,
				dockedItems:[
					this.logobar , 
					this.statusbar
				] ,
				items: [
					//this.leftnav ,
					this.wrap
				]
			});

			this.callParent(arguments);
			this.on("render" , function(){
				this.createMain({module: $CONFIG.homeModule})
			} , this)
		} ,

		onBarClick: function(data , type){
			data = type == 'tree' ? data.raw : data;
			this.createMain(data);
		} ,

		/*
		//创建主内容区域
		createMain: function(menu){
			if (!menu || !menu.module) {
				return;
			}
			var clsName = "WXY."+menu.module;
			var main;
			if (menu.iswindow){
				var winid = menu.winId || Ext.id();
				main = Ext.getCmp("appwin_"+menu.winId);
				if (!main){
					main =  Ext.create("WXY."+menu.module, {
						id: "appwin_"+winid
					});
				}
				main.show();
				return;
			}else if (menu.isouturl) {
				window.open(menu.outurl , "baseinfo" , "width=700,height=500,top=100,left=100");
				return;
			} else{
				if (Ext.getClassName(this.main) != clsName || menu.mustrebuild){
					try{
						var config = Ext.apply({} , {
							moduleConfig: menu.moduleConfig
						});
						var tempanel =  Ext.create("WXY."+menu.module, config);

					}catch(e){
						var title = "" , msg = e.message || e.msg, errs = [];
						if (msg.indexOf("Cannot create")>-1) errs.push("不能创建实例,可能没加载文件!");
						if (msg.indexOf("Failed loading")>-1) errs.push("加载文件错误!");
						if (msg.indexOf("The following classes are not declared") >-1) errs.push("加载的文件中没有包括下面的类名称!")
						//errs.push(msg);
						//var s = errs.join("<br>");
						//Ext.Msg.alert('It\'s fine', 'and it\'s art.');
						MB.alert("错误" , "创建Module出现错误!<br>"+menu.module+"<br>"+e.message);
						return;
					}
					if (this.main) this.mainpanel.remove(this.main , true);

					this.main = tempanel;
					this.mainpanel.add(this.main);
				}
			}

			if (menu.method && this.main[menu.method]) {
				if (this.main.rendered) {
					this.main[menu.method].call(this.main);
				}else{
					this.main.on("render" , function(){this.main[menu.method].call(this.main)} , this)
				}
			}
			if (menu.hidetree){
				if (this.leftnav.rendered){
					this.leftnav.collapse();
				}
			}

		} , 
		*/

	//创建主内容区域
	createMain: function(menu){
		if (!menu || !menu.module) return;

		//关闭当前所有窗口
		//TODO: 如果点击事件触发，则MENU也会被关闭。。。
		Ext.WindowManager.hideAll();

		var moduleName = "WXY."+menu.module;
		var moduleId = menu.moduleId || moduleName.replace(/\./ig , "_");
		var moduleConfig = menu.moduleConfig || {};
		var moduleMethod = menu.moduleMethod || "";

		//如果是弹出一个浏览器窗口window.open
		if (menu.isOutUrl) {
			window.open(menu.outUrl , "baseinfo" , "width=700,height=500,top=100,left=100");
			return;
		}

		var main;
		var isWindow = menu.isWindow ? true : false;

		if (isWindow) { //如果是弹出一个Ext.Window
			//默认的是open方法
			moduleMethod = moduleMethod || "open";

			moduleId = "modulewin_"+moduleId;
			main = Ext.getCmp(moduleId)
			//创建window
			if (!main){
				try{
					main =  Ext.create(moduleName , {
						moduleConfig: moduleConfig , 
						id: moduleId
					});
				}catch(e){
					MB.alert("错误" , "创建Module出现错误!<br>"+moduleName+"<br>"+e.message);
					return;
				}
			}
		}else{ //在MAIN中生成界面	
			//默认方法
			moduleMethod = moduleMethod || "initMain";

			moduleId = "modulepanel_"+moduleId;
			
			main = this.wrap.down("#"+moduleId);
			//创建
			if (!main) {	
				try{
					main = Ext.create(moduleName , {
						itemId: moduleId , 
						moduleConfig: moduleConfig
					});
					this.wrap.add(main);
				}catch(e){
					MB.alert("错误" , "创建Module出现错误!<br>"+moduleName+"<br>"+e.message);
					return;
				}
			}
			

			//获取上一个main
			var wrapcard = this.wrap.getLayout();
			this.prevMain = wrapcard.getActiveItem();
			wrapcard.setActiveItem(main);
			this.curMain = main;

		}

		//如果有执行方法,则自动执行
		if (moduleMethod && main[moduleMethod]) {
			if (isWindow){
				main[moduleMethod].call(main , moduleConfig);
			}else{
				if (main.rendered) {
					main[moduleMethod].call(main , moduleConfig);
				}else{
					main.on("render" , function(){
						main[moduleMethod].call(main , moduleConfig)
					} , main)
				}
			}
		}

	}
});