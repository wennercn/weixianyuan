/**
* 表单
*/
Ext.define("WXY.monitorpoint.Form" , {
    extend: 'Ext.form.Panel',
	bodyPadding:15 ,
	defaults: {
		labelAlign:"left" ,
		labelWidth: 75 ,
		anchor:"100%" ,
		padding:"3 0 3 0" ,
		msgTarget: 'side'
	},
	defaultType:"textfield" ,
    initComponent: function(){
    	var configData = WXY.gis.Config;
		var req = "<span style='color:red'>*</span>";
		Ext.apply(this , {
			items: this.createItems() ,
			dockedItems: [
				{xtype:"toolbar" , dock:"top" , items:[
					'->' , 
					{text:"<b>保存信息</b>" , iconCls:"ico_save" ,   handler:this.save , scope:this}
				]}
			]
		});
		this.callParent();
	} , 
	//初始化
	initMain: function(config){	
		var dangerKindData = WXY.gis.Config.dangerKindData[this.kind];
		config = config || {};
		this.record = null;
		this.win = this.up("window");
		this.win.setTitle("添加"+dangerKindData.name);
		this.win.setIconCls('ico_add');
		if (config.disableInit) return;
		this.getForm().reset();
		var values = null;
		if (config.data){
			values = config.data;
		}else if(config.record){
			this.record = config.record;
			this.win.setTitle("修改"+dangerKindData.name+" " +this.record.get("dangername")+ " 信息");
			this.win.setIconCls('ico_edit');
			values = this.record.data;
		}
		this.getForm().setValues(values);
	} , 

	createItems: Ext.emptyFn , 
	checkValueValid: function(){
		return true;
	} , 
	//保存
	save: function(){
		var f = this.getForm();
		var valid = f.isValid();
		if (!valid){
			MB.alert("错误","请填写必填信息!"  , this);
			return;
		}
		var fv = f.getValues();
		if (!this.checkValueValid(fv)) return;
		this.curMPValues = fv;
		MB.loading("保存信息");
		Ext.Ajax.request({
			url: this.win.wsUrl+"Save" ,
			params: $params(fv) ,
			success: this._save,
			failure: $failure ,
			scope: this
		});
	} ,

	_save: function(o){
		var bd = $backNode(o);
		if (bd.isok){
			MB.hide();
			PM.msg("保存成功" , "保存信息成功!");
			var store = Ext.data.StoreManager.lookup('mp-store');
			var areaStore = Ext.data.StoreManager.lookup('area-store');
			if (this.curMPValues.dangerid == 0){
				var reader = areaStore.getProxy().getReader();
				var rs = reader.readRecords(bd.data);
				if (Ext.getClassName(store).indexOf("Tree")>-1){					
					var node = rs.records[0];

					node.set("expand" , false);
					node.set("loaded" , true);
					node.set("leaf" , node.get("kind") == "point");

					var parentId = node.get("parentid");
					var parentNode = store.getNodeById(parentId);
					if (parentNode){
						parentNode.appendChild(node);
					}
				}else{
					store.add(rs.records);							
				}

			}else{
				this.record.set(this.curMPValues);
				//树更新
				if (Ext.getClassName(store).indexOf("Tree")>-1){	
					var changes = this.record.getChanges();
					//如果更新了父节点
					if (changes.parentid && changes.parentid != ""){
						var parentNode = store.getNodeById(changes.parentid);
						parentNode.appendChild(this.record);
					}
					//如果更新了坐标
					
				}
				this.record.commit();
			}
			this.win.hide();
		}else{
			MB.alert("错误","保存信息时发生错误!<br>"+bd.getErrorInfo());
		}
	}

});