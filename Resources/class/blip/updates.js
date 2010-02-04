var Update = new Class.create({
  initialize : function(obj, owner_service_id, username)  {
    this.owner_service_id = owner_service_id;
    this.id = obj.id;
    this.username = username || false;
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
  //  this.pictures = obj.pictures || {};
    this.cclass = 'up'+this.id+' update ';
    if(this.user.login == this.username)
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
    if (this.pictures !==false && this.pictures[0] != undefined) {
        var img_link = this.pictures[0].url;
        var link = new Element('a',{'href':img_link, "class" : "update_picture_link"});
        n_img_link = img_link.replace('.jpg','_standard.jpg');
        if(n_img_link.match('secure_picture')) n_img_link += 'standard';
        var img = new Element('img',{'src':n_img_link});
        pic = new Element('span',{'class':'update_picture'}).update(link.update(img));
    }
    return pic;
   },
  updatePictureLink : function() {

    var link = false;
    if (this.pictures !==false && this.pictures[0] != undefined) {
        var img_link = this.pictures[0].url;
        link = new Element('a',{'href':img_link, "class" : "update_picture_link"});

        link.update('[Pic]');
    }
    return link;
  },
  messageLink : function() {

			var icon = new Element("img", {src : AppIcons.small.message, "class" : "message_link_img"});
var prefix = ">";
if(this.type == "PrivateMessage") {
	prefix = ">>";
}
      var link = new Element('a', {'href':'#', "data" : prefix+this.user.login,  'class':'msg button small message_link', 'title' : 'Wiadomość'}).update(icon);

      return link;
  },
  quoteLink : function() {

			var icon = new Element("img", {src : AppIcons.small.quote ,  "class" : "quote_link_img" });
    var link = new Element('a', {'href':'#', 'class':'quote button small quote_link', 'title' : 'Cytuj', "data" : "http://blip.pl/"+this.short_type+"/"+this.id}).update(icon);

    return link;
  },
  permaLink : function() {


    var url = 'http://blip.pl/'+this.short_type+'/'+this.id;
			var icon = new Element("img", {src : AppIcons.small.permalink});

    var link = new Element('a', {'href':url,'class':'button small premanent_link', "target" : "_blank",    'title' : 'Permalink'}).update(icon);

    return link;
  },
  threadLink : function() {

        var url = "http://blip-thread.heroku.com/threads/"+this.id;
			var icon = new Element("img", {src : AppIcons.small.comment});
        var link = new Element('a', {'href': url, 'class':'button small thread_link', "target" : "_blank",  'title':'Otwórz konwersacje'}).update(icon);

        return link;
  },
  deleteLink : function() {

  },

  userLink : function() {

    var ulink= new Element('a', {'href':'#', 'class': 'button user_link'}).update('^'+this.user.login);

    return ulink;
  },
  userAvatar : function(size) {


    if ( ! size) size="30";
    var avid= this.user.avatar ? this.user.avatar['url_'+size] : "";
    var avatar = "http://blip.pl" + avid;
    return new Element('img',{'src': avatar, 'class':'avatar'});
  },
  getActions: function() {

    var actions = new Element('div',{'class':'actions'});
    actions.insert(this.userLink());
    actions.insert(this.permaLink());
    actions.insert(this.quoteLink());
    actions.insert(this.messageLink());
        actions.insert(this.threadLink());
    actions.insert(this.createdAt());
    return actions;
  },
  toElement : function() {

    var container = new Element('div', {'class':this.cclass});
    var p = new Element('p');
    var av_container = new Element('div', {'class': 'avatar_container'});
    container.insert(av_container.update(this.userAvatar()));
    p.insert(this.body);
    if(this.pictures !== false) p.insert(this.updatePicture());
    container.insert(p);
    container.insert(this.getActions());
    return container;
  },

/**
 * TODO change these functions to build elements with Prototype's Element class
 * instead of using only simple textreplacements
 */
  parseBody : function(body) {
    function formatLinks(txt) {
      var findLinks = /http(s)*:\/\/[0-9a-z\,\_\/\.\-\&\=\?\%]+/gi;
      return  txt.replace(findLinks, '<a class="quoted_link" target="_blank" href="$&" title="$&">$&</a>');
    }
    function formatUsers(txt) {
      var findUsers = /\^([\w]{1,})/gi;
      return txt.replace(findUsers, '<a target="_blank" class="external_link" title="$&" href="http://$&.blip.pl"><span class="linksFirstLetter">^</span>$1</a>');
    }
    function formatUsersTwitter(txt) {
      var findUsers = /\@([\w]{1,})/gi;
      return txt.replace(findUsers, '<a target="_blank" class="external_link" title="$&" href="http://$&.blip.pl"><span class="linksFirstLetter">@</span>$1</a>');
    }
    function formatTags(txt) {
      var findTags = /#[a-zA-Z0-9ęóąśłżźćń_\-☺☻☹★✩✫♫♪♥♦♣♠✿❀❁❄☾☂☀☁☃☄☮☯☎❦♀♂☚☛☠☢☣☤✌✍✎✂✆✈✉✔✘☥☸☦☧☨✝☩☪☭♚♛♜♝♞♟®™♈♉♊♋♌♍♎♏♐♑♒♓…∞¥€£≤≥«»≠≈∫∑∏µ∆øπΩ•÷‰⇐⇒⇔√˚]*/gi;
      return txt.replace(findTags, '<a target="_blank" class="external_link tagLink" title="$&" href="http://blip.pl/tags/$&">$&</a>');
    }
    body = body.replace('&', '&amp;');
    body = body.replace(/\>/gi, '&gt;');
    body = body.replace(/\</gi, '&lt;');

    //var text2 = formatBlipZnaczki(body);
    var text1 = formatLinks(body);
    var text2 = formatTags(text1).replace(/\/#/g, '/');
    text1 = formatUsers(text2).replace(/\/\^/g, '/');
    text2 = formatUsersTwitter(text1).replace(/\/\@/g, '/');
    return text2;

    },
    toQuoted : function() {

       var sztrong = new Element('strong');
       sztrong.insert(this.userAvatar('15'));
       sztrong.insert(this.userLink());
       var container = new Element('span');
       container.insert(sztrong);
       container.insert(this.body);
       container.insert(this.updatePictureLink());
       container.insert(this.quoteLink());
       container.insert(this.permaLink());
       container.insert(this.createdAt());
       return container;
  }
});

var Message = new Class.create(Update, {
  initialize : function($super, obj, isPrivate, owner_service_id, username) {
    $super(obj, owner_service_id, username);
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

    var recipient_link = new Element('a', {'href':'#', 'class':'button'}).update(this.recipient.login);

    return recipient_link;
  },
  recipientAvatar: function(size) {

    if (! size) {size="30";}
    var ravid= this.recipient.avatar ? this.recipient.avatar['url_'+size] : "";
    var ravatar = "http://blip.pl" + ravid;
    return new Element('img',{'src': ravatar, 'class':'ravatar'});
  },
  getActions :function() {

    var actions = new Element('div',{'class':'actions'});
    actions.insert(this.userLink());
    actions.insert(this.separator);
    actions.insert(this.recipientLink());
    actions.insert(this.permaLink());
    actions.insert(this.quoteLink());
    actions.insert(this.messageLink());
    actions.insert(this.createdAt());
    return actions;

  },
  toElement : function(){



    var container = new Element('div', {'class':this.cclass+' '+this.mclass});
    var p = new Element('p');
    var av_container = new Element('div', {'class': 'avatar_container'});
    av_container.insert(this.userAvatar());
    av_container.insert('<br />');
    av_container.insert(this.recipientAvatar());
    container.insert(av_container);
    p.insert(this.body);

    if(this.pictures !== false) p.insert(this.updatePicture());
    container.insert(p);
    container.insert(this.getActions());
    return container;
  },
    toQuoted : function() {

      var sztrong = new Element('strong');
      sztrong.insert(this.userAvatar('15'));
      sztrong.insert(this.userLink());
      sztrong.insert(this.separator);
      sztrong.insert(this.recipientAvatar('15'));
      sztrong.insert(this.recipientLink());
      var container = new Element('span');
      container.insert(sztrong);
      container.insert(this.body);
      container.insert(this.updatePictureLink());
      container.insert(this.quoteLink());
      container.insert(this.permaLink());
      container.insert(this.createdAt());
      return container;
  }
});
var TwitterBlip = new Class.create(Update,{
  initialize : function($super, obj, owner_service_id) {
    $super(obj, owner_service_id);
  },
  toElement : function() {

    var container = new Element('div', {'class': this.cclass + ' twitter'});
    // TODO this is saying avatar, because eventually it will
    // render an avatar
    var body = this.body;
    var p = new Element('p');
    var av_container = new Element('div', {'class': 'avatar_container'});
    container.insert(av_container.update(this.userAvatar()));
    p.insert(body);
    container.insert(p);
    // TODO create different actions
    container.insert(this.getActions());
    return container;
  }
});
var Notice = new Class.create(Update,{
  initialize : function($super, obj, owner_service_id) {
    $super(obj, owner_service_id);
  },
  toElement : function() {

    // TODO this is saying avatar, because eventually it will
    // render an avatar
    var container = new Element('div', {'class': this.cclass+' notice'});
    var body = this.body;
    var p = new Element('p');
    var av_container = new Element('div', {'class': 'avatar_container'});
    container.insert(av_container.update(this.userAvatar()));
    p.insert(body);
    container.update(p);
    //container.insert(this.getActions());
    return container;
  }
});
