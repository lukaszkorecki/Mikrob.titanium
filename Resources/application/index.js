function run_tests() {
  var win = Titanium.UI.getCurrentWindow();
  var w2 = win.createWindow('app://test.html');

  w2.setHeight(20);
  w2.setWidth(20);
  w2.setResizable(false);
  w2.open();

}


var open_event_id=0;
// globalz
var interfaces = new Array();
// TODO this should come from the DB
var services = new Array();
var username,loop1,active_service,archive_opened =0;
document.observe(
  'dom:loaded',
  function(){
    Application.loadWindowSettings();
    Application.cache_start();
      $('input_area').toggle(); // <- this needs to be a function
      $('menubar').toggle();


    // TEH DISPACHA

    // for dispatcher to work few conventions need to followed:
    // element name can be what ever, like "blomp" or "blamp_user"
    // for elemen/button "blomp_user" the event hadnler will be "Events.blomp_user"
    // if the link/button is containing an image (as a icon), the img elements
    // id will be "blomp_user_img"
    // that's it, the rest is magic

    //
    try {
	    document.getElementById('wrapper').addEventListener('click',dispatcher);
    } catch(err) {
      // ignore
    }
    try {
	    document.getElementById('wrapper').addEventListener('submit',dispatcher);

    } catch(err) {
      // ignore
    }
    try {
	    document.getElementById('main_textarea').addEventListener('keyup',dispatcher);
      document.getElementById('main_textarea').addEventListener('focus', function(event) {
                                                                  console.log("Focusing the area");
                                                                  console.dir(event);
                                                                  this.setAttribute("focued", true);
                                                                });
      document.getElementById('main_textarea').addEventListener('blur', function(event) {
                                                                  console.log("unFocusing the area");
                                                                  console.dir(event);
                                                                  this.setAttribute("focued", false);
                                                                });
    } catch(err) {
      // ignore
    }

      document.addEventListener(
        'keydown',
        function(event){
//          console.log(event.keyCode);
//          console.log(interfaces[active_service].active_entry);
          var collection = $$('.update');

          // UP
          if(event.keyCode == 38 && (interfaces[active_service].active_entry-1 >= 0)) {
            console.log("[38] Wcisnalem up, czas zwiekszyc");
            interfaces[active_service].active_entry--;
          }
          // DOWN
          if(event.keyCode == 40 && interfaces[active_service].active_entry < (collection.length-1)) {
            console.log("[40] Wcisnalem down, czas zmniejszy");

            interfaces[active_service].active_entry++;
          }

          $$('.active_entry').each(function(elem){ elem.removeClassName("active_entry"); });
          collection[interfaces[active_service].active_entry].scrollIntoViewIfNeeded();
          collection[interfaces[active_service].active_entry].addClassName("active_entry");


        });
  });

function dispatcher(event){
	var element = $(event.target);
	// get the id of clicked element
	var id = element.identify();
	// if the clicked element doesn't have an id
	// i.e. is an "anon" element, use the last class name
	// by convention it works as a id
	if(id.startsWith("anonymous_")) {
		id = element.className.strip().split(" ").last();
	}
	// if it's an image for the link, fix the id
	if(id.endsWith("_img") ) {
		id = id.replace("_img", "");
		event.target_up = event.target.up();
	}
	// now... DISPATCH! ;-)
	if(Events[id] !== undefined) {
		Events[id](event);
	} else {
		console.log("No such function: Events." + (id || "missing id"));
	}
	event.preventDefault();
  return false;
};