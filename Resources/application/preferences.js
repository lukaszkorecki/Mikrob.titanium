var Tray = window.opener ? window.opener.Tray : Tray;
var Preferences = (
  function(){
    var db = {};
    var schema = {
      id : { field_type : 'id'},
      prefernce_name : {field_type : "text", not_null : true},
      prefernce_value : {field_type : "text", not_null  : true}

    };
    var action_list = {
      "tray" : {
        "on" : function() { Tray.add(); },
        "off" : function() {Tray.remove(); }
      }
    };
    var Bool = ["notifications", "badge", "tray"];

    var Proxy = ["proxy_host"];
    var container = [];
    function getPreferences() {
      this.db = new DatabaseConnector("mikrob", "preferences", schema);
      var set = (this.db.find() || []);
      if(set.length === 0) {
        return false;
      } else {
        set.each(function(pref){
                   container[pref.row.prefernce_name] = pref.row.prefernce_value;
                 });
        return true;
      }

    }
    function setPreference(name, value) {
      var set = {
        "fields" : {
          prefernce_name  : name,
          prefernce_value : value
        }
      };

      this.db.save(set);
      getPreferences();

    }
    function set(name, val, type) {
      var t = type || "Bool";
      Titanium.App.Properties["set"+t](name, val);
    }
    function get(name, type) {
      var t = type || "Bool";
      var res = false;
      try {
        res = Titanium.App.Properties["get"+t](name);
      }
      catch(err) {
        res = false;
        if(res === false && t==="String") {
          res = "";
        }
      }
      return res;
    }
    function use(name,type) {
      var t = type || "Bool";
      if(this.action_list[name]) {
        if(this.get(name, t)){
          this.action_list[name].on();
        } else {
          this.action_list[name].off();
        }

      }
    }
    return {
      get : get,
      set  : set,
      Bool : Bool,
      Proxy : Proxy,
      action_list : action_list,
      use : use
    };

  })();


document.observe(
  "preferences:interface_loaded",
  function() {
    // bool values
      Preferences.Bool.each(function(el){
        $(el).down("input").setValue(Preferences.get(el)).observe(
          "change",
          function() {
            var val = !!(this.getValue());

            Preferences.set(this.name, val);
            Preferences.use(this.name);
          });
      });
      try {
      Preferences.Proxy.each(function(el){
        $(el).down("input").setValue(Preferences.get(el, "String")).observe(
          "change",
          function() {
            var val = this.getValue();
            Preferences.set(this.name, val, "String");
            Preferences.use(this.name);
          });
      });
      } catch(e) {
        console.dir(e);
      }
      window.opener.services.each(function(el){
        $("services").down(".list").insert(el);
      });
  });
document.observe(
  "dom:loaded",function(){
    var p = [].concat(Preferences.Proxy, Preferences.Bool);
    p.each(function(el){
      try {
        var x = Preferences.get(el);
        Preferences.use(el);
      } catch(err) {
        // who cares?
      }
    });
});


