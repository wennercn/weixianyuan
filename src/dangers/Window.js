Ext.define("WXY.dangers.Window" , {
    extend: 'WXY.util.AppWindow',
    require: ['WXY.article.model.Catalog'],
    iconCls: "ico_article",
    layout: 'card',
    wsUrl: $CONFIG.wsPath + "KnowledgeWebService.asmx/",
    initComponent: function () {
        var me = this;

        //分类STORE
        me.catalogStore = Ext.create("WXY.article.store.Catalog", {
            url: me.wsUrl + "GetSmClssByClssID",
            recordPath: "Chemical",
            storeId: "article-catalog"
        });

        //列表
        me.list = Ext.create("WXY.article.List", {
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
        params: { chemicalid: this.moduleConfig.id },
        callback: function (st, rs, rv) {
            //console.log(st);
        }
    });
}
});