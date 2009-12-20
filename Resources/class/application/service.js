
/**
 * Service abstract class, only to be used while implementing additional services,
 * use as a base in communication with the rest of the system
 * @author Lukasz
 * @package mikrob.class.service
 */
var Service = Class.create({
	initialize : function(login, password) {
		this.login = login;
		this.password = password;
		this.credentials = btoa(this.login+":"+password);
	},
	saveService : function(type, login, password) {
	},
	deleteService : function() {

	},
	updateService : function() {

	}


});
