var Flaker = new Class.create(Service,{
  initialize : function($super, login, password, service_id) {
    $super(login, password, service_id);
    this.type = "Flaker";
  },
  last_id : 0, // Flaker.pl uses timestamps instead of ID's
  current_page : 0,
  api_root : 'http://api.flaker.pl/api',
  //  default settings for each API request
  include_string_full : '/mode:raw/html:false/limit:20/comments:true', // /sort:asc',
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
      console.log(status);
    };
  },
  dashboardProcess :function(response_obj,is_update){

    interfaces[this.service_id].draw(response_obj, is_update);
  },
  post : function(str) {
   var self = this;
   var headers= self.commonHeaders();
   headers['Authorization'] = 'Basic '+btoa(self.login+":"+self.password);
   console.dir(headers);
   new Ajax.Request(self.api_root+'/type:submit', {
    method : 'post',
    requestHeaders : headers,
    postBody : 'text='+encodeURIComponent(str),
    onSuccess : function( xhr, resp) { 
      var response_ob = Titanium.JSON.parse(xhr.responseText);

      console.dir(response_ob);
      self.afterSend(response_ob, true);
    },
    onFailure : function(xhr, resp) {
      var response_ob = Titanium.JSON.parse(xhr.responseText);
      self.afterSend(response_ob, false);
      console.dir(xhr);
    }
  });
  },
  post_old : function(str) {
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
  },
  getFlak: function(flak_id) {
    var self = this;
    var req = new HttpConnector(self.commonHeaders());
    req.setUserCred(self.login, self.password);
    req.get(self.api_root+self.include_string_full+'/type:show/entry_id:'+flak_id);
    req.onSuccess = function(resp, data) {
      self.onGetFlak(Titanium.JSON.parse(data), true);
    };
    req.onFail =function(resp, data) { self.onGetFlak(Titanium.JSON.parse(data), false);};
  },
  onGetFlak: function(flak_data, was_success) {
    interfaces[this.service_id].showFlak(flak_data, was_success);
  }
});
