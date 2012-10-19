Ext.define("WXY.gis.MarkerCtxMenu" , {
	extend:'Ext.menu.Menu' , 
	initComponent: function(){
		var me = this;
		var items = [];
		items.push(
			{text:"监控点" , itemId:"title" , iconCls:"" , style:{fontWeight:"bold"} , hideOnClick:false} ,
			{xtype:'menuseparator'} , 			
			{text:'查看监控信息'} , 
			{xtype:'menuseparator'} , 
			{text:"修改" , iconCls:'ico_edit' , itemId:'edit' , handler:this.parent.editMPOnCtxMenu , scope:this.parent} ,
			{text:"删除" , iconCls:'ico_delete' , itemId:'delete' , handler:this.parent.deleteMPOnCtxMenu , scope:this.parent}
		);

		me.items = items;
		me.callParent();
	}
});