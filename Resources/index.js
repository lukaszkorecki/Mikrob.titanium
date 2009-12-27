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
var username,loop1 ="";
document.observe('dom:loaded',function(){
		//Titanium.userAgent = Titanium.App.getName() +  " " + Titanium.App.getVersion();
	try {
		// TODO this should be somewhere else
		// and use the local storage instead of properties
		var saved_u = Titanium.App.Properties.getString("username");
		var saved_p = Titanium.App.Properties.getString("password");
		$$('input[name="username"]').first().setValue(saved_u);
		$$('input[name="pass"]').first().setValue(saved_p);
	}
	catch(er) {
		console.dir(er);
	}
	interfaces.push(  new BlipInterface('dash0', 0));
	$('sender').toggle();
	$('throbber').toggle();

	Element.observe('login_form','submit',function(event){
		username = $F(this['username']);
		var pass = $F(this['pass']);
		services.push( new Blip(username, pass, 0));

	//	services[0].dashboardProcess = interfaces[0].draw;
	//	services[0].afterSend = interfaces[0].afterSend;
		services[0].dashboardGet();
		interfaces[0].notify(Titanium.App.getName(),'Pobieram kokpit');


		loop1 = new PeriodicalExecuter(run_loop1,10);
		function run_loop1() {
			$('throbber').toggle();
			services[0].dashboardGet();
		}


		// TODO this should be somewhere else
		// and use the local storage instead of properties
		Titanium.App.Properties.setString('username',username);
		Titanium.App.Properties.setString('password',pass);

		this.fade();
		$('throbber').toggle();
		$('sender').toggle();
		event.preventDefault();
	});
	Element.observe('sender','submit',function(event){
		event.preventDefault();
		if($F(this['content']).length <= 160) {
			$('throbber').toggle();
			this.disable();
			var blyp = $F(this['content']);
			services[0].createBlip(blyp);
		} else {
			yy = $F(this['content']).length - 160;
			interfaces[0].notify("Błęd", "Treść za długa o "+yy+" znaków");
		}
	});
	Element.observe('main_textarea','keydown',function(event){
		var content = this.getValue();
		if(event.keyCode == 13) {
			if( content.length <= 160){
				event.preventDefault();
				$('throbber').toggle();
				$('sender').disable();
				services[0].createBlip(content);
			} else {
				interfaces[0].notify("Błęd", "Treść za długa o "+(content.length - 160)+" znaków");
			}
		}
		$('charcount').update(content.length);
	});
	Element.observe('mark_as_read_button','click',function(event){
		event.preventDefault();
		var unread = $$('.unread');

		for(var i=19, l = unread.length;i<l;i++) {
			unread[i].remove();
		}
		unread.each(function(el) { el.removeClassName('unread'); } );
		interfaces[0].setUnreadCount('0');
	});
	Element.observe('make_private','click',function(event){
		interfaces[0].setAreaContent('>',true);
		$('main_textarea').toggleClassName('priv_t');
	});
	Element.observe('shorten_links','click',function(event){
		event.preventDefault();
		var content = $('main_textarea').getValue();
		console.log("tresc z element.observe.click\n\t"+content);
		interfaces[0].shortenLinksInString(content, services[0].shortenLink);

	});
	// Pagination
	Element.observe('home_link','click',function(event) {
		services[0].dashboard_last_id=0;
		services[0].dashboardProcess = interfaces[0].Dashboard.draw;
		services[0].dashboardGet();
		event.preventDefault();
		$('current_page').update();
		loop1 = new PeriodicalExecuter(run_loop1,10);
		function run_loop1() {
			$('throbber').toggle();
			services[0].dashboardGet();
		}
	});
	Element.observe('next_page','click',function(event) {
		loop1.stop();
		event.preventDefault();
		services[0].dashboardProcess = interfaces[0].Dashboard.drawPage;
		services[0].dashboard_last_id=0;
		services[0].current_page = services[0].current_page + 1;
		var p =services[0].current_page;
		console.log(p);
		console.log(services[0].current_page);
		services[0].dashboardGet(p);
		$('current_page').update("Strona: "+p);
		console.log(services[0].current_page);
	});
	Element.observe('previous_page','click',function(event) {
		loop1.stop();
		event.preventDefault();
		services[0].dashboardProcess = interfaces[0].Dashboard.drawPage;
		services[0].dashboard_last_id=0;
		services[0].current_page = services[0].current_page - 1;
		var p =services[0].current_page;
		console.log(p);
		console.log(services[0].current_page);
		$('current_page').update("Strona: "+p);
		services[0].dashboardGet(p);
		console.log(services[0].current_page);
	});
});
