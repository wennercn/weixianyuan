/**
* 设备点表单
*/
Ext.define("WXY.monitorpoint.PointForm" , {
    extend: 'WXY.monitorpoint.Form',
    xtype: 'monitorpointform-point' , 
    kind: 'point' , 
    createItems:function(){
    	var configData = WXY.gis.Config;
		var req = "<span style='color:red'>*</span>";
		return [
			{xtype:"combobox" , fieldLabel:"所属作业区" , name:"parentid", store:"space-store" , editable:false , 
				valueField:"dangerid" , displayField:"dangername" , queryMode: 'local' , allowBlank:false , afterLabelTextTpl:req} ,
			{xtype:"mycombo" , fieldLabel:"类型" , name:"dangertype" , _data:configData.dangerTypeComboData , 
				allowBlank:false , value:'sensor' , editable:false , afterLabelTextTpl:req} , 
			{fieldLabel:"名称"  , name:"dangername" , allowBlank:false , afterLabelTextTpl:req},
			{fieldLabel:"物理编码"  ,  name:"dangercode" , allowBlank:false , afterLabelTextTpl:req} ,
			{fieldLabel:"位置坐标"  , name:"lnglat" , allowBlank:false , readOnly:true ,afterLabelTextTpl:req} , 
			{xtype:"mycombo" , fieldLabel:"状态" , name:"status" , _data:[['ok' , '正常'] , ['disable' , '停用']] , value:'ok' , editable:false} , 
			//{xtype:"mycombo" , fieldLabel:"所在位置" , name:"location" , _data:configData.locationComboData} , 
			//{fieldLabel:"地址说明"  , name:"address"} ,
			{fieldLabel:"备注"  , xtype:"textarea" , name:"description"},
			{xtype:'hidden' , name:'dangerid' , value:0} ,
			{xtype:'hidden' , name:'kind' , value:this.kind}
		];
    } , 

    checkValueValid: function(fv){
		if (fv.lnglat.indexOf(",")==-1){
			MB.alert("错误","请选择监控点的坐标信息!");
			return false;
		}
		var lnglat = fv.lnglat.split(",");
		fv.lng = lnglat[0];
		fv.lat = lnglat[1];	
		return true;
    }
});