/**
* 工作区表单
*/
Ext.define("WXY.monitorpoint.SpaceForm" , {
    extend: 'WXY.monitorpoint.Form',
    xtype: 'monitorpointform-space' , 
    kind: 'space' , 
    createItems: function(){
    	var configData = WXY.gis.Config;
		var req = "<span style='color:red'>*</span>";
		return [
			{xtype:"combobox" , fieldLabel:"所属区域" , name:"parentid", store:"area-store" , editable:false , 
				valueField:"dangerid" , displayField:"dangername" , queryMode: 'local' , allowBlank:false , afterLabelTextTpl:req} ,
			{fieldLabel:"名称"  , name:"dangername" , allowBlank:false , afterLabelTextTpl:req},
			{xtype:"fieldcontainer" , layout:'hbox' , fieldLabel:"区域坐标" , afterLabelTextTpl:req , items:[
				{xtype:'textfield' , name:"lnglats" , allowBlank:false , readOnly:true , flex:1} , 
				{xtype:'button' , margin:'0 0 0 5' , text:"选择坐标" , handler:this.openOverlayWindow , scope:this}
			]} , 
			{fieldLabel:"地址说明"  , name:"address"} ,
			{fieldLabel:"备注"  , xtype:"textarea" , name:"description"},
			{xtype:'hidden' , name:'dangerid' , value:0},
			{xtype:'hidden' , name:'kind' , value:this.kind}
		];

    } , 

    openOverlayWindow: function(){
    	var gis = Ext.ComponentQuery.query('gishome')[0];
    	if (!this.overlaywindow){
    		this.overlaywindow = Ext.create("WXY.ux.OverlayWindow" , {
    		})
    	}

    	var field = this.down("textfield[name=lnglats]");
    	this.overlaywindow.open({
    		action:"polygon" , 
    		targetField: field  , 
    		data: field.getValue() , 
    		mapZoom: gis ? gis.map.getZoom() : "" , 
    		mapCenter: gis ? gis.map.getCenter() : ""
    	});

    }
});