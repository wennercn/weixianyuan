Ext.define("WXY.gis.CtxMenu" , {
	extend:'Ext.menu.Menu' , 
	initComponent: function(){
		var me = this;
		var items = [];
		items.push(
			{text:"添加新监控点" , iconCls:'ico_add' , handler:this.parent.add1 , scope:this.parent}
		);

		me.items = items;
		me.callParent();
	}
});