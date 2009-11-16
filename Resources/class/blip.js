var Blip = new Class.create(Service,{
	initialize : function($super, login, password) {
		$super(login, password);
	},
	getDashboard : function() {
	air.trace('getting it');
	var self = this;
	air.trace(self.credentials);
	new Ajax.Request('http://api.blip.pl/dashboard',{
			'method' : 'GET',
			'evalJS' : true,
			'requestHeaders' : {
				'X-blip-api' : '0.02',
				'Accept' : 'application/json',
				'Authorization' : 'Basic '+self.credentials
			},
			on200 : function(response) {
			air.Introspector.Console.dump(response);
				Interface.draw(response.responseText.evalJSON())
			},
onFailure : function(response) {

	air.Introspector.Console.dunp(response);
}
		});
	}
		
});
