Ext.define("WXY.gis.console.Window" , {
	extend:"Ext.Window" , 
	//autoShow: true , 
	closeAction: 'hide' , 
	width:200 , 
	height:500 , 
    animateTarget : true,
    setAnimateTarget : Ext.emptyFn,
    animShow : function(){
    	var el = this.getEl();
        el.fadeIn({
            duration: .25
        });
    },
    animHide : function(){
        if (this.el.shadow) {
            this.el.shadow.hide();
        }
        this.el.fadeOut({
            duration: .25,
            callback: this.afterHide,
            scope: this
        });
    }
});