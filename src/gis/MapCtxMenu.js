Ext.define("WXY.gis.MapCtxMenu" , {
	extend:'Ext.menu.Menu' , 
	initComponent: function(){
		var me = this;
		var items = [];
		items.push(
			{text:"添加新监控点" , iconCls:'ico_add' , handler:this.parent.addMPOnCtxMenu , scope:this.parent}
		);

		me.items = items;
		me.callParent();
	}
});