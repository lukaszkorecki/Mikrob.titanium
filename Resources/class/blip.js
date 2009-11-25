
/**
 * BlipApi class, extends Service class 
 */
var Blip = new Class.create(Service,{
	initialize : function($super, login, password) {
		$super(login, password);
	},
	api_root : 'http://api.blip.pl/',
	dashboard_last_id : 0,
	bliposphere_last_id : 0,
	tag_last_id : 0,
	include_string_user : "?include=user,recipient",
	include_string_full : "?include=user,user[avatar],recipient,recipient[avatar],pictures",
	commonHeaders : function() {
		var self = this;
		return {
				'X-blip-api' : '0.02',
				'Accept' : 'application/json',
				'User-Agent' : Titanium.App.getName()+" "+Titanium.App.getVersion(),
				"Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
//				'Authorization' : 'Basic '+self.credentials
			};
	},
	dashboardGet : function() {
		var self = this;
		 var url = self.api_root+'dashboard'+self.include_string_full;
		if(self.dashboard_last_id !== 0) {
			 url = self.api_root+'dashboard/since/'+self.dashboard_last_id+self.include_string_full;
		}
		req = new HttpConnector();
		req.setRequestHeaders(self.commonHeaders());
		req.setUserCred(self.login, self.password);
		req.get(url);
		req.onSuccess = function(status,response) {
			console.log("GET:"+status);
			var ob = Titanium.JSON.parse(response);
			if(ob.length >0) {
				self.dashboard_last_id= ob[0].id;
				self.dashboardProcess(ob,self.dashboard_last_id);
			}
		};
		req.onFailure = function(status, response) {
			alert(status);
			alert(response);
		};
	},
	dashboardProcess :function(response_obj,is_update){},
	handleFailure :	function(response_obj){},
	createBlip : function(str) {
		var self = this;
		req = new HttpConnector();
		req.setRequestHeaders(self.commonHeaders());
		req.setUserCred(self.login, self.password);
		req.post(self.api_root+'updates','update[body]='+str);
		req.onSuccess = function(resp) { 
			Interface.setAreaContent();
			$('throbber').toggle();
			Interface.notify(Titanium.App.getName(),'Wysłano');
			$('sender').enable();
		};
		req.onFailure = function(resp) {
			console.dir(resp);
		};
	
	}
});
