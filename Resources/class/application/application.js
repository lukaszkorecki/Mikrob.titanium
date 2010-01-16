/* here b sth, dunno wat */
var Application = {
  db : "",
  services : [],
  getServices : function() {
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
  },
  buildServices : function() {
    var serv = [];
    for (var i = 0; i < this.services.length; i++) {

      serv.push(this.services[i].row);
    }
    this.services = serv;
  },
  refreshServices : function() {
    for(var i=0;i<this.services.length;i++) {
      var obj = this.returnServiceObjects(this.services[i], i);
      interfaces.push(obj.interFace);
      services.push (obj.service);
    }
  },
  saveService : function(login, password, type, api_url) {
    var a_u = api_url || "";
    var new_serv = { fields : {
      'login' : login,
      'password' : password,
      'type' : type,
      'api_url' : api_url
     }};
    console.dir(new_serv);
    this.db.save(new_serv);

  },
  openAddServiceWindow : function() {
    var win = Titanium.UI.getCurrentWindow();
    var w2 = win.createWindow('app://add_service.html');
    
    w2.setToolWindow(true);
    w2.setResizable(false);
    w2.setHeight(550);
    w2.setWidth(400);
    w2.open();
  },
  openArchiveWindow : function() {
    var updates = new Array();
    var counter = 0;
    if (services[active_service].api_root.match(/blip/gi) !==null) {
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
        });
        updates.each(function(status) {
            var element = interfaces[active_service].getUpdateObject(status);
            $('archive').insert(element);
        });
      }
    } else {
      interfaces[active_service].notify('Fail', "Archiwum jest póki co tylko dostępne dla kont w usłudze Blip.pl", 'fail');
    }
  },
  closeArchiveWindow : function() {
    $('archive').update();
    $('archive').fade();
    $('dash'+active_service).appear();
  },
  returnServiceObjects : function(service_row, index) {
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
      case 'custom_twitter':
        obj.service = new Twitter(service_row.login, service_row.password, index , service_row.api_url );
        obj.interFace = new TwitterInterface('dash'+index,index);
        break;
      
      default:
        // code
        break;
    }
    return obj;
  },
  populateAccountSwitcher : function() {
    var account_switcher = $('change_service');
    account_switcher.update();
    this.getServices();
    for(var i=0, len = this.services.length;i<len;i++) {

      var elem = new Element('option', {value : i}).update(this.services[i].login.capitalize() + " ("+this.services[i].type.capitalize()+")");
      account_switcher.insert(elem);
    }
    var el = new Element('option', {value : 'change'}).update("Edytuj/Dodaj");
    account_switcher.insert(el);
  },
  activateService : function(old_service_id, new_service_id) {
    var w = Titanium.UI.getCurrentWindow();
    var title_string = Titanium.App.getName() + " : " + this.services[new_service_id].login.capitalize() + " ("+this.services[new_service_id].type.capitalize()+")";
    w.setTitle(title_string);
    $('dash'+old_service_id).fade();
    $('dash'+new_service_id).appear();
  },
  saveWindowSettings : function() {
    var win = Titanium.UI.getCurrentWindow();
    var bounds = win.getBounds();
    console.dir(bounds);
    Titanium.App.Properties.setInt("width", bounds.width);
    Titanium.App.Properties.setInt("height", bounds.height);
    Titanium.App.Properties.setInt("x", bounds.x);
    Titanium.App.Properties.setInt("y", bounds.y);

  },
  loadWindowSettings : function() {
          
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
};
