/**
 * Interface singleton - manages the tabs, views, columns and single purpose windows/sections 
 * 
 * @package deskBlip.class.interface
 * @author Lukasz
 */
var Interface = {
	Dashboard : {
		draw : function(updates) {
			var self = this;
			var len = updates.length;
			var dash = $('dash1');
			updates.each(function(blip){
				var blob = new Update(blip);
				dash.insert(blob.print());
				Interface.notify(blob.user.login, blob.body);
				
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
