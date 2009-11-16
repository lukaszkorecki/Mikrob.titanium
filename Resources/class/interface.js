/**
 * Interface singleton - manages the tabs, views, columns and single purpose windows/sections 
 * 
 * @package deskBlip.class.interface
 * @author Lukasz
 */
var Interface = {
	draw : function(updates) {
		air.Introspector.Console.dump(updates);
		var len = updates.length;
		air.trace('-------');
		for(var i;i<len;i++) {
			air.trace(updates);
		}
   }
};
