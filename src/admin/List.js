/*管理员信息*/
Ext.define('WXY.admin.List', {
    extend: 'Ext.grid.GridPanel',
    alias: 'wd.manager',
    initComponent: function(){

		Ext.regModel('Manager', {
			fields: [
				{name:"id" , mapping:"@id"} ,
				{name:"mname" , mapping:"@mname"} ,
				{name:"mpassword" , mapping:"@mpassword"} ,
				{name:"fullname" , mapping:"@fullname"} ,
				{name:"islock" , mapping:"@islock"} ,
				{name:"status" , mapping:"@status"} ,
				{name:"create_date" , mapping:"@create_date"}
			],
			proxy: {
				type: 'ajax',
				url : 'default.asp'
			}
		});

        this.store = new Ext.data.Store({
			autoLoad: false ,
            model: 'Manager',
            sortInfo: {
                property: 'id'
            },
            proxy: {
				type:"ajax" ,
				url: wsurl ,
				extraParams: {action:"getmanager"} ,
                reader: {
					type: 'xml',
					record: 'rowset row' ,
					idProperty: '@id'
                } ,
				listeners : {
					exception: function(a , b){
						MB.alert("错误" , b.responseText)
					}
				}
            }
        });

		this.columns = [
			{xtype: 'rownumberer' , text:"序号" , width:40},
			{text: 'ID',dataIndex: 'id' , hidden:true , width:40},
			{text: '登录名',dataIndex: 'mname' , width:120},
			{text: '名称',dataIndex: 'fullname' , width:100},
			{text: '锁定?',dataIndex: 'islock' , width:100},
			{text: '状态',dataIndex: 'status' , width:100},
			{text: '创建时间',dataIndex: 'create_date' , renderer:function(v){return Ext.ux.FormatDate(v , 'Y-m-d')} , width:100}
		]

        Ext.apply(this, {
			title :"管理员信息" ,
			iconCls:"icon_manager" ,
			dockedItems: [{
				dock: "top" ,
				xtype:"toolbar" ,
				itemId:"tbar" ,
				items: [
					{text:"添加" , iconCls:"icon_add" , handler:this.onAddclick , scope:this} , '-' ,
					{text:"修改" , iconCls:"icon_edit" , handler:this.onEditclick , scope:this , itemId:"edit" , disabled:true} , '-' ,
					{text:"删除" , iconCls:"icon_delete" , handler:this.onDeleteclick , scope:this , itemId:"delete" , disabled:true} , '-' ,
					{text:"刷新" , iconCls:"icon_refresh" , handler:this.storeload , scope: this}
				]
			}] ,
            selModel: {
                mode: 'SINGLE',
                listeners: {
                    scope: this,
                    selectionchange: this.onSelectionChange
                }
            } ,
            viewConfig: {
				emptyText:"<div style='padding:10px;color:blue;line-height:200%'>还没有任何管理员!<br>请点击上面按钮进行添加!</div>"
            }
        });
        this.callParent(arguments);
		this.storeload();
    } ,
	//选择记录
	onSelectionChange: function(m , s){
        var selected = s[0];
        this.getComponent("tbar").getComponent("delete").setDisabled(!selected);
        this.getComponent("tbar").getComponent("edit").setDisabled(!selected);
	} ,
    storeload: function(){
		this.store.load();
    },
	//删除
	onDeleteclick: function(){
		var r =this.getSelectionModel().getLastSelected()
		if (!r) return;
		this.fdr = r;
		Ext.MessageBox.show({
			title:'删除信息?',
			msg: "该操作将删除管理员 , 删除后不可恢复!<br>继续删除请点击 \"是\" , 否则请点击 \"否\"!",
			buttons: Ext.MessageBox.YESNO,
			fn: function(result){
				if (result == "no") return;
				MB.loading("删除管理员")
				Ext.Ajax.request({
					params: {"action":"deletemanager" , "id" : r.get("id")} ,
					success: this._del,
					failure: $failure ,
					scope: this
				});
			},
			icon: Ext.MessageBox.QUESTION ,
			scope: this
       });
	} ,
	_del: function(o){
			bd = $back(o);
		if (bd.isok){
			this.store.remove(this.fdr)
			this.fdr = null;
			MB.hide();
		}else{
			MB.alert("删除错误" , "删除信息时发生错误!<Br>"+bd.getErrorInfo())
		}
	} ,

	//获取窗口
	getWin: function(){
		if (!this.win){
			this.win = Ext.create("Ext.Window" , {
				title:"管理员信息" ,
				closeAction:"hide" ,
				modal: true ,
				border:false ,
				layout:"fit" ,
				maximizable:true ,
				items: this.form ,
				height:250 ,
				width:500
			})
		}
		if (!this.form){
			this.form = Ext.create("WXY.admin.Form" , {
				parent: this ,
				win: this.win ,
				listeners:{
					save: this.onSaveback ,
					scope:this
				}
			})
		}
		this.win.add(this.form);
		return this.win;
	} ,
	//添加
	onAddclick: function(){
		this.getWin();
		this.form.open();
	} ,
	//修改
	onEditclick: function(){
		var r =this.getSelectionModel().getLastSelected()
		if (!r) return;
		this.getWin();
		this.form.open(r);
	} ,
	//保存成功,回调
	onSaveback: function(pt , bd){
		this.storeload();
	}
})


Ext.define("WXY.admin.Form" , {
    extend: 'Ext.form.FormPanel',
    initComponent: function(){
		this.addEvents("save");

		Ext.apply(this , {
			//bodyBorder:false ,
			bodyPadding:15 ,
			fieldDefaults: {
				labelAlign:"left" ,
				labelWidth: 75 ,
				anchor:"100%" ,
				padding:"3 0 3 0" ,
				msgTarget: 'side'
			},
			url: 'save-form.php',
			defaultType:"textfield" ,
			items: [
				{hideLabel:true , xtype: 'displayfield',value: '<p>请在下面填写各项内容!</p>' , style:"color:#666"} ,
				{xtype:"hidden" , name:"id"} ,
				{xtype:"hidden" , name:"action" , value:"savemanager"} ,
				{fieldLabel: "<b>登录名</b>" , name:"mname" , allowBlank:false} ,
				{fieldLabel: "<b>密码</b>" , name:"mpassword" , allowBlank:false} ,
				{fieldLabel: "<b>显示名称</b>" , name:"fullname"}
			] ,
			dockedItems:[
				{
					xtype:"toolbar" ,
					dock:'bottom' ,
					items:[
						'->' ,
						{text:"保存信息" , iconCls:"icon_savemedium" ,  scale:"medium" , handler:this.save , scope:this} ,  '-' ,
						{text:"关闭窗口" , iconCls:"icon_cancelmedium" ,  scale:"medium" , handler:function(){this.win.hide()} , scope:this}
					]
				}
			]
		})
		this.callParent();
	} ,
	reset: function(r){
		this.getForm().reset();
		this.win.setTitle(r ? "修改管理员 '"+r.get("mname")+"' 的信息" : "添加管理员");
		this.win.show();
		if (r) this.getForm().loadRecord(r);
	} ,
	open: function(r){
		this.reset(r);
	} ,
	//保存
	save: function(){
		var f = this.getForm();
		var valid = f.isValid();
		if (!valid){
			//Ext.MessageBox.alert("信息错误","请填写用户名和密码!"  , this);
			return;
		}
		var fv = f.getValues();
		fv._id = 	fv.id;

		MB.loading((fv._id ? "修改" : "添加") + "管理员信息")

		Ext.Ajax.request({
			params: $params(fv) ,
			success: this._save,
			failure: $failure ,
			scope: this
		});
	} ,
	_save: function(o){
		var bd = $back(o)
		if (bd.isok){
			MB.hide();
			this.win.hide();
			this.fireEvent("save" , this , bd.data);
		}else{
			MB.alert("错误","保存信息时发生错误!<br>"+bd.getErrorInfo());
		}
	}

});