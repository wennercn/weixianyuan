/**
 * 文章内容管理窗口
 */
Ext.define("WXY.article.Window" , {
	extend: 'WXY.util.AppWindow' , 
	require: ['WXY.article.model.Catalog'] , 
	iconCls:"ico_article" , 
	layout: 'card' , 
	initComponent: function(){
		var me = this;

		//分类STORE
		me.catalogStore = Ext.create("WXY.article.store.Catalog" , {
			url:"ws/article.asmx/GetCatalog" , 
			storeId:"article-catalog"
		});
		//列表
		me.list = Ext.create("WXY.article.List" , {
		});

		Ext.apply(this , {
			items: [
				me.list
			]
		});

		me.callParent();
	} , 
	reset: function(){
		this.catalogStore.load({
			params: {type: this.moduleConfig.type}
		});
		this.setCardActive(this.list);
	}
});