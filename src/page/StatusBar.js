/**
* 状态栏
*/
Ext.define('WXY.page.StatusBar' , {
	extend:"Ext.ux.statusbar.StatusBar" ,
	id:"pagestatusbar" , 
	dock:"bottom" ,
	defaultText:"Ready" ,
	initComponent: function(){
		var me = this;
		me.items = [
			'->' ,
			{text:"当前用户:<b>"+$ADMIN.Name+"</b>" , id:"statusbar_person" , iconCls:"ico_admin" , menu1:{
				defaults: {handler:this.onClick , scope:this} ,
				items:[
					{text:"我的首页" , iconCls:"ico_home" , module:"person.Index" } , 
					{xtype:"menuseparator"} ,
					{text:"个人设置" , iconCls:"ico_setting" , module:"admin.InfoWindow" , isWindow:true} ,
					{text:"修改密码" , iconCls:"ico_password" , module:"admin.PasswordWindow" , isWindow:true} , 
					{xtype:"menuseparator"} ,
					{text:"退出系统" , iconCls:"ico_logout" , handler:function(){
						$ADMIN.logout();
					}}
				]
			}} , '-' ,
			{text:"监控状态" , iconCls:"ico_status_ok" , tooltip:"点击查看当前的监控信息"}
		];
		me.callParent();	
	} , 
	onClick: function(menu , e){
		if (!menu) return;
		this.fireEvent('menuclick', menu , 'menu');
	}
});