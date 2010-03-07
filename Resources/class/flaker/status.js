var Flak = new Class.create({
  initialize : function(flak, owner_service_id) {
    this.created_at = flak.datetime || "";
    this.owner_service_id = owner_service_id || "";
    this.id = flak.id || "";
    this.link = flak.link || "";
    this.body = flak.text || "";
    if(this.body ==="") this.body += this.link;
    this.body = this.parseBody(this.body);
    this.raw_body = flak.text.substring(0, 160) || "";
    this.user = flak.user || "";
    this.timestamp = flak.timestamp || "";
    this.source = flak.source || "";
    this.permalink = flak.permalink || "";
    this.tags = flak.tags || "";
    this.comments = flak.comments || "";
    this.cclass = "f"+this.id+" update";
    if(this.user.login == this.username)
    {
      this.cclass += " own";
    }
    else {
      this.cclass += " unread";
    }

    //console.dir(flak);
  },
  createdAt : function() {
    return this.created_at;
  },
  getSourceIcon : function(source_id) {
    if(source_id) {
     var path = 'app://icons/flaker_sources/'+source_id+'.gif';
     if (source_id == 'flaker') {path=  path.replace('gif', 'png');}
      var img = new Element('img', {src : path, alt : source_id, "width": "16px", "height" : "16px"});
      return new Element("a", {'class' : 'button small', "href" : "http://flaker.pl/"+this.user.login+"/"+source_id}).update(img);
    } else {
      return false;
    }
  },
  commentLink : function() {
			var icon = new Element("img", {src : AppIcons.small.message, "class": "message_link_img"});
    var link = new Element('a', {'href':'#', 'class':'msg button small external_link ', 'title' : 'Skomentuj'}).update(icon);
    return link;

  },
  commentsSingleView : function() {

    var link = new Element('a', {'href':'#', 'class':'msg button small', 'title' : 'Otwórz całą dyskusję git'}).update(this.comments.length);
    return link;

  },
  permaLink : function() {


			var icon = new Element("img", {src : AppIcons.small.permalink, "class" : "permanent_link_img"});
    var link = new Element('a', {"target": "_blank", 'href':this.permalink,'class':'button small permanent_link', 'title':this.id, 'title' : 'Permalink'}).update(icon);

    return link;
  },
  userLink : function() {
    var ulink= new Element('a', {'href':'#', 'class': 'button user_link'}).update('@'+this.user.login);

    return ulink;
  },
  userAvatar : function(size) {
    return new Element('img',{'src': this.user.avatar, 'class':'avatar'});
  },
  getActions: function() {
    var actions = new Element('div',{'class':'actions'});
    actions.insert(this.userLink());
    actions.insert(this.permaLink());
    actions.insert(this.commentLink());
    actions.insert(this.commentsSingleView());
    actions.insert(this.getSourceIcon(this.source));
    actions.insert(this.createdAt());
    return actions;
  },
  parseBody : function(body) {
    function formatLinks(txt) {
      var findLinks = /http(s)*:\/\/[0-9a-z\,\_\/\.\-\&\=\?\%]+/gi;
      return  txt.replace(findLinks, '<a class="quoted_link" target="_blank" href="$&" title="$&">$&</a>');
    }
    function formatUsers(txt) {
      var findUsers = /\@([\w]{1,})/gi;
      return txt.replace(findUsers, '<a target="_blank" class="externalLink" title="$&" href="http://flaker.pl/$&"><span class="linksFirstLetter">@</span>$1</a>');
    }
    function formatTags(txt) {
      var findTags = /#[a-zA-Z0-9ęóąśłżźćń_\-☺☻☹★✩✫♫♪♥♦♣♠✿❀❁❄☾☂☀☁☃☄☮☯☎❦♀♂☚☛☠☢☣☤✌✍✎✂✆✈✉✔✘☥☸☦☧☨✝☩☪☭♚♛♜♝♞♟®™♈♉♊♋♌♍♎♏♐♑♒♓…∞¥€£≤≥«»≠≈∫∑∏µ∆øπΩ•÷‰⇐⇒⇔√˚]*/gi;
      return txt.replace(findTags, '<a target="_blank" class="externalLink tagLink" title="$&" href="http://flaker.pl/tags/$&">$&</a>');
    }
    body = body.replace('&', '&amp;');
    body = body.replace(/\>/gi, '&gt;');
    body = body.replace(/\</gi, '&lt;');

    var text1 = formatLinks(body);
    text2 = formatTags(text1).replace(/\/#/g, '/');
    text1 = formatUsers(text2).replace(/\/\^/g, '/');
    return text1;

  },
  toElement : function() {

    var container = new Element('div', {'class':this.cclass});
    var p = new Element('p');
    var av_container = new Element('div', {'class': 'avatar_container'});
    container.insert(av_container.update(this.userAvatar()));
    p.insert(this.body);
    container.insert(p);
    container.insert(this.getActions());
    return container;
    }
});
