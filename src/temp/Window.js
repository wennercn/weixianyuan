/**
 * 文章内容管理窗口
 */
Ext.define("WXY.temp.Window" , {
	extend: 'WXY.util.AppWindow' ,  
	width: 550 , 
	height: 400 , 
	initComponent: function(){
		var me = this;
		me.main = Ext.create("Ext.panel.Panel" , {
			bodyPadding:10
		});
		Ext.apply(this , {
			items: [
				me.main
			]
		});
		me.callParent();
	} , 
	reset: function(){
		var config =this.moduleConfig;
		if (config.width) this.setWidth(config.width);
		if (config.height) this.setHeight(config.height);
		this.center();
		this.main.setBodyStyle({"background":"#fff"})
		this.main.update("");


		this.setTitle(config.moduleText);
		if (config.bg){
			this.main.setBodyStyle({"background":"url(res/img/"+config.bg+") #fff no-repeat center center"})
		}else{
			this.main.update(config.moduleText);
		}

	} 
});