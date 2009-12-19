/**
 *
 * Interface singleton - manages the tabs, views, columns and single purpose windows/sections 
 * TODO this object needs to be turned into a class and service specific functions need to go to 
 * its subclasses
 * @package mikrob.class.interface
 * @author Lukasz
 */
//var Interface = new Class.create({
//		
//	initialize : function(container_id) {
//		this.container_id = container_id;
//	},
//	globalLimit : 20,
//});
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
					Interface.expandLink('quoted_link');
				
			});
	//		Interface.expandLink('quoted_link');
			$$('.unread').each(function(el) { el.removeClassName('unread'); } );
			// not very clever way of scrolling up ;-)
			$$('.column')[0].scrollByLines(-($$('.column')[0].scrollHeight))
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
					Interface.expandLink('quoted_link');
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
		//Interface.expandLink('quoted_link');
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
	expandLink : function(target_class) {
		var els = $$('.'+target_class);
		els.each(function(el) {
			var blip_link = el.readAttribute('href');
			var id="";
			if(blip_link.search('blip') != -1) {
				id = blip_link.split('/').last();
				services[0].getBlip(id);
				el.addClassName('s'+id);
			}
			if (blip_link.search('rdir') != -1) {
				
				id = blip_link.split('/').last();
				services[0].expandLink(id);
				el.addClassName('r'+id);
			}
			el.removeClassName(target_class);
		});
	},
	injectQuotedBlip : function(target_class, obj) {
		var els = $$('.s'+target_class);
		els.each(function(el) {
			el.update('[Blip]');
			el.observe('click', function(event) {
				event.preventDefault();
				var blip = Interface.get_update_object(obj);
				var contents = blip.toQuoted();
				contents.addClassName('quoted');
				var elem = el.up('p') || el.up(); //.next();
				elem.insert({'after':contents});
				el.remove();
				Interface.expandLink('quoted_link');
			});
		});
	},
	expandShortenUrl : function(id, obj) {
		var els = $$('.r'+id);
		els.each(function(el) {
			el.update();
			el.insert('[');
			el.insert(obj.original_link.split('/')[2]);
			el.insert(']');
			var stats_link = new Element('a',{
				'href':'http://rdir.pl/'+id+'/stats',
				'class':'small',
				'target':'_blank'
				}
			).update('s');
			el.insert({'after':stats_link});
			el.removeClassName('r'+id);
		});
	}

};
