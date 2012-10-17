Ext.define("WXY.gis.console.Window" , {
	extend:"Ext.window.Window" , 
	title:'监控控制台' , 
    collapsible: true , 
    closable: false , 
    draggable: false , 
    resizable: false , 
	closeAction: 'hide' , 
	width:250 , 
    margins: "50 10 20 20" ,
    listeners: {
        show: function(win){
            win.getEl().setOpacity(.8);
        } , 
        beforehide: function(){
            return false;
        }
    } , 
    tools:[{
        type:'refresh',
        tooltip: 'Refresh form Data',
        // hidden:true,
        handler: function(event, toolEl, panel){
            // refresh logic
        }
    },
    {
        type:'help',
        tooltip: 'Get Help',
        handler: function(event, toolEl, panel){
            // show help here
        }
    }] ,
    setSizeAndPosition: function(){
        var win = this;
            var margin = win.margins || 20;
            var margins = {};

            if (Ext.isNumber(margin)){
                margins = {
                    top: margins , 
                    bottom: margins , 
                    left: margins , 
                    right: margins
                }
            }else if(Ext.isString(margin)){
                margin = margin.split(" ");
                margins = {
                    top: margin[0] , 
                    right: margin[1] ,
                    bottom: margin[2] , 
                    left: margin[3]
                }
            }
            
            var con = win.parent.getEl();
            var consize = con.getSize();
            var conposition = con.getXY();


            var w , h , x , y;
            w = win.width;
            h = consize.height - margins.top -margins.bottom;
            win.setSize(w , h);

            x = consize.width - w - margins.right;
            y = parseInt(conposition[1]) + parseInt(margins.top);
            win.setPosition(x , y);
            //console.log({w:w , h:h , x:x , y:y})
    }
});