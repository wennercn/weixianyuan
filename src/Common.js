Ext.define("WXY.Common" , {});

Ext.apply(Ext.Action, {
    // private
    remove : function(comp) {
        this.items.remove(comp);
    }
});

Ext.apply(Ext.Date , {
	dateDiff: function(util , dateA , dateB){
		var diff = dateA - dateB;

        switch(util.toLowerCase()) {
            case Ext.Date.MILLI:
				diff = diff;
                break;
            case Ext.Date.SECOND:
                diff = dif / 1000;
                break;
            case Ext.Date.MINUTE:
                diff = diff / 1000 / 60;
                break;
            case Ext.Date.HOUR:
                diff = diff / 1000 / 60 / 60 ;
                break;
            case Ext.Date.DAY:
                diff = diff / 1000 / 60 / 60 / 24 ;
                break;
            case Ext.Date.MONTH:
                break;
            case Ext.Date.YEAR:
                break;
			default:
				break;
        }
		return diff;
	}
})


var wsurl = "ws/default.asp"
/*
	转换参数
*/
function $params(obj){
	return {"action": obj.action , "params" : escape(Ext.encode(obj))};
}
/*
	$back()
	解析返回的数据,返回该对象
*/
function $back(obj , type){
	this.isok = false;
	this.getErrorInfo = function(){
		return this.errinfo;
	}
	this.getMsg = function(){
		return this.msg;
	}
	this._data = obj;
	if (obj.responseText && Ext.isEmpty(obj.responseText)){
		this.errinfo = "未返回任何数据,请检查程序!"
		return this;
	}
	if (type== "json"){
	    try{
		    eval("var bd = "+obj.responseText);
	    }catch(e){
		    this.errinfo = "返回的数据为无效的JSON格式,请检查数据!\n\n"+obj.responseText;
		    return this;
	    }

	    this.jdata = {}
	    Ext.apply(this.jdata , bd)
	    if ($chk(jdata.code)){
		    switch (jdata.code){
		    //	case : ""

		    }
	    }

	    if (!this.jdata.succ){
		    this.errinfo = this.jdata.msg;
		    return this;
	    }

	    this.isok = true;
	    this.msg = this.jdata.msg;
	    if (this.jdata.data){
		    this.data = this.jdata.data;
	    }
	}else{
        var bd = obj.responseXML ? obj.responseXML : obj;
		var root = Ext.DomQuery.selectNode("root" , bd); // bd.getElementsByTagName("root")[0]

		if (!root){
			this.errinfo =  "返回的数据为无效的XML格式,请检查数据!\n\n"+obj.responseText;
			return this;
		}
	    this.xdata = bd;
	    var status = root.getAttribute("status")
	    if (status !="true"){
	        this.errinfo = root.getAttribute("message");
	        return this
	    }
	    this.isok = true;
		this.serverdate = Ext.Date.parse(root.getAttribute("serverdate") , "Y-m-d H:i:s");
		if (WXY.App != undefined) {
			WXY.App.ServerDate = this.serverdate;
		}
	    this.msg = root.getAttribute("message")
	    this.data =Ext.DomQuery.selectNode("data" , bd);
	}
	return this;
}

function $failure(o , fn){
	Ext.MessageBox.alert("错误" , "访问页面发生错误,请检查网络连接!<br>"+o.responseText);
	if (!fn){

	}else{

	}
}

function $failurebody (o , el){
	if (el.setLoading) el.setLoading(false);
	el.body.update("<div class='ajaxfailure'>错误:<br>"+o.responseText.replace("\n" , "<br>")+"</div>")
	MB.hide();
}

function $parseCreateError(err){
	var e = err;
	var title = "" , msg = e.message || e.msg, errs = [];
	if (msg.indexOf("Cannot create")>-1) errs.push("不能创建实例,可能没加载文件!");
	if (msg.indexOf("Failed loading")>-1) errs.push("加载文件错误!");
	if (msg.indexOf("The following classes are not declared") >-1) errs.push("加载的文件中没有包括下面的类名称!")
	MB.alert("错误" , "创建消息处理组件出现错误!<br>"+e.name+"<br>"+e.message);
}


//MB
MB = Ext.MessageBox;
MB.loading = function(msg , title){
	MB.show({
		title: title || "请等待" ,
		msg: msg + "...",
		wait:true,
		width : 250 ,
		waitConfig: {interval:200}
	})
}

//popmsg
PM = function(){
    var msgCt;

    function createBox(t, s){
       // return ['<div class="msg">',
       //         '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
       //         '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>', t, '</h3>', s, '</div></div></div>',
       //         '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
       //         '</div>'].join('');
       return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
    }

	return {
      msg : function(title, format){
            if(!msgCt){
                msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
            }
            var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.DomHelper.append(msgCt, createBox(title, s), true);
            m.hide();
            m.slideIn('t').ghost("t", { delay: 1000, remove: true});
        }
	}
}();

//combo
Ext.define("Ext.ux.myCombo" , {
	extend: "Ext.form.field.ComboBox" ,
    initComponent: function(){
		//数字增长序_data
		//this._data = []
		if (this.minNumber != undefined && this.maxNumber != undefined){
			this._data=[]
			var step = this.step || 1;
			for (var k = this.minNumber ; k<=this.maxNumber ; k=(k*100+step*100)/100 ){
				this._data.push([k , k+(this.unit || "")])
			}
		}
		//定义STORE
		if (this.storeType == "remote"){

			if (!Ext.ModelManager.isRegistered('CodeCombo')) {
				Ext.define("CodeCombo", {
					extend: "Ext.data.Model",
					idProperty: "id" ,
					fields: [
						{name: 'id', mapping: '@item_id'},
						{name:"name" , mapping:"@name"},
						{name:"value" , mapping:"@property"}
					]
				});
			}

			this._store = new Ext.data.Store({
				autoLoad:true ,
				model: "CodeCombo" ,
				proxy: {
					type: 'ajax',
					extraParams: {codetype: this.codeType} ,
					url: "ws/Common.asmx/GetCodeCombo" ,
					reader: {
						type: 'xml',
						record: 'RowSet R'
					}
				}
			});

			this.valueField = this._valueField  ||  "id";
			this.displayField = this._displayField || "value";

		}else{
			var ts = [];
			var ds = [];
			if (this._data) {
				Ext.each(this._data , function(n , i){
					if (Ext.isArray(n)) {
					}else{
						this._data[i] = [n , n];
					}
				} , this);
				ds = this._data;
			}

			this._store = new Ext.data.ArrayStore({
				fields: ['value' , 'title'],
				data : ds
			})
			this.valueField = "value";
			this.displayField = "title";
			this.stored = true;
		}

		var config = {
			fieldLabel:this.fieldLabel ||""
			//,name: this.name
			//,id: this.id
			,store: this._store
			,valueField:this.valueField
			,displayField:this.displayField
			//,typeAhead: true
			,mode: 'local'
			,triggerAction: 'all'
			//,selectOnFocus:true
			,forceSelection : this.canInput=="undefined" ? true : this.canInput
		};

		Ext.apply(this , config);
		this.callParent();
	} ,
	setValue1: function(v){
		alert(this.store.state)
		if(this.store.state != 'loaded'){
			this.store.on('load', Ext.bind(this.setValue , this , arguments) , null, {single: true});
			if(this.store.state != 'loading'){
				//this.store.load();
			}
			return;
		}else{
			this.callParent(v);
		}
	}
})

//加.XML属性
if( document.implementation.hasFeature("XPath", "3.0")){
	Document.prototype.__defineGetter__("xml",   function   ()   {
		return   (new   XMLSerializer()).serializeToString(this);
	});

	Node.prototype.__defineGetter__("xml", function(){
			return (new XMLSerializer).serializeToString(this);
	});
}


Ext.ux.dotNumber = function(v){
		v = v.toString();
		if (!v) return v;
		var r = /(\d+)(\d{3})/;
		while (r.test(v)) {
			v = v.replace(r, '$1' + ',' + '$2');
		}
		return v;
}

Ext.ux.FormatDate = function(v , formats , emptytext){
	var d;
	if (!v || v == '0-00-00 00:00:00' || v == "1900-01-01 00:00:00") return emptytext != undefined ? emptytext : "-";
	if (typeof v == "string"){
		if (isNaN(new Date(v)))	{
			d = Ext.Date.parse(v , "Y-m-d H:i:s");
		}else{
			d = new Date(v);
		}
	}else{
		d = v
	}
	if (Ext.isDate(d)) {
		if (formats) return Ext.Date.format(d , formats);
	}
	return d;
}

Ext.ux.FormatDateHG = function(v){
		var d = Ext.ux.FormatDate(v , "n-d H:i");
		d = (d== "-" || !d) ? (v||"") : d;
		if (d.indexOf("后告") > -1) {
			var d1 = Ext.Date.parse(v.split(" ")[0]  , "Y-m-d") || Ext.Date.parse(v.split(" ")[0] , "Y-n-j");
			return d1 ? Ext.Date.format(d1 , "n-d 后告") : d;
		}else{
			return d;
		}
}


Ext.ux.ConvertDate = function(v , r){
	var d = Ext.ux.FormatDate(v , 'Y-m-d H:i:s');
	return d == '-' ? '' : d;
}

Ext.ux.FormatYS = function(v){
	if (!v) return "-";
	if (isNaN(v)) return "-";
	return Math.floor(v/60)+"时"+(v%60 > 0 ? v%60+"分" : "");
}

Ext.ux.FormatExcelYS = function(v){
	if (!v) return "";
	if (isNaN(v)) return "";
	return Math.floor(v/60)+(v%60)/100;
}

//formatNumber
Ext.ux.FormatNumber = function(srcStr,nAfterDot,dotforempty){
    var srcStr,nAfterDot;
    var resultStr,nTen;
    srcStr = ""+srcStr+"";
    strLen = srcStr.length;
    dotPos = srcStr.indexOf(".",0);
    if (dotPos == -1){
        resultStr = srcStr;
		if (!dotforempty) return resultStr;
        resultStr = srcStr+".";
        for (i=0;i<nAfterDot;i++){
            resultStr = resultStr+"0";
        }
        return resultStr;
    } else{
        if ((strLen - dotPos - 1) >= nAfterDot){
            nAfter = dotPos + nAfterDot + 1;
            nTen =1;
            for(j=0;j<nAfterDot;j++){
            nTen = nTen*10;
        }
        resultStr = Math.round(parseFloat(srcStr)*nTen)/nTen;
        return resultStr;
        } else{
            resultStr = srcStr;
            for (i=0;i<(nAfterDot - strLen + dotPos + 1);i++){
                resultStr = resultStr+"0";
            }
            return resultStr;
        }
    }
}





function json2xml(vs , nodename){
	if (!vs) {
		return "";
	}
	var singlenode = function(node , nodename){
		var tmp = [];
		for (var key in node){
			var n = node[key]
			var v = n || "";
			v = v.toString();
			v = v.replace(/\&/ig , "&apm;");
			v = v.replace(/\</ig , "&lt;");
			v = v.replace(/\>/ig , "&gt;");
			v = v.replace(/\"/ig , "&quot;");
			v = v.replace(/\'/ig , "&apos;");
			tmp.push(key +"=\""+v+"\"");
		}
		return"<R "+tmp.join(" ")+"></R>";
	}
	var arr = [];
	//如果是数组
	if (Ext.isArray(vs)){
		for (var i = 0 ; i<vs.length ; i++ ){
			var n = vs[i]
			arr.push(singlenode(n));
		}
	}else{
		arr.push(singlenode(vs , nodename));
	}
	arr = "<"+(nodename || "data")+">"+arr.join("")+"</"+(nodename || "data")+">"
	return arr;
}





function getLodop(oOBJECT,oEMBED){
/**************************
  本函数根据浏览器类型决定采用哪个对象作为控件实例：
  IE系列、IE内核系列的浏览器采用oOBJECT，
  其它浏览器(Firefox系列、Chrome系列、Opera系列、Safari系列等)采用oEMBED。
**************************/
        var strHtml1="<br>打印控件未安装!点击这里 <a href='res/activex/install_lodop.exe'>执行安装</a> ,安装后请刷新页面或重新进入。";
        var strHtml2="<br>打印控件需要升级!点击这里 <a href='res/activex/install_lodop.exe'>执行升级</a> ,升级后请重新进入。";
        var strHtml3="<br>(注：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】中先卸载它)";
        var LODOP=oEMBED;
	try{
	     if (Ext.isIE) LODOP=oOBJECT;	//IE
	     if ((LODOP==null)||(typeof(LODOP.VERSION)=="undefined")) {
			MB.alert("缺少插件" ,  strHtml1 + (Ext.isGecko ? strHtml3 : ""));
	     } else if (LODOP.VERSION<"6.0.0.1") {
			MB.alert("缺少插件" , strHtml2);
	     }
	     //*****如下空白位置适合调用统一功能:*********


	     //*******************************************
	     return LODOP;
	}catch(err){
	     MB.alert("缺少插件" , strHtml1);
	     return LODOP;
	}
}


