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
// Window settings (position, size)
//Titanium.API.addEventListener(Titanium.EXIT,function() {
//  Application.saveWindowSettings();
//});
//open_event_id =Titanium.API.addEventListener(Titanium.OPEN,function(event) {
//  Application.loadWindowSettings();
// 	Titanium.API.removeEventListener(Titanium.OPEN);
//});
//Titanium.API.addEventListener(Titanium.CLOSE,function() {
//  Application.populateAccountSwitcher();
//  Application.refreshServices();
//});
// globalz
var interfaces = new Array();
// TODO this should come from the DB
var services = new Array();
var username,loop1,active_service,archive_opened =0;
document.observe('dom:loaded',function(){
  Application.loadWindowSettings();
  $('sender').toggle();
  $('throbber').toggle();


 // Element.observe('change_service', 'change', function(event){
 //   var old = active_service;
 //   active_service = event.target.value || 0 ;
 //   if(old != active_service) {
 //     if(active_service == 'change') {
 //       active_service = old;
 //       Application.openAddServiceWindow();
 //     } else {
 //       Application.activateService(old, active_service);
 //     }
 //   }
 //
 // });



	Element.observe('main_textarea','keydown',main_text_area_handler);
	Element.observe('wrapper', 'submit',function(event){

		console.dir(event);
		console.dir(event.target);
		console.log($(event.target).identify());
		if($(event.target).identify() == 'login_button') {
			login_in();
		}
	event.preventDefault();
	});
	Element.observe('wrapper', 'click',
	function(event){
		var element = $(event.target);
		console.dir(event);


		switch(		element.identify()) {
		case 'login_button':
			console.log('>>login_button');
			login_in(event.target.up());
			break;
		case 'mark_as_read_button':
			console.log('>>mark_as_read_button');
			main_text_area_handler();
			break;
		case 'make_private':
			console.log('>>make_private');
			make_private_handler();
			break;
		case 'shorten_links':
			console.log('>>shorten_links');
			shorten_links_handler();
			break;
		case 'unread_count':
			console.log('>>unread_count');
			clear_unread();
			break;
		case 'change_service':
			change_service_handler();
			break;
		default:
//			console.dir(event.target.up());
			console.log(element.identify());
			console.dir(element.parentElement);
			break;
		}

		event.preventDefault();
	});


	});

function login_in(target) {
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
	var content = event.target.getValue();
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

function new_status_submit_handler(target) {
  if($F(target['content']).length <= interfaces[active_service].character_limit) {
    $('throbber').toggle();
    target.disable();
    var blyp = $F(targeet['content']);
    services[active_service].post(blyp);
  } else {
    yy = $F(target['content']).length - interfaces[active_service].character_limit;
    interfaces[active_service].notify("Błęd", "Treść za długa o "+yy+" znaków");
	}
}

function clear_unread(target) {
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

function archive_button_hadnler(target) {
	if (archive_opened !== 0) {
		Application.closeArchiveWindow();

		this.update(new Element("img", {"src" : AppIcons.big.mail }));
		archive_opened = 0;
	} else {
		archive_opened = 1;
		this.update(new Element("img", {"src" : AppIcons.big.mail_receive }));

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
 active_service = event.target.value || 0 ;
 if(old != active_service) {
	 if(active_service == 'change') {
		 active_service = old;
		 Application.openAddServiceWindow();
	 } else {
		 Application.activateService(old, active_service);
	 }
 }
}