Ext.define("WXY.page.Home" , {
	extend:"Ext.panel.Panel" ,
	initComponent: function(){

		Ext.apply(this , {
			loader: {
				autoLoad: true ,
				//loadMask: true ,
				url: 'docs/home.html' ,
				listeners: {
					beforeload: function(){
						//this.setLoading("fasdfasdf");
					} ,
					scope: this
				} ,
				scope: this
			} ,
			title:"首页" ,
			iconCls:"ico_home" ,
			bodyCls:"pagehome" ,
			html: "读取数据中..."
		})
		this.callParent();

		this.on("render" , function(){
			//this.getLoader().load()
		} , this)

	}
});