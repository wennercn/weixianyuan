/**
 * 返回信息处理
 */
Ext.define("WXY.util.ParseResponse" , {
	singleton: true , 
	getErrorInfo: function(){
		return this.errinfo;
	} , 
	getMsg: function(){
		return this.msg;
	} , 
	/*
	 *
	 */
	parse: function(obj , type){
		this.isok = false;
		this._data = obj;

		if (obj.responseText && Ext.isEmpty(obj.responseText)){
			this.errinfo = "未返回任何数据,请检查程序!";
			return this;
		}

		if (type== "json"){
			try{
				var bd = Ext.encode(obj.responseText);
				//eval("var bd = "+obj.responseText);
			}catch(e){
				this.errinfo = "返回的数据为无效的JSON格式,请检查数据!\n\n"+obj.responseText;
				return this;
			}

			this.jdata = bd;
			var status = bd.status;
			if (!status != 'succ'){
				this.errinfo = bd.message;
				return this;
			}

			//返回数据正确
			this.isok = true;
			this.serverdate = Ext.Date.parse(bd.serverdate , "Y-m-d H:i:s");
			this.msg = bd.message;
			if (bd.data){
				this.data = bd.data;
			}
		}else{
			var bd = obj.responseXML ? obj.responseXML : obj;
			var root = Ext.DomQuery.selectNode("root" , bd); // bd.getElementsByTagName("root")[0]

			if (!root){
				this.errinfo =  "返回的数据为无效的XML格式,请检查数据!\n\n"+obj.responseText;
				return this;
			}
			this.xdata = bd;
			var status = root.getAttribute("status");
			if (status !="succ"){
				this.errinfo = root.getAttribute("message");
				return this;
			}
			//返回数据正确
			this.isok = true;
			this.serverdate = Ext.Date.parse(root.getAttribute("serverdate") , "Y-m-d H:i:s");
			this.msg = root.getAttribute("message");
			this.data =Ext.DomQuery.selectNode("data" , bd);
		}

		if ($CONFIG != undefined) {
			$CONFIG.ServerDate = this.serverdate;
		}


		return this;


	}

});

window.$back = function(obj , type){
	return WXY.util.ParseResponse.parse(obj , type);
};
window.$backjson = function(obj , type){
	return WXY.util.ParseResponse.parse(obj , 'json');
}