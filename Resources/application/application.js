/* here b sth, dunno wat */
var Application = (
  function() {
    db = "";

    window_resized = false;
    services = [];
    attachment="";
    function getServices() {
      var services = {
        // minified for clarity ;-)
        'id':{field_type:'id'},'login':{field_type:'text',not_null:true},'password':{field_type:'text',not_null:true},'type':{field_type:'text',not_null:true},'api_url':{field_type:'text'}};
      this.db = new DatabaseConnector('mikrob', 'services', services);
      var serv = this.db.find() || [];
      this.services = serv;
      if(this.services.length > 0) {
        this.buildServices();
        return true;
      } else {
        return false;
      }
    }
    function buildServices() {
      var serv = [];
      for (var i = 0, len =this.services.length; i < len ; i++) {
        serv.push(this.services[i].row);
      }
      this.services = serv;
    }
    function refreshServices() {
      for(var i=0, len = this.services.length;i<len;i++) {
        var obj = this.returnServiceObjects(this.services[i], i);
        interfaces.push(obj.interFace);
        services.push (obj.service);
      }
    }
    function saveService(login, password, type, api_url) {
      var a_u = api_url || "";
      var new_serv = { fields : {
                         'login' : login,
                         'password' : password,
                         'type' : type,
                         'api_url' : api_url
                       }};
      this.db.save(new_serv);

    }
    function openAddServiceWindow() {
      var win = Titanium.UI.getCurrentWindow();
      var w2 = win.createWindow('app://add_service.html');

      w2.setToolWindow(true);
      w2.setResizable(true);
      w2.setHeight(550);
      w2.setWidth(400);
      w2.open();
    }

    function openArchiveWindow() {
      var updates = new Array();
      var counter = 0;
      if (services[active_service].type == 'Blip') {
        services[active_service].onArchiveComplete = function(resp) {
          var up =  updates.concat(resp);
          updates = up;
          counter++;
          render_updates(updates);
          if(counter > 1) {
            $('dash'+active_service).fade();
            $('archive').appear();
          }
        };
        services[active_service].getArchive('pm');
        services[active_service].getArchive('dm');
        services[active_service].getArchive('n');
        function render_updates(updates) {

          $('archive').update();
          updates.sort(function(a,b){
                         if(a.id > b.id) return -1;
                         if(a.id < b.id) return 1;
                         if(a.id == b.id) return 0;
                         return 0;
                       });
          updates.each(function(status) {
                         var element = interfaces[active_service].getUpdateObject(status);
                         $('archive').insert(element);
                       });
        }
      } else {
        interfaces[active_service].notify('Fail', "Wiadomości są tylko dostępne tylko dla Blipa", 'fail');
      }
    }
    function closeArchiveWindow() {
      $('archive').update();
      $('archive').fade();
      $('dash'+active_service).appear();
    }
    function returnServiceObjects(service_row, index) {
      var obj = {
        'interFace' : null,
        service : null
      };
      switch(service_row.type) {
      case 'blip':
        obj.service = new Blip(service_row.login, service_row.password, index, service_row.api_url);
        obj.interFace = new BlipInterface('dash'+index, index);
        break;
      case 'twitter':
        obj.service = new Twitter(service_row.login, service_row.password, index);
        obj.interFace = new TwitterInterface('dash'+index,index);
        break;
      case 'flaker':
        obj.service = new Flaker(service_row.login, service_row.password, index);
        obj.interFace = new FlakerInterface('dash'+index,index);
        break;
      case 'custom_twitter':
        obj.service = new Twitter(service_row.login, service_row.password, index , service_row.api_url );
        obj.interFace = new TwitterInterface('dash'+index,index);
        break;

      default:
        // code
        break;
      }
      return obj;
    }
    function populateAccountSwitcher() {
      var account_switcher = $('change_service');
      account_switcher.update();
      this.getServices();
      for(var i=0, len = this.services.length;i<len;i++) {

        var elem = new Element('option', {value : i}).update(this.services[i].login.capitalize() + " ("+this.services[i].type.capitalize()+")");
        account_switcher.insert(elem);
      }
      var el = new Element('option', {value : 'change'}).update("Edytuj/Dodaj");
      account_switcher.insert(el);
    }
    function activateService(old_service_id, new_service_id) {
      var w = Titanium.UI.getCurrentWindow();
      var title_string = Titanium.App.getName() + " : " + this.services[new_service_id].login.capitalize() + " ("+this.services[new_service_id].type.capitalize()+")";
      w.setTitle(title_string);
      $('dash'+old_service_id).fade();
      $('dash'+new_service_id).appear();
    }
    function saveWindowSettings() {
      var win = Titanium.UI.getCurrentWindow();
      var bounds = win.getBounds();
      Titanium.App.Properties.setInt("width", bounds.width);
      Titanium.App.Properties.setInt("height", bounds.height);
      Titanium.App.Properties.setInt("x", bounds.x);
      Titanium.App.Properties.setInt("y", bounds.y);

    }
    function loadWindowSettings() {
	    if(this.window_resized === false) {
	      var win = Titanium.UI.getCurrentWindow();
	      var bounds = win.getBounds();
	      try {
		      bounds.width = Titanium.App.Properties.getInt("width");
		      bounds.height = Titanium.App.Properties.getInt("height");
		      bounds.x = Titanium.App.Properties.getInt("x");
		      bounds.y = Titanium.App.Properties.getInt("y");
	      } catch (get_props) {
				  console.log('unable to get props');
	      }
	      win.setBounds(bounds);
	    }
      this.window_resized = true;
    }
    function openImageWindow(image_url) {
      Titanium.API.set('image_url', image_url);
      var win = Titanium.UI.getCurrentWindow();
      var w2 = win.createWindow('app://image.html');
      w2.setResizable(true);
      w2.setHeight(150);
      w2.setWidth(150);
      w2.open();
    }
    function openSenderWindow() {
      var input_area = $("input_area");
      if(input_area.visible()) {
        input_area.fade();
      } else {
        input_area.show();
      }


    }
    function openUrl(url){
			Titanium.Desktop.openURL(url);
    }
    function cache_start() {
      cache.setup();

    }
    function cache_io(url, type) {
      var file = url.split("/").last();
      var cached = cache.check(type,file);
      if(cached) {
        return cached;
      } else {
        return cache.store(url, type,file);
      }
    }

    return {
      getServices :getServices,
      buildServices :buildServices,
      refreshServices :refreshServices,
      saveService :saveService,
      openAddServiceWindow :openAddServiceWindow,
      openArchiveWindow :openArchiveWindow,
      closeArchiveWindow :closeArchiveWindow,
      returnServiceObjects :returnServiceObjects,
	    populateAccountSwitcher :populateAccountSwitcher,
	    activateService :activateService,
	    saveWindowSettings :saveWindowSettings,
	    loadWindowSettings :loadWindowSettings,
	    openImageWindow :openImageWindow,
      openSenderWindow : openSenderWindow,
      openUrl: openUrl,
      cache_start : cache_start,
      cache_io : cache_io
    };
  } )();

var AppIcons = {
	"small" : {
		comment : "app://icons/ui/16_thread.png",
		quote : "app://icons/ui/16_retweet.png",
		message : "app://icons/ui/16_message.png",
		permalink : "app://icons/ui/16_permalink.png",
		refresh : "app://icons/ui/16_retweet.png",
		lock: "app://icons/ui/16_private.png"
	},
	"medium" : {
		"new" : "app://icons/ui/24_new.png"
	},
	"big" : {
		attachment : "app://icons/ui/48_attachment.png",
		email : "app://icons/ui/48_email.png",
		favorite : "app://icons/ui/48_favorite.png",
		mail_receive : "app://icons/ui/48_mail_receive.png",
		mail : "app://icons/ui/48_mail.png",
		promotion_new : "app://icons/ui/48_promotion_new.png",
		search : "app://icons/ui/48_search.png",
		tools : "app://icons/ui/48_tools.png"
	}
};