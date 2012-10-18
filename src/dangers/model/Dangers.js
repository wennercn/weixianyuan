Ext.define("WXY.dangers.model.Dangers", {
	extend: "Ext.data.Model",
	idProperty: "knowledgeid" ,
	fields: [		
		{name:"knowledgeid" , mapping:"knowledgeid"} ,
		{name:"title" , mapping:"title"} ,
		{name:"detail" , mapping:"detail"} ,
		{name:"activity" , mapping:"activity"} ,
		{name:"uploaduser" , mapping:"uploaduser"} ,
		{name:"chemicalid" , mapping:"chemicalid"} ,
		{name:"addtime" , mapping:"addtime"} ,
		{name:"chemicalname" , mapping:"chemicalname"}
	]
});