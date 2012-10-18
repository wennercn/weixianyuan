Ext.define("WXY.gis.Index" , {
	extend:"WXY.ux.BaiDuMapPanel" ,
	requires:[
		'WXY.gis.Toolbar' , 
		'WXY.gis.CtxMenu' , 
		'WXY.monitorpoint.Window'
	] ,

	mapCenterAddress: '国际创业中心' , 
	mapCenterCity: '天津' ,
	mapZoom: 18 , 
	useLocation: false , 

	initComponent: function(){
		var me = this;
		//控制台窗口
		me.console = Ext.create("WXY.gis.console.Window" , {
			parent: me
		});
		

		//
		Ext.apply(me , {
			dockedItems:[
				{xtype:"maptoolbar" , parent: me}
			]
		})
		
		me.on({
			afterlayout: this.showConsole , 
			contextmenu: this.showCtxMenu , 
			scope: this
		})
		me.callParent();
	} , 
	initMain: function(){
		var me = this;
	} , 
	//显示控制台
	showConsole: function(){
		this.console.setSizeAndPosition();
		this.console.show();
	} , 
	//显示右键菜单
	showCtxMenu: function(obj){
		if (!this.ctxMenu){
			this.ctxMenu = Ext.create("WXY.gis.CtxMenu" , {parent:this})
		}
		this.ctxMenu.showAt(obj.clientX , obj.clientY);

	} , 
	add1: function(){
		var mpw = Ext.create("WXY.monitorpoint.Window");
		mpw.showForm();
	}
});