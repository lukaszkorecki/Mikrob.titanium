// EVENT HANDLERS
var Events = (function() {
		function login_button () {
				Application.getServices();
				if(Application.services.length === 0) {
						Application.openAddServiceWindow();

				} else {
						Application.refreshServices();
						Application.populateAccountSwitcher();
						active_service = 0;
            services[active_service].getUserAvatar();
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

		function main_text_area (event) {
				var content = (event.target_up || event.target).getValue();
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

		function new_status_submit (event) {
				var target = event.target_up || event.target;
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

		function mark_as_read_button () {
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

		function make_private () {
				interfaces[active_service].setAreaContent('>',true);
				$('main_textarea').toggleClassName('priv_t');
		}

		function shorten_links () {
				var content = $('main_textarea').getValue();
				interfaces[active_service].shortenLinksInString(content, services[active_service].shortenLink);
		}

		function archive_button (event) {
				var target = $(event.target_up || event.target);
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

		function home_button () {
				$('archive').hide();
				$('dash'+active_service).show();
				archive_opened = 0;
		}

		function change_service () {
				var old = active_service;
				active_service = (event.target_up || event.target).value || 0 ;
				if(old != active_service) {
						if(active_service == 'change') {
								active_service = old;
								Application.openAddServiceWindow();
						} else {
								Application.activateService(old, active_service);
						}
				}
		}



		function quote_link (event) {
				interfaces[active_service].setAreaContent($(event.target_up||event.target).getAttribute("data"), false);

		}
		function message_link (event) {
				interfaces[active_service].setAreaContent($(event.target_up||event.target).getAttribute("data"), true);

	  }
	  // no, it's not code duplication!
	  // eventualy each one of these functions will do something else! :-)
	  function user_link (event) {
			  var url = $(event.target_up || event.target).getAttribute("href");
			  Titanium.Desktop.openURL(url);
	  }
	  function thread_link (event) {
			  var url = $(event.target_up || event.target).getAttribute("href");
			  Titanium.Desktop.openURL(url);
	  }

	  function tag_link (event) {
			  var url = $(event.target_up || event.target).getAttribute("href");
			  Titanium.Desktop.openURL(url);
	  }

	  function external_link (event) {
        console.log('external_link');
			  var url = $(event.target_up || event.target).getAttribute("href");

        console.log(url);
			  Titanium.Desktop.openURL(url);
	  }

	  function update_picture_link (event) {
			  var image_url = $(event.target_up || event.target).getAttribute("href");
			  Application.openImageWindow(image_url);
	  }

    function quoted_link(event) {

    }
		return {
				login_button : login_button,
        login_form : login_button,
				 main_text_area  : main_text_area ,
				 new_status_submit  : new_status_submit ,
				 mark_as_read_button  : mark_as_read_button ,
				 make_private  : make_private ,
				 shorten_links  : shorten_links ,
				 archive_button  : archive_button ,
				 home_button  : home_button ,
				 change_service  : change_service ,
				 quote_link  : quote_link ,
				 message_link  : message_link ,
				 user_link  : external_link ,
				 thread_link  : external_link ,
				 tag_link  : external_link ,
				 tagLink  : external_link ,
        quoted_link : external_link,
				 external_link  : external_link ,
				 update_picture_link  : update_picture_link,
        permanent_link : external_link

		 };
})();
