Ext.define("WXY.dangers.model.Catalog" , {
	extend: "Ext.data.Model",
	idProperty: "chemicalid" ,
	fields: [
		{name:"chemicalid" , mapping:"chemicalid"} ,	
		{name:'parentid' , mapping:'parentid'} ,	
		{name:'chemicalname' , mapping:'chemicalname'}
	]
});