/*中间MAINPANEL*/
Ext.define('WXY.page.Mainpanel', {
    extend: 'Ext.panel.Panel',
    alias: 'wd.mainpanel',
    initComponent: function(){
        Ext.apply(this, {
			region:"center",
			id : "main_panel" ,
			layout:"fit",
			padding: 2 ,
			margins: 0 ,
			border:false
        });
        this.callParent(arguments);
    }
})