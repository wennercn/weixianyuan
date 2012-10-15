Ext.define("WXY.article.model.Article" , {
	extend: "Ext.data.Model",
	//idProperty: "plan_id" ,
	fields: [		
		{name:"dangername" , mapping:"dangername"} ,
		{name:"address" , mapping:"address"} ,
		{name:"description" , mapping:"description"} ,
		{name:"location" , mapping:"location"}
	]
});