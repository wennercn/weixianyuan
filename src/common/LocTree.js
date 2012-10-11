Ext.define("WXY.common.LocTree" , {
	extend: "Ext.tree.Panel" ,
	initComponent: function(){
		this.addEvents("treeclick");

		this.root = {
			expanded: true,
			children: [
				{text:"赤峰市" , expanded:true , children: [
					{text:"赤峰市本级" , leaf:true} ,
					{text:"红山区" , leaf:true} ,
					{text:"元宝山区" , leaf:true} ,
					{text:"松山区" , leaf:true} ,
					{text:"阿鲁科尔沁旗" , leaf:true} ,
					{text:"巴林左旗" , leaf:true} ,
					{text:"巴林右旗" , leaf:true} ,
					{text:"林西县" , leaf:true} ,
					{text:"克什克腾旗" , leaf:true} ,
					{text:"翁牛特旗" , leaf:true} ,
					{text:"喀喇沁旗" , leaf:true} ,
					{text:"宁城县" , leaf:true} ,
					{text:"敖汉旗" , leaf:true}
				]}
			]
		};

		Ext.apply(this , {
			iconCls:"ico_tree" ,
			cls:"gridtree" ,
			rootVisible: false ,
			useArrows: true ,
			lines: true ,
			//title:"所属地区" ,
			//bodyBorder: false
			//margin:"0 4 0 0" ,
			autoScroll:true
		});
		this.callParent();
		this.on("itemclick" , this.onClick , this);
	} ,
	onClick: function(view , r , op){
		this.fireEvent("treeclick" , r , 'tree');
	}
});