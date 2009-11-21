/**
 * Interface singleton - manages the tabs, views, columns and single purpose windows/sections 
 * 
 * @package deskBlip.class.interface
 * @author Lukasz
 */
var Interface = {
	Dashboard : {
		draw : function(updates,is_update) {
			var self = this;
			var len = updates.length;
			var i=0;
			var dash = $('dash1');
			updates.each(function(blip){

				var blob;
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
					if(is_update) {
					
						dash.insert(blob,'top');
					} else {
						dash.insert(blob, 'bottom');
					}
				} catch(elo) { console.dir(elo); }
				if (i<4) {
					Interface.notify(blob.user.login, blob.raw_body);
				}
				i++;
				
			});

		$('throbber').toggle();
		}
	},
	notify : function(login, body) {
		var window = Titanium.UI.getMainWindow(); // get the main window
		var note = Titanium.Notification.createNotification(window);
		note.setTitle(login); //Add the title;
		note.setMessage(body); //Add the message;
		note.show();//Make it appear with the default timings.
			 
			 
	 },
	setAreaContent : function(string) {
		var mt = $('main_textarea');
		if (string) {
			var old = mt.innerHTML;
			mt.update(old+" "+string);
		} else {
			mt.update("");
		}
	}
};
