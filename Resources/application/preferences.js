var Preferences = (
  function(){
    var db = {};
    var schema = {
      id : { field_type : 'id'},
      prefernce_name : {field_type : "text", not_null : true},
      prefernce_value : {field_type : "text", not_null  : true}

    };
    var container = [];
    function getPreferences() {

      this.db = new DatabaseConnector("mikrob", "preferences", schema);
      var set = (this.db.find() || []);
      if(set.length == 0) {
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
      return this.getPreferences();

    }
    return {
      get : getPreferences,
      set  : setPreference,
      container : container
    };

  })();


document.observe(
  "dom:loaded",
  function(){
    if(! Preferences.getPreferences()) {
      // defaults
      Preferences.setPreference("notifications", "true");
      Preferences.setPreference("badge", "true");
      Preferences.getPreferences();
    } else {
      console.dir(Preferences.container);
    }
  }
);
document.observe(
  "preferences:interface_loaded",
  function(){
    console.log("opened preferences win");
  }
);
