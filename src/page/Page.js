Ext.define('WXY.page.Page' , {
	    extend: 'Ext.panel.Panel',
		alias: 'wd.page' ,
		initComponent: function(){

			this.custombar = Ext.create('WXY.page.TopBar', {
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

			this.mainpanel = Ext.create('WXY.page.Mainpanel', {

			});


			Ext.apply(this, {
				layout: 'border',
				margins:0 ,
				padding:0 ,
				//border: false ,
				dockedItems:[
					this.custombar
				] ,
				items: [
					//this.leftnav ,
					this.mainpanel
				]
			});
			this.callParent(arguments);
			this.on("render" , function(){
				this.createMain({module: WXY.App.HomeModule})
			} , this)
		} ,

		onBarClick: function(data , type){
			data = type == 'tree' ? data.raw : data;
			this.createMain(data);
		} ,

		//创建主内容区域
		createMain: function(menu){
			if (!menu || !menu.module) {
				return;
			}
			var clsName = "WXY."+menu.module;
			var main;
			if (menu.iswindow){
				var winid = menu.winId || Ext.id();
				main = Ext.getCmp("win_"+menu.winId);
				if (!main){
					main =  Ext.create("WXY."+menu.module, {
						id: "win_"+winid
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

		}

})
