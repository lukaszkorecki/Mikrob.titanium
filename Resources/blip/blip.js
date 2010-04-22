/**
 * BlipApi class, extends Service class
 * TODO make HttpConnector a class variable
 * FIXME all onSuccess and onFail callbacks should be defined outside of the class
 * definition
 */
var Blip = new Class.create(Service,{
  initialize : function($super, login, password, service_id, api_root) {
    $super(login, password, service_id);
    this.api_root = api_root || 'http://api.blip.pl';
    this.type = "Blip";
  },
  dashboard_last_id : 0,
  bliposphere_last_id : 0,
  tag_last_id : 0,
  current_page : 0,
  include_string_user : "?include=user,recipient",
  include_string_full : "?include=user,user[avatar],recipient,recipient[avatar],pictures&limit=20",
  commonHeaders : function() {
    return {
      'X-blip-api' : '0.02',
      'Accept' : 'application/json',
      'User-Agent' : Titanium.App.getName()+" "+Titanium.App.getVersion() + " ",
      'X-Blip-Application' :  Titanium.App.getName()+" "+Titanium.App.getVersion() + " ",
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
    };
  },
  dashboardGet : function(offset) {
    var url = this.api_root+'/dashboard'+this.include_string_full;
    if(this.dashboard_last_id != 0) {
       url = this.api_root+'/dashboard/since/'+this.dashboard_last_id+this.include_string_full;
    }
    if(offset >= 0) {
      url += '&offset='+(offset * interfaces[this.service_id].globalLimit);
    }

    var req = new HttpConnector(this.commonHeaders());
    req.setUserCred(this.login, this.password);
    req.get(url);
    var self =this;
    req.onSuccess = function(status,response) {
      // handle blip.pl error after redirect - should be 503, but instead you get 302
      // and everything appears to be a-ok
      // while it is not...
      if (response.match(/^\[/) === null) {
       // this causes Titanium to crash...
     //   self.onFail(status, response);
      } else {
        var ob = Titanium.JSON.parse(response);
        if(ob.length >0) {
          self.dashboard_last_id= ob[0].id;
          self.dashboardProcess(ob,self.dashboard_last_id);
        }
      }
    };
    req.onFail = function(status, response) {
      interfaces[self.service_id].notify('Błąd', 'Błąd połączenia z API, próbujemy dalej...', 'fail');
      console.log("błąd! " + status + "\n" + response);
      if(status == 403 || status==401) self.loginFail();
    };
  },
  dashboardProcess :function(response_obj,is_update){

    interfaces[this.service_id].draw(response_obj, is_update);
  },
  afterSend :  function(response_obj, was_success){
    interfaces[this.service_id].afterSend(response_obj, was_success);
  },
  post : function(str) {

    var req = new HttpConnector(this.commonHeaders());
    req.setUserCred(this.login, this.password);

		req.post(this.api_root+'/updates','update[body]='+encodeURIComponent(str));
    var self = this;
    req.onSuccess = function(resp) { self.afterSend(resp, true); };
    req.onFail = function(resp) {
      interfaces[self.service_id].notify('Błąd', 'Błąd wysyłania... ' + resp, 'fail');

      var was_success = true;
      // these are real failures according to BLIPAPI
      // at this point - user's input should be kept in the
      // textarea - sending failed because of reasons like
      // server error or the recipient of the message doesn't exist
      if (resp == 501 || resp == 503 || resp == 500 || resp == 403 || resp == 401) {
        was_success = false;
      }
      self.afterSend(resp, was_success);
    };

  },
  postWithFile: function(str, file) {
    var res = blip_post_file(this.api_root+"/updates", this.login, this.password, str, file);
    var response = 201;
    if( !res) {
      response = 503;
    }
    this.afterSend(res, response);
  },
  getBlip : function(blipid) {

    var req = new HttpConnector(this.commonHeaders());
    req.setUserCred(this.login, this.password);
    req.get(this.api_root+'/updates/'+blipid+this.include_string_full);
    var self = this;
    req.onSuccess = function(st, resp) {
			try {
				var obj = Titanium.JSON.parse(resp);
				interfaces[self.service_id].injectQuotedBlip(blipid,obj);
			} catch(parse_Error) {
				 interfaces[self.service_id].notify("Błąd","Rozwijanie linka się nie powiodło", 'fail');
			}
    };
    req.onFail = function(st, resp) {
      console.log('getBlip: ' + st);
      interfaces[self.service_id].notify("Błąd","Rozwijanie linka się nie powiodło", 'fail');
    };

   },
  shortenLink : function(url) {
    var req = new HttpConnector(this.commonHeaders());
    req.setUserCred(this.login, this.password);
    req.post(this.api_root+'/shortlinks', 'shortlink[original_link]='+url);

    req.onSuccess = function(st, resp) {
			try {
      var obj = Titanium.JSON.parse(resp);
      interfaces[active_service].replaceLinks(url, obj.url);
			} catch (link_shorting_error) {
      interfaces[active_service].notify("Błąd","Tworzenie linka się nie powiodło", 'fail');
			}

    };
    req.onFail = function(st, resp) {
      interfaces[active_service].notify("Błąd","Tworzenie linka się nie powiodło", 'fail');
    };
  },
  expandLink : function(id) {
    id = id.replace(/\W/gi,'');
    var req = new HttpConnector(this.commonHeaders());
    req.setUserCred(this.login, this.password);
    req.get(this.api_root+'/shortlinks/'+id);
    req.onSuccess = function(st, resp) {
			try {
				var obj = Titanium.JSON.parse(resp);
				interfaces[active_service].expandShortenUrl(id,obj);
			} catch (expand_link_error) {
				console.log(st);
				interfaces[active_service].notify("Błąd","Rozwijanie linka się nie powiodło", 'fail');
			}

    };
    req.onFail = function(st, resp) {
      console.log(st);
      interfaces[active_service].notify("Błąd","Rozwijanie linka się nie powiodło", 'fail');
    };
  },
  getArchive : function(resource, offset) {
    var req = new HttpConnector(this.commonHeaders());
    req.setUserCred(this.login, this.password);
    var url = this.api_root;
    url = "http://api.blip.pl";
    switch(resource) {
      case 'pm':
        url += '/private_messages';
        break;
      case 'dm':
        url += '/directed_messages';
        break;
      case 'n':
        url += '/notices';
        break;
      default:
        url += '/dashboard';
        break;
    }
    url += this.include_string_full+"&limit=10";
    if (offset) {
      url += "&offset="+offset;
    }

    req.get(url);

    var self = this;
    req.onSuccess = function(st, resp) {
			try {
			  var obj = Titanium.JSON.parse(resp);
			  self.onArchiveComplete(obj);
			} catch (archive_get_error) {
			 	console.log('getArchive fail ' + resource);
			  console.log(st); console.log(resp);
			}

    };
    req.onFail = function(st, resp) {
      console.log('getArchive fail ' + resource);
      console.log(st); console.log(resp);
    };
  },
  onArchiveComplete : function(objects) {
    console.dir(objects);
  },
  getUserAvatar : function() {
      var req = new HttpConnector(this.commonHeaders());
      var self = this;
      req.get(this.api_root+"/users/"+this.login+"/avatar");
      req.onSuccess = function(st, resp) {
          try {
              var obj = Titanium.JSON.parse(resp);
              interfaces[active_service].setUserAvatar(obj, self.login);
          } catch (parse_Error) {
              console.dir(parse_Error);
          }
      };
      req.onFail = function(st, resp) {
          interfaces[active_service].notify("Problem", "buuuuu");
      };
  }

});
