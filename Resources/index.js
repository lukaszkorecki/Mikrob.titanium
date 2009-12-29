function run_tests() {
	var win = Titanium.UI.getCurrentWindow();
	var w2 = win.createWindow('app://test.html');
	
	w2.setHeight(300);
	w2.setWidth(200);
	w2.setResizable(true);
	w2.open();

}
// globalz
var interfaces = new Array();
// TODO this should come from the DB
var services = new Array();
var username,loop1,active_service =0;
document.observe('dom:loaded',function(){
	$('sender').toggle();
	$('throbber').toggle();

	Element.observe('login_form','submit',function(event){
		Application.get_services();
		if(Application.services.length === 0) {
			alert("nie masz kont! dodaj jakieś!");
			Application.open_add_service_window();
		
		} else {
			active_service = 0;
			for (var i = 0; i < Application.services.length; i++) {
				var obj = Application.return_service_objects(Application.services[i], i);
				interfaces.push ( obj.interFace);
				services.push ( obj.service);
			}
			services[active_service].dashboardGet();
			interfaces[active_service].notify(Titanium.App.getName(),'Pobieram kokpit');


			loop1 = new PeriodicalExecuter(run_loop1,20);
			function run_loop1() {
				$('throbber').toggle();
				services[active_service].dashboardGet();
			}

			Application.populate_account_switcher();

			// Clean up old stuff
			Titanium.App.Properties.setString('username',"");
			Titanium.App.Properties.setString('password',"");

			this.fade();
			$('throbber').toggle();
			$('sender').toggle();
		}
		event.preventDefault();
	});
	Element.observe('sender','submit',function(event){
		event.preventDefault();
		if($F(this['content']).length <= 160) {
			$('throbber').toggle();
			this.disable();
			var blyp = $F(this['content']);
			services[active_service].createBlip(blyp);
		} else {
			yy = $F(this['content']).length - 160;
			interfaces[active_service].notify("Błęd", "Treść za długa o "+yy+" znaków");
		}
	});
	Element.observe('main_textarea','keydown',function(event){
		var content = this.getValue();
		if(event.keyCode == 13) {
			if( content.length <= 160){
				event.preventDefault();
				$('throbber').toggle();
				$('sender').disable();
				services[active_service].createBlip(content);
			} else {
				interfaces[active_service].notify("Błęd", "Treść za długa o "+(content.length - 160)+" znaków");
			}
		}
		$('charcount').update(content.length);
	});
	Element.observe('mark_as_read_button','click',function(event){
		event.preventDefault();
		var unread = $$('dash'+active_service +' .unread');

		for(var i=19, l = unread.length;i<l;i++) {
			unread[i].remove();
		}
		unread.each(function(el) { el.removeClassName('unread'); } );
		interfaces[active_service].setUnreadCount('0');
	});
	Element.observe('make_private','click',function(event){
		interfaces[active_service].setAreaContent('>',true);
		$('main_textarea').toggleClassName('priv_t');
	});
	Element.observe('shorten_links','click',function(event){
		event.preventDefault();
		var content = $('main_textarea').getValue();
		console.log("tresc z element.observe.click\n\t"+content);
		interfaces[active_service].shortenLinksInString(content, services[active_service].shortenLink);

	});
	// Pagination
//	Element.observe('home_link','click',function(event) {
//		services[active_service].dashboard_last_id=0;
//		services[active_service].dashboardProcess = interfaces[active_service].draw;
//		services[active_service].dashboardGet();
//		event.preventDefault();
//		$('current_page').update();
//		loop1 = new PeriodicalExecuter(run_loop1,10);
//		function run_loop1() {
//			$('throbber').toggle();
//			services[active_service].dashboardGet();
//		}
//	});
//	Element.observe('next_page','click',function(event) {
//		loop1.stop();
//		event.preventDefault();
//		services[active_service].dashboardProcess = interfaces[active_service].drawPage;
//		services[active_service].dashboard_last_id=0;
//		services[active_service].current_page = services[active_service].current_page + 1;
//		var p =services[active_service].current_page;
//		console.log(p);
//		console.log(services[active_service].current_page);
//		services[active_service].dashboardGet(p);
//		$('current_page').update("Strona: "+p);
//		console.log(services[active_service].current_page);
//	});
//	Element.observe('previous_page','click',function(event) {
//		loop1.stop();
//		event.preventDefault();
//		services[active_service].dashboardProcess = interfaces[active_service].drawPage;
//		services[active_service].dashboard_last_id=0;
//		services[active_service].current_page = services[active_service].current_page - 1;
//		var p =services[active_service].current_page;
//		console.log(p);
//		console.log(services[active_service].current_page);
//		$('current_page').update("Strona: "+p);
//		services[active_service].dashboardGet(p);
//		console.log(services[active_service].current_page);
//	});
	Element.observe('change_service', 'change', function(event){
			console.dir(event);
			var old = active_service;
		active_service = event.target.value || 0 ;
		Application.activate_service(old, activate_service);

	});
});
