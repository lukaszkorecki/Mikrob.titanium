var Update = new Class.create({
	initialize : function(obj)	{
		this.id = obj.id;
		this.user = obj.user;
		this.body = this.parseBody(obj.body);
		this.raw_body = obj.body;
		this.created_at = obj.created_at;

		if(obj.pictures && obj.pictures.length > 0) {
			this.pictures = obj.pictures;
		} else {
			this.pictures = false;
		}
		this.type = obj.type;

		switch(obj.type) {
			case 'DirectedMessage':
				this.short_type = 'dm';
				break;
				
			case 'PrivateMessage':
				this.short_type = 'pm';
			break;
			default:
				this.short_type = 's';
				break;
		}
		this.pictures = obj.pictures || {};
		this.cclass = 'update unread';
	},
	updatePicture : function() {
		var self = this;
		var pic = false;
		if (self.pictures !== false) {
			try {
				var img_link = self.pictures[0].url;
				var link = new Element('a',{'href':img_link});
				link.observe('click',function(event) {
					event.preventDefault();
					Titanium.Desktop.openApplication('open '+img_link);

				});
				img_link = img_link.replace('.jpg','_standard.jpg');
				if(img_link.match('secure_picture')) img_link += 'standard';
				var img = new Element('img',{'src':img_link});
				pic = new Element('span',{'class':'update_picture'}).update(link.update(img));
			} catch(err) { console.log('failed pic detection'); }
		}
		return pic;
		
	 },
	messageLink : function() {
		  var self = this;
		  var link = new Element('a', {'href':'#', 'class':'msg button'}).update('Wiadomość');
		  link.observe('click',function(event) {
				  Interface.setAreaContent('>'+self.user.login, true);
				  event.preventDefault();
				  });
		  return link;
	},
	quoteLink : function() {
		var self = this;
		var link = new Element('a', {'href':'#', 'class':'quote button'}).update('Cytuj');
		link.observe('click',function(event) {
		
			Interface.setAreaContent('http://blip.pl/'+self.short_type+'/'+self.id);
			event.preventDefault();
		});
		return link;
	},
	permaLink : function() {
				
		var self = this;
		var url = 'http://blip.pl/'+self.short_type+'/'+self.id;
		var link = new Element('a', {'href':url, 'title':self.id}).update('Link');
		link.observe('click',function(event) {
			Titanium.Desktop.openURL(url);
			event.preventDefault();
		});
		return link;
	},
	userLink : function() {
		var self = this;
		var ulink= new Element('a', {'href':'#', 'class': 'user'}).update('^'+self.user.login);
		ulink.observe('click',function(event){
			event.preventDefault();
			console.dir(this);
		});
		return ulink;
	},
	userAvatar : function() {
		var self = this;

		var avid= self.user.avatar ? self.user.avatar.url_30 : "";
		var avatar = "http://blip.pl" + avid;
		return new Element('img',{'src': avatar, 'class':'avatar'});
	},
	getActions: function() {
		 var self = this;
		 var actions = new Element('div',{'class':'actions'});
		 actions.insert(self.quoteLink());
		 actions.insert(self.messageLink());
		 actions.insert(new Element('span').insert({'top':self.created_at, 'bottom':self.permaLink()}));
		 return actions;
	},
	toElement : function() {
		var self = this;
		var container = new Element('div', {'class':self.cclass});
		var p = new Element('p');
		var av_container = new Element('div', {'class': 'avatar_container'});
		container.insert(av_container.update(self.userAvatar()));
		p.insert(self.userLink());
		p.insert(self.body);
		var img = self.updatePicture();
		if(img !== false) p.insert(img);
		container.insert(p);
		container.insert(self.getActions());
		return container;
	},

	parseBody : function(body) {
		function formatBlipZnaczki(body) {
			return body.replace(/[☺☻☹★✩✫♫♪♥♦♣♠✿❀❁❄☾☂☀☁☃☄☮☯☎❦♀♂☚☛☠☢☣☤✌✍✎✂✆✈✉✔✘☥☸☦☧☨✝☩☪☭♚♛♜♝♞♟®™♈♉♊♋♌♍♎♏♐♑♒♓∞¥€£≤≥«»≠≈∫∑∏µ∆øπΩ•÷‰⇐⇒⇔√˚]/gi, "<span class=\"big\">$&</span>");
		}
		function formatLinks(txt) {
			var findLinks = /http:\/\/\S+/gi;
			return txt.replace(findLinks, '<a class="externalLink" target="_blank" href="$&" title="$&">$&</a>');
		}
		function formatUsers(txt) {
			var findUsers = /\^([\w]{1,})/gi;
			return txt.replace(findUsers, '<a class="externalLink" title="$&" href="http://$&.blip.pl"><span class="linksFirstLetter">^</span>$1</a>');
		}
		function formatUsersTwitter(txt) {
			var findUsers = /\@([\w]{1,})/gi;
			return txt.replace(findUsers, '<a class="externalLink" title="$&" href="http://$&.blip.pl"><span class="linksFirstLetter">@</span>$1</a>');
		}
		function formatTags(txt) {
			var findTags = /#[a-zA-Z0-9ęóąśłżźćń_\-☺☻☹★✩✫♫♪♥♦♣♠✿❀❁❄☾☂☀☁☃☄☮☯☎❦♀♂☚☛☠☢☣☤✌✍✎✂✆✈✉✔✘☥☸☦☧☨✝☩☪☭♚♛♜♝♞♟®™♈♉♊♋♌♍♎♏♐♑♒♓…∞¥€£≤≥«»≠≈∫∑∏µ∆øπΩ•÷‰⇐⇒⇔√˚]*/gi;
			return txt.replace(findTags, '<a class="externalLink tagLink" title="$&" href="http://blip.pl/tags/$&">$&</a>');
		}
		body = body.replace('&', '&amp;');
		body = body.replace(/\>/gi, '&gt;');
		body = body.replace(/\</gi, '&lt;');

		var text2 = formatBlipZnaczki(body);
		var text1 = formatLinks(text2);
		text2 = formatTags(text1).replace(/\/#/g, '/');
		text1 = formatUsers(text2).replace(/\/\^/g, '/');
		text2 = formatUsersTwitter(text1).replace(/\/\@/g, '/');
		text1 = text2;

		return text1;
		}
});

var Message = new Class.create(Update, {
	initialize : function($super, obj, isPrivate) {
		$super(obj);
		this.recipient = obj.recipient;
		this.isPrivate = isPrivate;
		this.separator = new Element('span').insert('<strong>→</strong>');
		this.mclass = 'directed';
		if(self.isPrivate){
			this.separator = new Element('span').insert('<strong>⇉</strong>');
			this.mclass = 'private';
		}
	},
	recipientLink : function() {
		var self = this;
		var recipient_link = new Element('a', {'href':'#', 'class':'recipient'}).update('^'+self.recipient.login);
		recipient_link.observe('click',function(event){
			event.preventDefault();
		});
		return recipient_link;
	},
	recipientAvatar: function() {
		var self = this;
		var ravid= self.recipient.avatar ? self.recipient.avatar.url_30 : "";
		var ravatar = "http://blip.pl" + ravid;
		return new Element('img',{'src': ravatar, 'class':'ravatar'});
	},
	getActions : function() {

		 var self = this;
		 var actions = new Element('div', {'class':'actions'});
		 actions.insert(self.quoteLink());
		 actions.insert(self.messageLink());
		 actions.insert(new Element('span').insert({'top':self.created_at, 'bottom':self.permaLink()}));

		 return actions;
	},
	toElement : function(){
		var self = this;


		var container = new Element('div', {'class':self.cclass+' '+self.mclass});
		var p = new Element('p');
		var av_container = new Element('div', {'class': 'avatar_container'});
		av_container.insert(self.userAvatar());
		av_container.insert('<br />');
		av_container.insert(self.recipientAvatar());
		console.dir(av_container);
		container.insert(av_container);
		p.insert(self.userLink());
		p.insert(self.separator);
		p.insert(self.recipientLink());
		p.insert(self.body);

		var img = self.updatePicture();
		if(img !== false) p.insert(img);
		container.insert(p);
		container.insert(self.getActions());
		return container;
	}
});
var TwitterBlip = new Class.create(Update,{
	initialize : function($super, obj) {
		$super(obj);
	},
	toElement : function() {
		var self = this;
		var container = new Element('div', {'class': self.cclass + ' twitter'});
		// TODO this is saying avatar, because eventually it will
		// render an avatar
		var body = self.body;
		var p = new Element('p');
		var av_container = new Element('div', {'class': 'avatar_container'});
		container.insert(av_container.update(self.userAvatar()));
		p.insert(body);
		container.insert(p);
		// TODO create different actions
		container.insert(self.getActions());
		return container;
	}
});
var Notice = new Class.create(Update,{
	initialize : function($super, obj) {
		$super(obj);
	},
	toElement : function() {
		var self = this;
		// TODO this is saying avatar, because eventually it will
		// render an avatar
		var container = new Element('div', {'class': self.cclass+' notice'});
		var body = self.body;
		var p = new Element('p');
		var av_container = new Element('div', {'class': 'avatar_container'});
		container.insert(av_container.update(self.userAvatar()));
		p.insert(body);
		container.update(p);
		//container.insert(self.getActions());
		return container;
	}
});
