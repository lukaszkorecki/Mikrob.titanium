
/**
 * Service abstract class, only to be used while implementing additional services,
 * use as a base in communication with the rest of the system
 * @author Lukasz
 * @package mikrob.class.service
 */
var Service = Class.create({
  initialize : function(login, password, service_id) {
    this.login = login;
    this.password = password;
    this.credentials = btoa(this.login+":"+password);
    this.service_id = service_id;
  },
  loginFail : function() {
    interfaces[this.service_id].loginFail();
  },
  saveService : function(type, login, password) {
  },
  deleteService : function() {

  },
  updateService : function() {

  }


});
