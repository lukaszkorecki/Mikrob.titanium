var Update = new Class.create({
	initialize : function(obj)	{
		this.id = obj.id;
		this.user = obj.user;
		this.body = obj.body;
		this.created_at = objd.created_at;
	},
	
	print : function() {
		var temp = new Template("<p class='update'>#{body}</p><p>#{avatar} ^#{login}</p><p>#{id} #{created_at}");
	
		var self = this;
		var ob = {
			body : self.body,
			login : self.user.login,
			avatar : "http://blip.pl" +self.user.avatar.url_15,
			created_at : self.created_at,
			id : self.id
		};
		return temp.evaluate(ob);
	}
});
