var Preferences = (
  function(){
    var db = {};
    var schema = {
      id : { field_type : 'id'},
      prefernce_name : {field_type : "text", not_null : true},
      prefernce_value : {field_type : "text", not_null  : true}

    }
      var container = [];
    function getPreferences() {

      this.db = new DatabaseConnector("mikrob", "preferences", schema);
      var set = (this.db.find() || []);
      if(set.length == 0) {
        return false;
      } else {
        set.each(function(pref){
                   container.push(pref.row);
                 });
        return true
      }

    }
    function setPreference(name, value) {
      var set = {
        "fields" : {
          prefernce_name  : name,
          prefernce_value : value
        }
      }
      db.save(set);
    }
    return {
      getPreferences : getPreferences,
      setPreference : setPreference
      container : container
    }

  })();


document.observe("dom:loaded", function(){
                   var has_prefs = Preferences.getPreferences();
                   if(! has_prefs) {
                     // defaults
                     Preferences.setPreference("notifications", "true");
                     Preferences.setPreference("badge", "true");
                   } else {
                     console.dir(Preferences.container);
                   }
                 });