Ext.define('WXY.page.ViewPort' , {
	    extend: 'Ext.container.Viewport',
		alias: 'wd.page' ,
		initComponent: function(){
			var page = Ext.create("WXY.page.Page" , {
				region:"center"
			});

			Ext.apply(this, {
				layout: 'border',
				border:false ,
				margins:0 ,
				padding:0 ,
				items: [
					page
				]
			});
			this.callParent(arguments);
		}
});