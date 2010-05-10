
Titanium.addEventListener(Titanium.CLOSE, function(event){
                          Application.saveWindowSettings();
                        });
var open_event_id=0;
// globalz
var interfaces = new Array();
// TODO this should come from the DB
var services = new Array();
var username,loop1,active_service,archive_opened =0;
window.addEventListener("load",function() {
    Application.loadWindowSettings();
});
document.observe(
  'dom:loaded',
  function(){
    Application.cache_start();
    $('input_area').toggle(); // <- this needs to be a function
    $('menubar').toggle();


    // TEH DISPACHA

    // for Dispatcher to work few conventions need to followed:
    // element name can be what ever, like "blomp" or "blamp_user"
    // for elemen/button "blomp_user" the event hadnler will be "Events.blomp_user"
    // if the link/button is containing an image (as a icon), the img elements
    // id will be "blomp_user_img"
    // that's it, the rest is magic

    //
	  document.body.observe('click',Dispatcher);
	  document.getElementById('wrapper').addEventListener('submit',Dispatcher);
	  document.getElementById('main_textarea').addEventListener('keydown',Dispatcher);

    document.body.addEventListener(
      'keydown',
      function(event){
        switch(event.keyCode) {
        case 38: //up
        case 40: // down
          KeyboardEvents.navigate_over_updates(event);
          break;
        case 79: // o
          KeyboardEvents.expand_quoted(event);
          break;
        case 82: // r
          KeyboardEvents.reply_to(event);
          break;
        case 49: // 1
          KeyboardEvents.open_dashboard(event);
          break;
        case 50: // 2
          KeyboardEvents.open_messages(event);
          break;
        case 75: // k
          KeyboardEvents.mark_all_as_read(event);
          break;
        case 80: //p
          KeyboardEvents.make_private(event);
          break;
        case 188: //,
          KeyboardEvents.open_preferences(event);
          break;
//          case 51: // 3 (search)
//          case 52: // 4 (profile?)

        default:
          return true;
          break;
        }
        return true;
      });

    document.getElementById("additional_actions").addEventListener("change", function(ev){
      var el  = new Element("button", { id : ev.target.value });
      Dispatcher(el.fire("click"));
      this.value = 0;
      el = null;
    });
  });

// delgate actions select to main dispatcher

function Dispatcher(event){
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
  if(event.type == "keydown") {
    return true;
  } else {
	  event.preventDefault();
    return false;
  }

}
