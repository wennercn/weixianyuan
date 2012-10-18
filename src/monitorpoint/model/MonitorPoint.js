Ext.define("WXY.monitorpoint.model.MonitorPoint" , {
	extend:"Ext.data.Model" , 
	fields:[
		{name:"dangerid" , mapping:"dangerid"},
		{name:"dangername" , mapping:"dangername"},
		{name:"dangercode" , mapping:"dangercode"},
		{name:"dangertype" , mapping:"dangertype"},
		{name:"description" , mapping:"description"} ,
		{name:"address" , mapping:"address"},
		{name:"area_id" , mapping:"area_id"},
		{name:"area_name" , mapping:"area_name"},
		{name:"grade" , mapping:"grade"},
		{name:"location" , mapping:"location"},
		{name:"lat" , mapping:"lat"},
		{name:"lng" , mapping:"lng"},
		{name:"status" , mapping:"status"}
	]
})