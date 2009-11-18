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
				'User-Agent' : Titanium.App.getName()+" "+Titanium.App.getVersion(),
				"Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
				'Authorization' : 'Basic '+self.credentials
			},
			onSuccess : function(response) {

				var ob = Titanium.JSON.parse(response.responseText);
				self.dashboard_last_id= ob[0].id;
				var is_update = self.dashboard_last_id ? true : false;
				self.dashboardProcess(ob,is_update);
			},
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
				'postBody' : 'update[body]='+str,
				onSuccess : function(resp) { alert(resp); self.dashboardGet();},
				onFailure : function(resp) { alert(resp);}
			}
		);
	
	}
});
