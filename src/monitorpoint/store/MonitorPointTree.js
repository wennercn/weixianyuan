Ext.define('WXY.monitorpoint.store.MonitorPointTree', {
    extend: 'Ext.data.TreeStore',
	requires: [
		'WXY.gis.Config' , 
		"WXY.monitorpoint.model.MonitorPoint"
	] ,
	model: 'WXY.monitorpoint.model.MonitorPoint',
	autoLoad: false ,
	clearOnLoad: true , 
	folderSort: true,

	constructor: function(config){
		var me = this;
		me.proxy = {
			type: 'ajax',
			url: config.url || "" ,
			extraParams: config.extraParams || {} ,
			reader: {
            	type: 'json',
            	messageProperty: 'message'
			} ,
			listeners: {
				"exception" : function(proxy , data , operation){
					MB.alert("错误" , data.responseText);
					return;
				}
			}
		};
		this.callParent([config]);
	} ,
	root: {
		dangerid: "0" ,
		dangername: "所有区域" ,
		expanded:true
	} ,

	listeners:{
		beforeload: function(){
			//MB.loading("读取STAR服务标准数据");
		} ,
		load: function(){
			//MB.hide();
		},
		scope:this
	} ,

	/*
    hasFilter: false,
    filter: function(filters, value) {

        if (Ext.isString(filters)) {
            filters = {
                property: filters,
                value: value
            };
        }

        var me = this,
            decoded = me.decodeFilters(filters),
            i = 0,
            length = decoded.length;

        for (; i < length; i++) {
            me.filters.replace(decoded[i]);
        }

        Ext.Array.each(me.filters.items, function(filter) {
            Ext.Object.each(me.tree.nodeHash, function(key, node) {
                if (filter.filterFn) {
                    if (!filter.filterFn(node)) node.remove();
                } else {
                    if (node.data[filter.property] != filter.value) node.remove();
                }
            });
        });
        me.hasFilter = true;
    },

    clearFilter: function() {
        var me = this;
        me.filters.clear();
        me.hasFilter = false;
        me.load();
    },

    isFiltered: function() {
        return this.hasFilter;
    } ,
    */

	filterBy : function(fn, scope) {
	  var me    = this,
	  root  = me.getRootNode(),
	  tmp;
	  // the snapshot holds a copy of the current unfiltered tree
	  me.snapshot = me.snapshot || root.copy(null, true);
	  var hash = {};
	  tmp = root.copy(null, true);

	  tmp.cascadeBy(function(node) {
	    if (fn.call(me, node)) {
	      if (node.data.parentId == 'root') {
	        hash[node.data.id] = node.copy(null, true);
	        hash[node.data.id].childNodes = [];
	      }
	      else if (hash[node.data.parentId]) {
	        hash[node.data.parentId].appendChild(node.data);
	      }
	    }
	    /* original code from mentioned thread
	    if (fn.call(scope || me, node)) {
	      node.childNodes = []; // flat structure but with folder icon
	      nodes.push(node);
	    }*/
	  });
	  delete tmp;
	  root.removeAll();
	  var par = '';s
	  for (par in hash) {
	    root.appendChild(hash[par]);
	  }      
	  return me;
	},
	clearFilter: function() {
	  var me = this;
	  if (me.isFiltered()) {
	    var tmp = [];
	    var i;
	    for (i = 0; i < me.snapshot.childNodes.length; i++) {
	      tmp.push(me.snapshot.childNodes[i].copy(null, true));
	    }
	    me.getRootNode().removeAll();	    
	    me.getRootNode().appendChild(tmp);
	    delete me.snapshot;
	  }
	  return me;
	},
	isFiltered : function() {
	  return !!this.snapshot;
	}




});