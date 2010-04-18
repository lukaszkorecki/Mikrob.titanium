var Preferences = (
  function(){
    var db = {};
    var schema = {
      id : { field_type : 'id'},
      prefernce_name : {field_type : "text", not_null : true},
      prefernce_value : {field_type : "text", not_null  : true}

    };
    var Bool = ["notifications", "badge"];

    var container = [];
    function getPreferences() {
      console.log("getPreferences");
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
      getPreferences();

    }
    function set(name, val, type) {
      var t = type || "Bool";
      console.log(name + val + type);
      Titanium.App.Properties["set"+t](name, val);
    }
    function get(name, type) {

      console.log(name + type);
      var t = type || "Bool";
      return Titanium.App.Properties["get"+t](name);
    }
    return {
      get : get,
      set  : set,
      container : container,
      Bool : Bool
    };

  })();


document.observe(
  "preferences:interface_loaded",
  function() {
    console.log("opened preferences win");
    // bool values
    Preferences.Bool.each(function(el){
                            $(el).down("input").setValue(Preferences.get(el)).observe(
                              "change",
                              function() {
                                console.dir("changing "+this.name + " val: "+this.getValue());
                                var val = !!(this.getValue());

                                Preferences.set(this.name, val);
                              });
                          });
  }
);
document.observe(
  "dom:loaded",function(){
    Preferences.Bool.each(function(el){
                            try {
                              Preferences.get(el);
                            } catch(err) {
                              // who cares?
                            }
                          }
                         );
  }
);
