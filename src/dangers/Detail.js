Ext.define("WXY.dangers.Detail" , {
	extend:"Ext.panel.Panel" , 
	initComponent: function(){
		var me = this;
		Ext.apply(me , {
			dockedItems: [
				{xtype:"toolbar" , dock:"top" , items:[
					{text:"返回列表" , iconCls:"ico_back" ,  handler:function(){
						this.win.setCardActive(this.win.list , {disableInit:true});
					} , scope:this} , 
					'->' , 
					{text:"打印" , iconCls:"ico_print" , disabled:true}
				]}
			]
		});
		me.callParent();
	},

	initMain: function(config){
		if (!config) return;
		this.record = config.record;
		this.win = this.up("window");
		this.win.setTitle("查看 " + this.record.get("dangername") + " 详细信息");
		this.win.setIconCls('ico_view');
		this.load();
	} , 

	load: function(){
		if (!this.template){
			this.template = this.getTemplate();
		}
		var html = this.template.apply(this.record.data);
		this.update(html);
	} , 
	getTemplate: function(){
		var t = new Ext.Template([
			'<div style="padding:15px;text-align:center">',
				'<h3 style="font:bold 18px arial;padding:10px 0">{dangername}</h3>',
				'<div style="font:normal 12px arial;line-height:200%;padding:10px 0;border-top:#ccc solid 1px;text-align:left">{description}</div>', 
			'</div>',
		]);		
		return t;	
	}
});