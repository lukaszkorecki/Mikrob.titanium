
/**
 * Service abstract class, only to be used while implementing additional services,
 * use as a base in communication with the rest of the system
 * @author Lukasz
 * @package deskblip.class.service
 */
var Service = Class.create({
	initialize : function(login, password) {
		this.login = login;
		this.credentials = btoa(this.login+":"+password);
	},
	login : function() {},
	getDashboard : function() {},
	getSubscriptions : function() {},
	getServiceInfo: function() {}
	}
);
