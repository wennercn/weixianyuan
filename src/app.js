Ext.define('WXY.App' , {
	singleton: true,
  constructor: function(config) {
		this.HomeModule = "gis.Index";
		this.ServerDate = new Date();
		Ext.TaskManager.start({
			run: function(){
				this.ServerDate = Ext.Date.add(this.ServerDate , Ext.Date.SECOND , 1);	
			},
			interval: 1000 ,
			scope: this
		});
		Ext.QuickTips.init();
    },
	check: function(){
		//检测用户信息
		//$ADMIN.checkSession({from:"init"});
		this.start();
	} ,
	start: function(){
		this.hideDomLoad();
		this.page = Ext.create('WXY.page.ViewPort' , {
			
		});
	} , 
	hideDomLoad: function(){
		if (Ext.get("loading")) Ext.get('loading').fadeOut({remove:true});
		if (Ext.get('loading-mask')){
			Ext.get('loading-mask').fadeOut({remove:true});	
		}
	}	

});

window.$APP = WXY.App;