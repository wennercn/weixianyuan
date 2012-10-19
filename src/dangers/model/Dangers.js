Ext.define("WXY.dangers.model.Dangers", {
	extend: "Ext.data.Model",
	idProperty: "dangerid",
	fields: [
		{ name: "dangerid", mapping: "dangerid" },
		{ name: "dangername", mapping: "dangername" },
		{ name: "address", mapping: "address" },
		{ name: "description", mapping: "description" },
		{ name: "dangertype", mapping: "dangertype" },
		{ name: "createtime", mapping: "createtime" },
		{ name: "location", mapping: "location" },
		{ name: "classname", mapping: "classname" },
        { name: "grade", mapping: "grade" }
	]
});