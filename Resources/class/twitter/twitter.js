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
  checkUsage : function() {
    var self = this;
    var url = this.api_root+"/account/rate_limit_status.json";
    var req = new HttpConnector(self.commonHeaders);

    req.setUserCred(self.login, self.password);

    req.get(url);
    req.onSuccess = function(status, response) { 
      console.log(status);
      response = Titanium.JSON.parse(response);
      console.dir(response);
    };
    req.onFail = function(status, response) {
      console.log(status);
      response = Titanium.JSON.parse(response);
      console.dir(response);

    };
  },
  dashboardGet : function(offset) {
    var self = this;
    var url = self.api_root+"/statuses/home_timeline.json";
    var is_update = false;
    if(self.dashboard_last_id !== 0) {
      is_update = true;
      url += "?since_id="+self.dashboard_last_id;
    }
    console.log(url);
    req = new HttpConnector(self.commonHeaders);
    req.setUserCred(self.login, self.password);
    req.get(url);
    req.onSuccess = function(status, response) {
      var ob = {};
      if(response != undefined) {
        ob = Titanium.JSON.parse(response);
      } else {
        console.log(status);
        console.log(response);
        interfaces[self.service_id].notify("BŁĄŽ", "NIE POBRAŁEM!");
      }
      if(ob.length > 0) {
        self.dashboardProcess(ob, is_update);
        self.dashboard_last_id = ob[0].id;
      } else {
        interfaces[self.service_id].notify("Błąd", "Błąd pobierania, spróbuj później");
      }
    };
    req.onFail = function(status, response) {
      console.log(status);
      console.log(response);
      interfaces[self.service_id].notify("Błąd", "Błąd połączenia z API: " + status);
    };
    self.checkUsage();
  },
  dashboardProcess :function(response_obj,is_update){

    interfaces[this.service_id].draw(response_obj, is_update);
  },
  post : function(content) {
    var self = this;
    req = new HttpConnector();
    req.setUserCred(self.login, self.password);
    req.post(self.api_root+"/statuses/update.json", "status="+encodeURIComponent(content));
    req.onSuccess = function(resp) {
      self.afterSend(resp);
    };
    req.onFail = function(resp) {
      interfaces[self.service_id].notify("Błąd!", "Coś tam!");
      self.afterSend(resp, false);
    };
    self.checkUsage();
  },
  afterSend :  function(response_obj){
    interfaces[this.service_id].afterSend(response_obj);
  }
});
