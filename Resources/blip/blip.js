/**
 * BlipApi class, extends Service class
 * TODO make HttpConnector a class variable
 * FIXME all onSuccess and onFail callbacks should be defined outside of the class
 * definition
 */
var Blip = new Class.create(
  Service,
  {
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
    include_string_full : "?include=user,user[avatar],recipient,recipient[avatar],pictures",
    commonHeaders : function() {
      return {
        'X-blip-api' : '0.02',
        'Accept' : 'application/json',
        'User-Agent' : Application.ua_string(),
        'X-Blip-Application' :  Application.ua_string(),
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
      };
    },
    dashboardGet : function(offset) {
      var url = this.api_root+'/dashboard'+this.include_string_full;
      if(this.dashboard_last_id !== 0) {
        url = this.api_root+'/dashboard/since/'+this.dashboard_last_id+this.include_string_full;
      }
      if(offset >= 0) {
        url += '&offset='+(offset * interfaces[this.service_id].globalLimit);
      }

      var req = new HttpConnector(this.commonHeaders());
      req.setUserCred(this.login, this.password);
      req.get(url);
      function success(status,response) {
        // handle blip.pl error after redirect - should be 503, but instead you get 302
        // and everything appears to be a-ok
        // while it is not...
        if (response.match(/^\[/) === null) {
          // this causes Titanium to crash...
          console.log("nil");
        } else {
          var ob = Application.json_parse(response);
          if(ob.length >0) {
            this.dashboard_last_id= ob[0].id;
					  this.dashboardProcess(ob,services[active_service].dashboard_last_id);
          }
        }
      }
      function fail(status, response) {
        interfaces[active_service].notify('Błąd', 'Błąd połączenia z API, próbujemy dalej...', 'fail');
        console.log("błąd! " + status + "\n" + response);
        if(status == 403 || status==401) this.loginFail();
      }
      req.onSuccess = success.bind(this);
      req.onFail = fail.bind(this);
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
      function success (resp) { this.afterSend(resp, true); }

      function fail(resp) {
        interfaces[active_service].notify('Błąd', 'Błąd wysyłania... ' + resp, 'fail');
        var was_success = true;
        // these are real failures according to BLIPAPI
        // at this point - user's input should be kept in the
        // textarea - sending failed because of reasons like
        // server error or the recipient of the message doesn't exist
        if (resp == 501 || resp == 503 || resp == 500 || resp == 403 || resp == 401) {
          was_success = false;
        }
        this.afterSend(resp, was_success);
      }
      req.onSuccess = success.bind(this);
      req.onFail = fail.bind(this);
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
      function success(st, resp) {
			  try {
				  var obj = Application.json_parse(resp);
				  interfaces[active_service].injectQuotedBlip(blipid,obj);
			  } catch(parse_Error) {
				  interfaces[active_service].notify("Błąd","Rozwijanie linka się nie powiodło", 'fail');
			  }
      }

      function fail(st, resp) {
        console.log('getBlip: ' + st);
        interfaces[active_service].notify("Błąd","Rozwijanie linka się nie powiodło", 'fail');
      }
      req.onSuccess = success;
      req.onFail = fail;
    },
    shortenLink : function(url) {
      var req = new HttpConnector(this.commonHeaders());
      req.setUserCred(this.login, this.password);
      req.post(this.api_root+'/shortlinks', 'shortlink[original_link]='+url);

      req.onSuccess = function(st, resp) {
			  try {
          var obj = Application.json_parse(resp);
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
      function success(st, resp) {
			  try {
				  var obj = Application.json_parse(resp);
				  interfaces[active_service].expandShortenUrl(id,obj);
			  } catch (expand_link_error) {
				  console.log(st);
				  interfaces[active_service].notify("Błąd","Rozwijanie linka się nie powiodło", 'fail');
			  }

      }
      function fail(st, resp) {
        console.log(st);
        interfaces[active_service].notify("Błąd","Rozwijanie linka się nie powiodło", 'fail');
      }
      req.onSuccess = success;
      req.onFail = fail;
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
      url += this.include_string_full+"&limit=25";
      if (offset) {
        url += "&offset="+offset;
      }

      req.get(url);
      function success(st, resp) {
			  try {
			    var obj = Application.json_parse(resp);
			    this.onArchiveComplete(obj);
			  } catch (archive_get_error) {
			 	  console.log('getArchive fail ' + resource);
			    console.log(st); console.log(resp);
			  }

      }

      function fail(st, resp) {
        console.log('getArchive fail ' + resource);
        console.log(st); console.log(resp);
      }
      req.onSuccess = success.bind(this);
      req.onFail = fail;
    },
    onArchiveComplete : function(objects) {
      console.dir(objects);
    },
    getUserAvatar : function() {
      var req = new HttpConnector(this.commonHeaders());
      req.get(this.api_root+"/users/"+this.login+"/avatar");
      function success(st, resp) {
        try {
          var obj = Application.json_parse(resp);
          interfaces[active_service].setUserAvatar(obj, this.login);
        } catch (parse_Error) {
          console.dir(parse_Error);
        }
      }
      req.onSuccess = success.bind(this);
      req.onFail = function(st, resp) {
        interfaces[active_service].notify("Problem", "buuuuu");
      };
    }

  });
