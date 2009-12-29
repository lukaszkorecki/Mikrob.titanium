/* here b sth, dunno wat */
var Application = {
	db : "",
	services : [],
	get_services : function() {
		var services = { 
			'id' : { field_type : 'id' },
			'login' : {
				field_type : 'text',
				not_null : true
			},
			'password' : {
				field_type : 'text',
				not_null : true
			},
			'type' : {
				field_type : 'text',
				not_null : true
			},
			'api_url' : { field_type : 'text' }
		};
		this.db = new DatabaseConnector('mikrob', 'services', services);
		var serv = this.db.find() || [];
		this.services = serv;
		if(this.services.length > 0) {
			this.build_services();
			return true;
		} else {
			return false;
		}
	},
	build_services : function() {
		var serv = [];
		for (var i = 0; i < this.services.length; i++) {

			serv.push(this.services[i].row);
		}
		this.services = serv;
	},
	save_service : function(login, password, type, api_url) {
		var a_u = api_url || "";
		var new_serv = { fields : {
			'login' : login,
			'password' : password,
			'type' : type,
			'api_url' : api_url
		 }};
		console.dir(new_serv);
		this.db.save(new_serv);

	},
	open_add_service_window : function() {
		var win = Titanium.UI.getCurrentWindow();
		var w2 = win.createWindow('app://add_service.html');
		
		w2.setHeight(300);
		w2.setWidth(400);
		w2.setResizable(true);
		w2.open();
	},
	return_service_objects : function(service_row, index) {
		var obj = {
			'interFace' : null,
			service : null
		};
		switch(service_row.type) {
			case 'blip':
				obj.service = new Blip(service_row.login, service_row.password, index);
				obj.interFace = new BlipInterface('dash'+index, index);
				break;
			case 'twitter':
				obj.service = new Twitter(service_row.login, service_row.password, index);
				obj.interFace = new TwitterInterface('dash'+index,index);
				break;
			case 'custom_twitter':
				obj.service = new Twitter(service_row.login, service_row.password, index , service_row.api_url );
				obj.interFace = new TwitterInterface('dash'+index,index);
				break;
			
			default:
				// code
				break;
		}
		return obj;
	},
	populate_account_switcher : function() {
		var account_switcher = $('change_service');
		account_switcher.update();
		this.get_services();
		for(var i=0, len = this.services.length;i<len;i++) {

			var elem = new Element('option', {value : i}).update(this.services[i].login.capitalize() + " ("+this.services[i].type.capitalize()+")");
			account_switcher.insert(elem);
		}
	},
activate_service : function(old_service_id, new_service_id) {
	$('dash'+old_service_id).fade();
	$('dash'+new_service_id).appear();
}

	

};
