
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

  },
  toElement : function() {
    var container = new Element("div", { id : [this.login, this.type, this.service_id].join("_")});
    var p = new Element("p").update(this.login);
    p.insert( new Element("span", { "class" : "type"}).update("("+this.type+")"));
    p.insert(new Element("span", { "class" : "actions"}));
    ["delete"].each(function(el){
      p.down("span.actions").insert(new Element("button", { "service_id" : this.service_id}).update(el));
    });
    container.insert(p);
    return container;
  }


});
