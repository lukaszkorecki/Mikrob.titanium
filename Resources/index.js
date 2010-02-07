function run_tests() {
  var win = Titanium.UI.getCurrentWindow();
  var w2 = win.createWindow('app://test.html');

  w2.setHeight(20);
  w2.setWidth(20);
  w2.setResizable(false);
  w2.open();

}

GLOBAL_EVENT = [];
var open_event_id=0;
// globalz
var interfaces = new Array();
// TODO this should come from the DB
var services = new Array();
var username,loop1,active_service,archive_opened =0;
document.observe('dom:loaded',function(){
  Application.loadWindowSettings();
  $('sender').toggle();
  $('throbber').toggle();


	Element.observe('main_textarea','keydown',Events.main_text_area);
	Element.observe('wrapper', 'submit',function(event){
    console.log('heeee');
      var id = $(event.target).identify();
			Events[id]();
		event.preventDefault();
	});

// TEH DISPACHA

// for dispatcher to work few conventions need to followed:
// element name can be what ever, like "blomp" or "blamp_user"
// for elemen/button "blomp_user" the event hadnler will be "Events.blomp_user"
// if the link/button is containing an image (as a icon), the img elements
// id will be "blomp_user_img"
// that's it, the rest is magic
	document.getElementById('wrapper').addEventListener('click',dispatcher);


});

function dispatcher(event){
	event.preventDefault();
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
	console.log("Should dispatch: Events."+ id );
	// now... DISPATCH! ;-)
	if(Events[id] !== undefined) {
		Events[id](event);
	} else {
		console.log("No such function: " + id+"_handler");
    return false;
	}

  return false;
};