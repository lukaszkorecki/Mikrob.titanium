var Blip = new Class.create(Service,{
	initialize : function($super, login, password) {
		$super(login, password);
	},
	api_root : 'http://api.blip.pl/',
	include_string_user : "?include=user,recipient",
	include_string_full : "?include=user,user[avatar],recipient,recipient[avatar],pictures",
	dashboard_last_id : 0,
	dashboardGet : function() {
		var self = this;
		 var url = self.api_root+'dashboard'+self.include_string_full;
		if(self.dashboard_last_id !== 0) {
			 url = self.api_root+'dashboard/since/'+self.dashboard_last_id+self.include_string_full;
		}
		new Ajax.Request(url,
			{
			'method' : 'GET',
			'evalJS' : true,
			'requestHeaders' : {
				'X-blip-api' : '0.02',
				'Accept' : 'application/json',
				'User-Agent' : Titanium.App.getName().replace('b','B')+" "+Titanium.App.getVersion(),
				"Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
				'Authorization' : 'Basic '+self.credentials
			},
			onSuccess : function(response) {

			console.dir(response);
				var is_update = true;
				if(self.dashboard_last_id===0){
				is_update = false;
				console.log('here');
				}
				var ob = Titanium.JSON.parse(response.responseText);
				self.dashboard_last_id= ob[0].id;
				

				self.dashboardProcess(ob,is_update);
			},
			on403 : function() {alert('zŁy login or haśło');},
			on401 : function() {alert('zŁy login or haśło');},
			on501 : function() {alert('blip niedomaga');},
			on503 : function() {alert('blip niedomaga');},
			onFailure : function(response) {
			
				var ob = Titanium.JSON.parse(response.responseText);
				self.handleFailure(ob);
			}
 		});
	},
	dashboardProcess :function(response_obj,is_update){},
	handleFailure :	function(response_obj){},
	createBlip : function(str) {
		var self = this;
		new Ajax.Request(self.api_root+'updates',
			{
				'method' : 'POST',
				'evalJS' : true,
				'requestHeaders' : {
					'X-blip-api' : '0.02',
					'Accept' : 'application/json',
					'User-Agent' : Titanium.App.getName()+" "+Titanium.App.getVersion(),
					"Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
					'Authorization' : 'Basic '+self.credentials
				},
				'postBody' : 'update[body]='+Titanium.Network.encodeURIComponent(str),
				onSuccess : function(resp) {  Interface.setAreaContent(); $('throbber').toggle(); Interface.notify(Titanium.App.getName().replace('b','B'),'Wysłano');},
			on403 : function() {alert('zŁy login or haśło');},
			on401 : function() {alert('zŁy login or haśło');},
			on501 : function() {alert('blip niedomaga');},
			on503 : function() {alert('blip niedomaga');},
				onFailure : function(resp) { console.dir(resp);}
			}
		);
	
	}
});
