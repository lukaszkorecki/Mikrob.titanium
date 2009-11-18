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
				var blob = new Update(blip);
				pos = is_update ? 'top' : 'bottom';
				dash.insert(blob.print(),{position:pos});
				if (i<4) {
					Interface.notify(blob.user.login, blob.body);
				}
				i++;
				
			});
		}
	},
	notify : function(login, body) {
		var window = Titanium.UI.getMainWindow(); // get the main window
		var note = Titanium.Notification.createNotification(window);
		note.setTitle(login); //Add the title;
		note.setMessage(body); //Add the message;
		note.show();//Make it appear with the default timings.
			 
			 
	 }
};
