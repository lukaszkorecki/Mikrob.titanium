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


	Element.observe('main_textarea','keydown',main_text_area_handler);
	Element.observe('wrapper', 'submit',function(event){
		if($(event.target).identify() == 'login_button') {
			login_in();
		}
		event.preventDefault();
	});

// TEH DISPACHA
	Element.observe('wrapper', 'click',
	function(event){
		dispatcher(event);
		event.preventDefault();
	});

});

// for dispatcher to work few conventions need to followed:
// element name can be what ever, like "blomp" or "blamp_user"
// the event handler *needs* to have a _handler suffix, so:
// for elemen/button "blomp_user" the event hadnler will be "blomp_user_handler"
// and it has to exist in global namespace
// if the link/button is containing an image (as a icon), the img elements
// id will be "blomp_user_img"
// that's it, the rest is magic
function dispatcher( event) {

	var element = $(event.target);
	// get the id of clicked element
	var id = element.identify();
	console.log("ID:::: " + id);
	// if the clicked element doesn't have an id
	// i.e. is an "anon" element, use the last class name
	// by convention it works as a id
	if(id.startsWith("anonymous_")) {
		id = element.className.strip().split(" ").last();
		console.log("anon id: " + id);
	}
	// if it's an image for the link, fix the id
	if(id.endsWith("_img") ) {
		id = id.replace("_img", "");
		event.up_target = event.target.up();

	} else {
		console.log("NOT FOUND");
	}

	console.log("FINAL ID: "+id);
	// now... DISPATCH! ;-)
	if(window[id+"_handler"] !== undefined) {
		window[id+"_handler"](event);
	}
}

// EVENT HANDLERS
function login_button_handler() {
	Application.getServices();
  if(Application.services.length === 0) {
    Application.openAddServiceWindow();

  } else {
		Application.refreshServices();
		Application.populateAccountSwitcher();
		active_service = 0;
		services[active_service].dashboardGet();
		interfaces[active_service].notify(Titanium.App.getName(),'Pobieram kokpit');

		var how_often = 30;
		if(services[active_service].type != 'twitter') {
			how_often = 15;
		}
		loop1 = new PeriodicalExecuter(run_loop1,how_often);
		function run_loop1() {
			$('throbber').toggle();
			services[active_service].dashboardGet();
		}
		// Clean up old stuff
		Titanium.App.Properties.setString('username',"");
		Titanium.App.Properties.setString('password',"");

		$('login_form').fade();
		$('throbber').toggle();
		$('sender').toggle();
	}
}

function main_text_area_handler(event) {
	var content = (event.up_target || event.target).getValue();
	if(event.keyCode == 13 && services[active_service].type != 'Flaker') {
		content.length = content.length-1;
		if( content.length <= interfaces[active_service].character_limit){

			$('throbber').toggle();
			$('sender').disable();
			services[active_service].post(content);
		} else {
			interfaces[active_service].notify("Błęd", "Treść za długa o "+(content.length - interfaces[active_service].character_limit)+" znaków");
		}
	}
	var len =content.length;
	if (len === 0) len="";
	$('charcount').update(len);
}

function new_status_submit_handler(event) {
	var target = event.up_target || event.target;
  if($F(target['content']).length <= interfaces[active_service].character_limit) {
    $('throbber').toggle();
    target.disable();
    var blyp = $F(target['content']);
    services[active_service].post(blyp);
  } else {
    var yy = $F(target['content']).length - interfaces[active_service].character_limit;
    interfaces[active_service].notify("Błęd", "Treść za długa o "+yy+" znaków");
	}
}

function mark_as_read_button_handler() {
	interfaces[active_service].setUnreadCount(" 0");
	$$('#dash'+active_service + ' .update').each(
		function(el, index) {
			if (el.hasClassName('unread')) {
				el.removeClassName('unread');
			}
			if (index>19) {
				el.descendants().invoke('stopObserving');
				el.stopObserving().remove();
			}
		});


}

function make_private_handler() {
	interfaces[active_service].setAreaContent('>',true);
	$('main_textarea').toggleClassName('priv_t');
}

function shorten_links_handler() {
	var content = $('main_textarea').getValue();
	interfaces[active_service].shortenLinksInString(content, services[active_service].shortenLink);
}

function archive_button_handler(event) {
	var target = $(event.up_target || event.target);
	if (archive_opened !== 0) {
		Application.closeArchiveWindow();

		target.update(new Element("img", {"src" : AppIcons.big.mail }));
		archive_opened = 0;
	} else {
		archive_opened = 1;
		target.update(new Element("img", {"src" : AppIcons.big.mail_receive }));

		Application.openArchiveWindow();
	}
}

function home_button_handler() {
	$('archive').hide();
	$('dash'+active_service).show();
	archive_opened = 0;
}

function change_service_handler() {
 var old = active_service;
 active_service = (event.up_target || event.target).value || 0 ;
 if(old != active_service) {
	 if(active_service == 'change') {
		 active_service = old;
		 Application.openAddServiceWindow();
	 } else {
		 Application.activateService(old, active_service);
	 }
 }
}



function quote_link_handler(event) {
	interfaces[active_service].setAreaContent($(event.up_target||event.target).getAttribute("data"), false);

}
function message_link_handler(event) {
	interfaces[active_service].setAreaContent($(event.up_target||event.target).getAttribute("data"), true);

}
