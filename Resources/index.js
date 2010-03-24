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
document.observe('dom:loaded',function(){
                   Application.loadWindowSettings();
                   Application.cache_start();
                   try {
                     $('sidebar').toggle(); // <- this needs to be a function
                     $('throbber').toggle(); // <- this needs to be a function
                     $('input_area').toggle(); // <- this needs to be a function
                   } catch(orr) {
                     // orr
                   }



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

} catch(err) {
  // ignore
}


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