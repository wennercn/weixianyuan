/*中间MAINPANEL*/
Ext.define('WXY.page.Main', {
    extend: 'Ext.panel.Panel',
    xtype: 'mainpanel',
    region:"center",
    id : "main_panel" ,
    layout:"fit",
    padding: 2 ,
    margins: 0 ,
    border:false , 
    initComponent: function(){
        var me = this;
        me.callParent(arguments);
    }
})