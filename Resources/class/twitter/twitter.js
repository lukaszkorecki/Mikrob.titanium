var Twitter = new Class.create(Service, {
	initialize : function($super, login, password, service_id, api_root) {
		$super(login, password, service_id);
		this.api_root  = (api_root) ? api_root : 'https://twitter.com/';
	},
	dashboard_last_id : 0,
	current_page : 0,
	commonHeaders :  {
		'Accept' : 'application/json'
	},
	dashboardGet : function(offset) {
		var self = this;
		var url = self.api_root+"statuses/home_timeline.json";
		console.log(url);
		req = new HttpConnector(self.commonHeaders);
		req.setUserCred(self.login, self.password);
		req.get(url);
		req.onSuccess = function(status, response) {
			var ob = {};
			if(response != undefined) {
				ob = Titanium.JSON.parse(response);
			}
			if(ob.length > 0) {
				self.dashboardProcess(ob, false);
			} else {
				interfaces[self.service_id].notify("Błąd", "Błąd pobierania, spróbuj później");
			}
		};
		req.onFail = function(status, response) {
			interfaces[self.service_id].notify("Błąd", "Błąd połączenia z API: " + status);
		};
	},
	dashboardProcess :function(response_obj,is_update){

		interfaces[this.service_id].draw(response_obj, is_update);
	}
});
