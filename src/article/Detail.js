Ext.define("WXY.article.Detail" , {
	extend:"Ext.panel.Panel" , 
	initComponent: function(){
		var me = this;
		me.callParent();
	},

	initMain: function(config){
		if (!config) return;
		this.record = config.record;
		this.win = this.up("window");
		this.win.setTitle("查看 "+this.record.get("dangername")+" 详细信息");
		this.load();
	} , 

	load: function(){
		this.update(this.record.get("dangername")+"<p>"+this.record.get("description"));
	}
});