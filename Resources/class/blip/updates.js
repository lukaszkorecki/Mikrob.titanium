var Update = new Class.create({
	initialize : function(obj)	{
		this.id = obj.id;
		this.user = obj.user;
		this.body = this.parseBody(obj.body);
		this.raw_body = obj.body;
		this.created_at = obj.created_at;

		if(obj.pictures !== undefined)
		{
			this.pictures = obj.pictures;
		} else
		{
			this.pictures= false;
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
		this.cclass = 'up'+this.id+' update ';
		if(this.user.login == username)
		{
			this.cclass += " own";
		} 
		else { 
			this.cclass += " unread";
		}
	},
	createdAt : function() {
		return this.created_at.substr(this.created_at.indexOf(" "));
	},
	updatePicture : function() {
		var self = this;
		var pic = false;
		if (self.pictures !==false && self.pictures[0] != undefined) {
				var img_link = self.pictures[0].url;
				var link = new Element('a',{'href':img_link});
				link.observe('click',function(event) {
					event.preventDefault();
					Titanium.Desktop.openURL(img_link);

				});
				n_img_link = img_link.replace('.jpg','_standard.jpg');
				if(n_img_link.match('secure_picture')) n_img_link += 'standard';
				var img = new Element('img',{'src':n_img_link});
				pic = new Element('span',{'class':'update_picture'}).update(link.update(img));
		}
		return pic;
	 },
	updatePictureLink : function() {
		var self = this;
		var link = false;
		if (self.pictures !==false && self.pictures[0] != undefined) {
				var img_link = self.pictures[0].url;
				link = new Element('a',{'href':img_link});
				link.observe('click',function(event) {
					event.preventDefault();
					Titanium.Desktop.openURL(img_link);

				});
				link.update('[Pic]');
		}
		return link;
	},
	messageLink : function() {
		  var self = this;
		  var link = new Element('a', {'href':'#', 'class':'msg button small'}).update('Wiadomość');
		  link.observe('click',function(event) {
				  var pointer = '>';
				  if(self.type=='PrivateMessage') pointer = '>>';
				  Interface.setAreaContent(pointer+self.user.login, true);
				  event.preventDefault();
				  });
		  return link;
	},
	quoteLink : function() {
		var self = this;
		var link = new Element('a', {'href':'#', 'class':'quote button small'}).update('Cytuj');
		link.observe('click',function(event) {
		
			Interface.setAreaContent('http://blip.pl/'+self.short_type+'/'+self.id);
			event.preventDefault();
		});
		return link;
	},
	permaLink : function() {
				
		var self = this;
		var url = 'http://blip.pl/'+self.short_type+'/'+self.id;
		var link = new Element('a', {'href':url,'class':'button small', 'title':self.id}).update('Link');
		link.observe('click',function(event) {
			Titanium.Desktop.openURL(url);
			event.preventDefault();
		});
		return link;
	},
	deleteLink : function() {

	},
	userLink : function() {
		var self = this;
		var ulink= new Element('a', {'href':'#', 'class': 'button'}).update(self.user.login);
		ulink.observe('click',function(event){
		try{ 
			Titanium.Desktop.openURL('http://'+self.user.login+'.blip.pl');
		} catch(err) { console.dir(err); }
			event.preventDefault();
		});
		return ulink;
	},
	userAvatar : function(size) {
		var self = this;

		if ( ! size) size="30";
		var avid= self.user.avatar ? self.user.avatar['url_'+size] : "";
		var avatar = "http://blip.pl" + avid;
		return new Element('img',{'src': avatar, 'class':'avatar'});
	},
	getActions: function() {
	var self = this;
		var actions = new Element('div',{'class':'actions'});
		actions.insert(self.userLink());
		actions.insert(self.permaLink());
		actions.insert(self.quoteLink());
		actions.insert(self.messageLink());
		actions.insert(self.createdAt());
		return actions;
	},
	toElement : function() {
		var self = this;
		var container = new Element('div', {'class':self.cclass});
		var p = new Element('p');
		var av_container = new Element('div', {'class': 'avatar_container'});
		container.insert(av_container.update(self.userAvatar()));
		p.insert(self.body);
		if(self.pictures !== false) p.insert(self.updatePicture());
		container.insert(p);
		container.insert(self.getActions());
		return container;
	},

/**
 * TODO change these functions to build elements with Prototype's Element class
 * instead of using only simple textreplacements
 */
	parseBody : function(body) {
		function formatLinks(txt) {
			var findLinks = /http:\/\/\S+/gi;
			return txt.replace(findLinks, '<a class="quoted_link" target="_blank" href="$&" title="$&">$&</a>');
		}
		function formatUsers(txt) {
			var findUsers = /\^([\w]{1,})/gi;
			return txt.replace(findUsers, '<a target="_blank" class="externalLink" title="$&" href="http://$&.blip.pl"><span class="linksFirstLetter">^</span>$1</a>');
		}
		function formatUsersTwitter(txt) {
			var findUsers = /\@([\w]{1,})/gi;
			return txt.replace(findUsers, '<a target="_blank" class="externalLink" title="$&" href="http://$&.blip.pl"><span class="linksFirstLetter">@</span>$1</a>');
		}
		function formatTags(txt) {
			var findTags = /#[a-zA-Z0-9ęóąśłżźćń_\-☺☻☹★✩✫♫♪♥♦♣♠✿❀❁❄☾☂☀☁☃☄☮☯☎❦♀♂☚☛☠☢☣☤✌✍✎✂✆✈✉✔✘☥☸☦☧☨✝☩☪☭♚♛♜♝♞♟®™♈♉♊♋♌♍♎♏♐♑♒♓…∞¥€£≤≥«»≠≈∫∑∏µ∆øπΩ•÷‰⇐⇒⇔√˚]*/gi;
			return txt.replace(findTags, '<a target="_blank" class="externalLink tagLink" title="$&" href="http://blip.pl/tags/$&">$&</a>');
		}
		body = body.replace('&', '&amp;');
		body = body.replace(/\>/gi, '&gt;');
		body = body.replace(/\</gi, '&lt;');

		//var text2 = formatBlipZnaczki(body);
		var text1 = formatLinks(body);
		text2 = formatTags(text1).replace(/\/#/g, '/');
		text1 = formatUsers(text2).replace(/\/\^/g, '/');
		text2 = formatUsersTwitter(text1).replace(/\/\@/g, '/');
		return text2;

		},
		toQuoted : function() {
		   var self = this;
		   var sztrong = new Element('strong');
		   sztrong.insert(self.userAvatar('15'));
		   sztrong.insert(self.userLink());
		   var container = new Element('span');
		   container.insert(sztrong);
		   container.insert(self.body);
		   container.insert(self.updatePictureLink());
		   container.insert(self.quoteLink());
		   container.insert(self.permaLink());
		   container.insert(self.createdAt());
		   return container;
	}
});

var Message = new Class.create(Update, {
	initialize : function($super, obj, isPrivate) {
		$super(obj);
		this.recipient = obj.recipient;
		this.isPrivate = isPrivate;
		this.separator = new Element('span').insert('<strong>→</strong>');
		this.mclass = 'directed';
		if(this.isPrivate){
			this.separator = new Element('span').insert('<strong>⇉</strong>');
			this.mclass = 'private';
		}
	},
	recipientLink : function() {
		var self = this;
		var recipient_link = new Element('a', {'href':'#', 'class':'button'}).update(self.recipient.login);
		recipient_link.observe('click',function(event){
			event.preventDefault();
			Titanium.Desktop.openURL('http://'+self.recipient.login+'.blip.pl');
		});
		return recipient_link;
	},
	recipientAvatar: function(size) {
		var self = this;
		if (! size) {size="30";}
		var ravid= self.recipient.avatar ? self.recipient.avatar['url_'+size] : "";
		var ravatar = "http://blip.pl" + ravid;
		return new Element('img',{'src': ravatar, 'class':'ravatar'});
	},
	getActions :function() {
	var self = this;
		var actions = new Element('div',{'class':'actions'});
		actions.insert(self.userLink());
		actions.insert(self.separator);
		actions.insert(self.recipientLink());
		actions.insert(self.permaLink());
		actions.insert(self.quoteLink());
		actions.insert(self.messageLink());
		actions.insert(self.createdAt());
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
		container.insert(av_container);
		p.insert(self.body);

		if(self.pictures !== false) p.insert(self.updatePicture());
		container.insert(p);
		container.insert(self.getActions());
		return container;
	},
		toQuoted : function() {
			var self = this;
			var sztrong = new Element('strong');
			sztrong.insert(self.userAvatar('15'));
			sztrong.insert(self.userLink());
			sztrong.insert(self.separator);
			sztrong.insert(self.recipientAvatar('15'));
			sztrong.insert(self.recipientLink());
			var container = new Element('span');
			container.insert(sztrong);
			container.insert(self.body);
			container.insert(self.updatePictureLink());
			container.insert(self.quoteLink());
			container.insert(self.permaLink());
			container.insert(self.createdAt());
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
