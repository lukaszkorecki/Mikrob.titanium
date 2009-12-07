/**
 *
 * Interface singleton - manages the tabs, views, columns and single purpose windows/sections 
 * 
 * @package mikrob.class.interface
 * @author Lukasz
 */
var Interface = {
	globalLimit : 20,
	afterSend : function(resp) {
		var self =this;
		Interface.setAreaContent();
		$('throbber').toggle();
		Interface.notify(Titanium.App.getName(),'Wysłano');
		$('sender').enable();
		$('charcount').update('0');
	},
	get_update_object : function(blip) {
		var single_status = {};
		switch(blip.type) {
			case 'Notice':
				single_status = new Notice(blip);
				break;
			case 'PrivateMessage':
				if(blip.user.login ==='t')
				{
					single_status = new TwitterBlip(blip);
				}
				else
				{
					single_status  = new Message(blip, true);
				}
			break;
			case 'DirectedMessage':
				single_status = new Message(blip, false);
				break;
			default:
				single_status = new Update(blip);
				break;
		}
		return single_status;
						
	},
	Dashboard : {
		drawPage : function(updates) {
			var self = this;
			var len = updates.length;
			
			var dash = $('dash1');
			dash.update();
			updates.each(function(blip){
					var single_status = Interface.get_update_object(blip);
					dash.insert({'bottom': single_status});
					Interface.injectQuote('quoted_link');
				
			});
			Interface.injectQuote('quoted_link');
			$$('.unread').each(function(el) { el.removeClassName('unread'); } );
			$('throbber').toggle();
		},
		draw : function(updates,is_update) {
			var self = this;
			var len = updates.length;
			
			var i=0;
			var dash = $('dash1');
			if(is_update !==0) updates.reverse();
			updates.each(function(blip){
				var single_status = Interface.get_update_object(blip);
					if(is_update !== 0) {
						dash.insert({'top': single_status});
					} else {
						dash.insert({'bottom': single_status});
					}
					Interface.injectQuote('quoted_link');
				if (i<4) {
					try {
						var av = 'http://blip.pl'+single_status.user.avatar.url_50 || false;
						Interface.notify(single_status.user.login, single_status.raw_body, av );
					}
					catch (notifyerr) {
						console.dir(notifyerr);
					}
					single_status = null;
				}
				i++;
				
			});

		if (  is_update ===0) {
			$$('.unread').each(function(el) { el.removeClassName('unread'); } );
            Interface.setUnreadCount('0');
		} else {
			var unr = $$('.unread').length;
			Interface.setUnreadCount(""+unr+"");
//		FIXME make the column show only maxlimit of updates
//			num = $$('.unread').length;
//			upd  =$$('.updates');
//			upd.slice((upd.length - num)).each(function(el) { el.remove(); } );

		}
		$('throbber').toggle();
		Interface.injectQuote('quoted_link');
		}
	},
	notify : function(login, body,img) {
	try {

		var window = Titanium.UI.getMainWindow(); // get the main window
		var note = Titanium.Notification.createNotification(window);
		note.setTitle(login); //Add the title;
		note.setMessage(body); //Add the message;
		if(img) {
			note.setIcon(img);
		}
		note.show();//Make it appear with the default timings.
	} catch(err) {
		console.dir(err);
	} 
			 
	 },
    setUnreadCount : function(count_str) {
		 if(count_str =='0') {
			 count_str ="";
		 }
       $('unread_count').update(count_str);
       try {
           Titanium.UI.setBadge(count_str);
       } catch (badge_err) { console.log(badge_err); }
    },
	setAreaContent : function(string, is_prepend) {
		var mt = $('main_textarea');
		if (string) {
			var old = mt.getValue();
			if(is_prepend) {
				mt.setValue(string+old);
			} else {
				mt.setValue(old+string);
			}
			mt.focus();
		} else {
			mt.setValue("");
		}
	},
	shortenLinksInString : function(string,shorten_function,exceptions) {
			var findLinks = /http:\/\/\S+/gi;
		var rez = string.match(findLinks);
		if(rez) {
			rez.each(function(link) {
				if( link.search('blip.pl') ==-1) services[0].shortenLink(link);
			});
		} else { console.log('nic nie teges'); }
	},
	replaceLinks : function(old_stuff, new_stuff) {
		var content = $('main_textarea').getValue();
		var content_n = content.replace(old_stuff, new_stuff);
		$('main_textarea').setValue(content_n);
   },
	cacheImage : function(url) {
		 var home_dir = Titanium.Filesystem.getUserDirectory();
		 var Sep = Titanium.Filesystem.getSeparator();
		 var name = '.mikrob_img_cache';
		 var img_cache_dir = home_dir+Sep+name+Sep;
	},
	getImageFromCache : function(name) {
	},
	injectQuote : function(target_class) {
		var els = $$('.'+target_class);
		els.each(function(el) {
			var blip_link = el.readAttribute('href');
			if(blip_link.search('blip') != -1) {
				var id = blip_link.split('/').last();
				services[0].getBlip(id);
				el.addClassName('s'+id);
			}
			el.removeClassName(target_class);
		});
	},
	injectQuotedBlip : function(target_class, obj) {
		var els = $$('.s'+target_class);
		els.each(function(el) {
			var blip="";
			switch(obj.type) {
				case 'DirectedMessage':
					blip = new Message(obj,false);
				break;
				default:
					blip = new Update(obj);
				break;
			}
			var contents = blip.toQuoted();
			contents.addClassName('quoted');
			el.update(contents);
			el.removeClassName(target_class);
			// FIXME tooo slooow!
			Interface.injectQuote('quoted_link');
			blip = null;
		});
	}

};
