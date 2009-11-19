var Update = new Class.create({
	initialize : function(obj)	{
		this.id = obj.id;
		this.user = obj.user;
		this.body = this.parseBody(obj.body);
		this.raw_body = obj.body;
		this.created_at = obj.created_at;

		this.pictures = obj.pictures || {};
		this.cclass = 'update';
	},
	
	print : function() {
		var self = this;

		var avid= self.user.avatar ? self.user.avatar.url_30 : "";
		var avatar = "http://blip.pl" + avid;

		var container = new Element('div', {'class':self.cclass});
		var p = new Element('p');
		var img = new Element('img',{'src': avatar});
		var user_link = new Element('a', {'href':'#'}).update('^'+self.user.login);
		p.insert(img);
		p.insert(user_link);
		p.insert(self.body);
		container.insert(p);
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
	},
	print : function(){
		var self = this;

		var avid= self.user.avatar ? self.user.avatar.url_30 : "";
		var avatar = "http://blip.pl" + avid;

		var ravid= self.recipient.avatar ? self.recipient.avatar.url_30 : "";
		var ravatar = "http://blip.pl" + avid;

		var separator = new Element('span').insert('&gt;');
		var cclass = 'directed';
		if(self.isPrivate){
			separator = new Element('span').insert('&gt;');
			cclass = 'private';
		}
		var container = new Element('div', {'class':self.cclass+' '+cclass});
		var p = new Element('p');
		var img = new Element('img',{'src': avatar});
		var rimg = new Element('img',{'src': ravatar});
		var user_link = new Element('a', {'href':'#'}).update('^'+self.user.login);
		var recipient_link = new Element('a', {'href':'#'}).update('^'+self.recipient.login);
		p.insert(img);
		p.insert(user_link);
		p.insert(separator);
		p.insert(rimg);
		p.insert(recipient);
		p.insert(self.body);
		container.update(p);
		return container;
	}
});
var TwitterBlip = new Class.create(Update,{
	initialize : function($super, obj) {
		$super(obj);
	},
	print : function() {
		var self = this;
		var container = new Element('div', {'class': self.cclass + ' twitter'});
		// TODO this is saying avatar, because eventually it will
		// render an avatar
		var avatar = new Element('span').update('Twitter');
		var body = self.body;
		var p = new Element('p');
		p.insert(avatar);
		p.insert(body);
		container.update(p);
		return container;
	}
});
var Notice = new Class.create(Update,{
	initialize : function($super, obj) {
		$super(obj);
	},
	print : function() {
		var self = this;
		// TODO this is saying avatar, because eventually it will
		// render an avatar
		var container = new Element('div', {'class': self.cclass+' notice'});
		var avatar = new Element('span').update('Powiadomienie');
		var body = self.body;
		var p = new Element('p');
		p.insert(avatar);
		p.insert(body);
		container.update(p);
		return container;
	}
});
