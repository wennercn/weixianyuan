Ext.define('WXY.dangers.Catalog', {
	extend: 'Ext.grid.Panel',
	autoScroll: true ,
	columnLines: true ,
	rowLines: true , 
	selModel: {mode: 'SINGLE'} ,
	columns: [
		{xtype: 'rownumberer' , text:"序号" , width:30},
		{text:"分类ID" , dataIndex:'chemicalid' , align:'center'} , 
		{text:'分类名称' , dataIndex:'chemicalname' , flex:1}
	] ,
	
	initComponent: function(){
		var me = this;

		this.form = Ext.create("Ext.form.Panel" , {
			title:"添加分类" , 
			dock:"top" , 
			bodyPadding:10 , 
			hidden:true , 
			itemId:"catalogform" , 
			dockedItems:[
				{xtype:"toolbar" , dock:"top" , items:[
					'->' , 
					{text:"<b>保存分类</b>" , iconCls:"ico_save" , handler:this.save , scope:this} , '-' , 
					{text:"取消" , iconCls:"ico_cancel" , handler:function(){this.form.hide()} , scope:this}
				]}
			] , 
			items:[
				{xtype:"textfield" , fieldLabel:"分类名称" , name:"chemicalname" , allowBlank:false , anchor:"100%"} ,
				{xtype:"textarea" , fieldLabel:"备注" , name:"remark" , anchor:"100%"}
			]
		});



		Ext.apply(me , {
			store: "dangers-catalog" ,  
			dockedItems: [
				{xtype:"toolbar" , dock:'top' , items:[
					{text:"返回表单" , iconCls:"ico_back" , handler:this.backToForm, scope:this} , 
					'->' ,
					{text:"<b>添加分类</b>" , iconCls:"ico_add" , handler: this.onCreate , scope:this}
				]} , 
				this.form
			] , 
			viewConfig: {
				preserveScrollOnRefresh : true, 
				deferEmptyText: false ,
				emptyText:"<div style='color:blue;padding:15px'>还没有相关记录!</div>" , 
				getRowClass: me.getRowClass
			}
		});
		
		this.callParent();
	} ,

	initMain: function(config){
		config = config || {};
		this.win = this.up("window");
		this.win.setTitle(this.win.moduleConfig.type+" 分类管理");
		this.down("form").hide();
	} , 
	backToForm: function(){
		this.win.setCardActive(this.win.form , {disableInit:true});
	} , 

	//添加
	onCreate: function(){
		this.down("#catalogform").show();
	} , 

	//保存
	save: function(){
		var f = this.form.getForm();
		var valid = f.isValid();
		if (!valid){
			MB.alert("错误","请填写每项信息!"  , this);
			return;
		}

		var fv = f.getValues();
		fv.parentid = this.win.moduleConfig.id;

		MB.loading("保存信息");
		Ext.Ajax.request({
			url: this.win.wsUrl+"AddChemical" ,
			params: $params(fv , 'chemical') ,
			success: this._save,
			failure: $failure ,
			scope: this
		});
	} , 

	_save: function(o){
		var bd = $back(o);
		if (bd.isok){
			MB.hide();
			PM.msg("保存成功" , "保存分类成功!");
			this.form.getForm().reset();
			this.win.loadCatalogStore();			
			this.backToForm();
		}else{
			MB.alert("错误","保存信息时发生错误!<br>"+bd.getErrorInfo());
		}
	}

});