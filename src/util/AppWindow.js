Ext.define("WXY.util.AppWindow" , {
	extend: "Ext.Window" , 
	width:800 ,
	height: 600 ,
	closeAction:"hide" ,
	border:false ,
	layout:"fit" , 
	maximizable: true ,	
	open: function(config){
		this.moduleConfig = config;
		this.show();
		this.reset();
	} , 
	reset: Ext.emptyFn , 
	setCardActive: function(panel , config){
		var me = this;
		var card = me.getLayout();
		var prevPanel = card.getActiveItem();
		me.prevPanel = prevPanel;
		if (prevPanel == panel){
			if (panel["initMain"]) {
				panel["initMain"].call(panel , config);
			}
		}else{
			prevPanel.getEl().fadeOut({
				opacity: .2 ,
				duration: 100 , 
				callback: function(){
					card.setActiveItem(panel);
					panel.getEl().setOpacity(.2);
					panel.getEl().fadeIn({
						duration: 100
					});
					if (panel["initMain"]) {
						panel["initMain"].call(panel , config);
					}
				}
			});
		}
		this.curPanel = panel;
	} , 
	back: function(){
		this.win.setCardActive(this.prevPanel);	
	}
})