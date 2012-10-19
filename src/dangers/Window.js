
Ext.define("WXY.dangers.Window", {
    extend: 'WXY.util.AppWindow',
    require: ['WXY.dangers.model.Catalog'],
    iconCls: "ico_article",
    layout: 'card',
    wsUrl: $CONFIG.wsPath + "DangerWebService.asmx/",
    initComponent: function () {

        var me = this;

        //分类STORE
        me.catalogStore = Ext.create("WXY.dangers.store.Catalog", {
            url: me.wsUrl + "GetSmClssByClssID",
            recordPath: "DangerClass",//分类树节点名称
            storeId: "dangers-catalog" //store:Catalog Form 
        });

        //列表
        me.list = Ext.create("WXY.dangers.List", {
        
    });

    Ext.apply(this, {
        items: [
				me.list
			]
    });

    me.callParent();
},
reset: function () {
    this.loadCatalogStore();
    this.setCardActive(this.list);
},
loadCatalogStore: function () {
    this.catalogStore.load({
        params: { classid: this.moduleConfig.id },
        callback: function (st, rs, rv) {
             
            var data= rs.response.responseText;//数据
            //alert(data);
            //console.log(st);
        }
    });
}
});
//@ sourceURL=src/dangers/Window.js