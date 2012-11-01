/*
 * Application
 */
Ext.define('WXY.App' , {
	singleton: true,
  	constructor: function(config) {
		Ext.QuickTips.init();
	},
	check: function(){
		//检测用户信息
		//$ADMIN.checkSession({from:"init"});
		this.start();
	} ,
	start: function(){
		this.hideDomLoad();
		//创建监控点STORE
		this.createMPStore();
		this.createPage();
	} , 
	
	hideDomLoad: function(){
		if (Ext.get("loading")) Ext.get('loading').fadeOut({remove:true});
		if (Ext.get('loading-mask')){
			Ext.get('loading-mask').fadeOut({remove:true});	
		}
	}, 

	createPage: function(){
		try{
			this.page = Ext.create('WXY.page.ViewPort' , {			
		});
		}catch(e){
			MB.alert("createPage错误" , e.message+"<br>app.js");
			return;
		}
	} , 

	createMPStore: function(){
		var store = Ext.create("WXY.monitorpoint.store.MonitorPointTree" , {
			recordPath: "Danger" , 
			groupField: "dangertype" , 
		    getGroupString: function(r) {
		        var s = ['' , '传感器' , '监控摄像头'][r.get('dangertype')];
		        return s;
		    } , 	
			storeId:'mp-store' , 
			url: $CONFIG.wsPath+"monitorpoint.asmx/GetTree"
		});

		//AREA STORE
		var areaStore = Ext.create("WXY.monitorpoint.store.MonitorPoint" , {
			storeId: "area-store"
		});
		//SPACE STORE
		var spaceStore = Ext.create("WXY.monitorpoint.store.MonitorPoint" , {
			storeId: "space-store"
		});

		var canInsert = function(record , type){
			return record.get("kind") == type;
		}

		var createRecord = function(data){
			return Ext.create("WXY.monitorpoint.model.MonitorPoint" , data);
		}

		//mpstore更新 , 更新其他两个STORE
		store.on({
            load: function(){
            	areaStore.removeAll();
            	spaceStore.removeAll();
				var root = store.getRootNode();
				root.cascadeBy(function(cnode) {
					if (canInsert(cnode , "area")) areaStore.add(createRecord(cnode.data));
					if (canInsert(cnode , "space")) spaceStore.add(createRecord(cnode.data));
				} , this);
            } ,
            append: function(ds , rs){
            	Ext.each(rs , function(cnode){
					if (canInsert(cnode , "area")) areaStore.add(createRecord(cnode.data));
					if (canInsert(cnode , "space")) spaceStore.add(createRecord(cnode.data));
            	});
            } , 
            add: function(ds , rs){
            	Ext.each(rs , function(cnode){
					if (canInsert(cnode , "area")) areaStore.add(createRecord(cnode.data));
					if (canInsert(cnode , "space")) spaceStore.add(createRecord(cnode.data));
            	});
            },
            remove: function(ds , rs){
            	var id = rs.get("dangerid");
				if (canInsert(rs , "area")) areaStore.remove(areaStore.getById(id));
				if (canInsert(rs , "space")) spaceStore.remove(spaceStore.getById(id));
            },
            update: function(ds , record , opera){
				if (opera == 'commit') return;
            	var id = record.get("dangerid");
				if (canInsert(record , "area")) areaStore.getById(id).set(record.data);
				if (canInsert(record , "space")) spaceStore.getById(id).get(record.data);
            },
            clear: function(){
            	areaStore.removeAll();
            	spaceStore.removeAll();
            } , 
            scope: this
        });

		return store;
	}

});

window.$APP = WXY.App;