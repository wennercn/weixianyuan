/*
 * Application
 */
Ext.define('WXY.App' , {
	singleton: true,
  	constructor: function(config) {
		Ext.QuickTips.init();
	},
	check: function(){
		//检测用户信息
		$ADMIN.checkSession({from:"init"});
		//this.start();
	} ,
	start: function(){
		this.hideDomLoad();
		//创建监控点STORE
		this.createMPStore();
		this.createPage();
	} , 
	
	hideDomLoad: function(){
		if (Ext.get("loading")) Ext.get('loading').fadeOut({remove:true});
		if (Ext.get('loading-mask')){
			Ext.get('loading-mask').fadeOut({remove:true});	
		}
	}, 

	createPage: function(){
		try{
			this.page = Ext.create('WXY.page.ViewPort' , {			
		});
		}catch(e){
			MB.alert("createPage错误" , e.message+"<br>app.js");
			return;
		}
	} , 

	createMPStore: function(){
		var store = Ext.create("WXY.monitorpoint.store.MonitorPoint" , {
			recordPath: "Danger" , 
			groupField: "dangertype" , 
		    getGroupString: function(r) {
		        var s = ['' , '传感器' , '监控摄像头'][r.get('dangertype')];
		        return s;
		    } , 	
			storeId:'mp-store' , 
			url: $CONFIG.wsPath+"monitorpoint.asmx/GetList" , 
			autoLoad: true
		});
		return store;
	}

});

window.$APP = WXY.App;