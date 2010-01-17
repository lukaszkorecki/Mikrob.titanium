var Flaker = new Class.create(Service,{
  initialize : function($super, login, password, service_id) {
    $super(login, password, service_id);
  },
  last_id : 0, // Flaker.pl uses timestamps instead of ID's
  current_page : 0,
  api_root : 'http://api.flaker.pl/api',
  //  default settings for each API request
  include_string_full : '/mode:raw/html:false/limit:20', // /sort:asc',
  commonHeaders : function() {
    return {};
  },
  dashboardGet : function(offset) {
    var self = this;
    var url = self.api_root+self.include_string_full+'/type:friends/login:'+self.login;
    if (self.last_id !== 0) {
      url += '/since:'+self.last_id;
    }
    var req = new HttpConnector();
    req.setUserCred(self.login, self.password);
    req.get(url);

    req.onSuccess = function(status, response) {
      var obj = Titanium.JSON.parse(response);
      if(obj.entries.length > 0) {
        self.last_id = obj.entries[0].timestamp;
        self.dashboardProcess(obj.entries, false);
      }
    };
    req.onFail = function(status, response) {
      console.log("flak not  ok!");
      console.log(status);
      console.log(response);
    };
  },
  dashboardProcess :function(response_obj,is_update){

    interfaces[this.service_id].draw(response_obj, is_update);
  },
  post : function(str) {
      var self = this;
      var req = new HttpConnector(self.commonHeaders());
      req.setUserCred(self.login, self.password);
      req.post(self.api_root+'/type:submit','text='+encodeURIComponent(str));
      req.onSuccess = function(resp) { self.afterSend(resp, true); };
      req.onFail = function(resp, t) {
        interfaces[self.service_id].notify('Błąd', 'Błąd wysyłania... ' + resp, 'fail');
        console.dir(resp);
        console.dir(Titanium.JSON.parse(t));
        var was_success = true;
        self.afterSend(resp, was_success);
      };
  },
  afterSend :  function(response_obj, was_success){
    interfaces[this.service_id].afterSend(response_obj, was_success);
  }
});
