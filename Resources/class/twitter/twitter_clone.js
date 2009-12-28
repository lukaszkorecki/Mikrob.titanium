var TwitterClone = new Class.create(Twitter, {
	initialize : function($super, login, password, service_id, api_root) {
		$super(login, password, service_id);
		this.api_root = api_root;
		
	}
});
