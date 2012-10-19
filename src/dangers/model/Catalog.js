Ext.define("WXY.dangers.model.Catalog" , {
	extend: "Ext.data.Model",
	idProperty: "dangerclassid",
	fields: [
		{ name: "dangerclassid", mapping: "dangerclassid" },
		{ name: 'parentid', mapping: 'parentid' },
		{ name: 'classname', mapping: 'classname' }
	]
});