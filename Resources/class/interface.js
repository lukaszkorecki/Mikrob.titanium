/**
 * Interface singleton - manages the tabs, views, columns and single purpose windows/sections 
 * 
 * @package mikrob.class.interface
 * @author Lukasz
 */
var Interface = {
	Dashboard : {
		draw : function(updates,is_update) {
			var self = this;
			var len = updates.length;
			
			var i=0;
			var dash = $('dash1');
			if(is_update !==0) updates.reverse();
			updates.each(function(blip){
				var blob = false;
				switch(blip.type) {
					case 'Notice':
						blob = new Notice(blip);
						break;
					
					case 'PrivateMessage':
					if(blip.user.login ==='t')
					{
						blob = new TwitterBlip(blip);
					}
					else
					{
						blob  =new Message(blip, true);
					}
						break;
					case 'DirectedMessage':
						blob = new Message(blip, false);
						break;
					default:
						blob = new Update(blip);
						break;
				}
				try {
					if(is_update !== 0) {
					
						//alert('going to the top');
						dash.insert({'top': blob});
					} else {
						//alert('going to the bottom');
						dash.insert({'bottom': blob});
					}
				} catch(elo) { console.dir(elo); }
				if (i<4) {
					try {
						Interface.notify(blob.user.login, blob.raw_body, ('http://blip.pl'+blob.user.avatar.url_50 || false));
					}
					catch (notifyerr) {
						console.dir(notifyerr);
					}
				}
				i++;
				
			});

		if (  is_update ===0) {
			$$('.unread').each(function(el) { el.removeClassName('unread'); } );
            Interface.setUnreadCount('0');
		} else {
			Interface.setUnreadCount($$('.unread').length);
		}
		$('throbber').toggle();
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
	}
};
