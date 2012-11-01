/**
* 区域表单
*/
Ext.define("WXY.monitorpoint.AreaForm" , {
    extend: 'WXY.monitorpoint.Form',
    xtype: 'monitorpointform-area' , 
    kind: "area" , 
   	createItems: function(){
    	var configData = WXY.gis.Config;
		var req = "<span style='color:red'>*</span>";
		return [
			{fieldLabel:"名称"  , name:"dangername" , allowBlank:false , afterLabelTextTpl:req},
			{xtype:"mycombo" , fieldLabel:"所在位置" , name:"location" , _data:configData.locationComboData} , 
			{fieldLabel:"地址说明"  , name:"address"} ,
			{fieldLabel:"备注"  , xtype:"textarea" , name:"description"},
			{xtype:'hidden' , name:'dangerid' , value:0} , 
			{xtype:'hidden' , name:'kind' , value:this.kind}
		];

   	}
});