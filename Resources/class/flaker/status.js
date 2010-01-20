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
      return new Element('img', { src : path, alt : source_id});
    } else {
      return false;
    }
  },
  commentLink : function() {
    var self = this;
    var link = new Element('a', {'href':'#', 'class':'msg button small', 'title' : 'Skomentuj'}).update('✉');
    link.observe('click',function(event) {
        var pointer = '@';
        interfaces[self.owner_service_id].setAreaContent(pointer+self.id +" "+pointer+self.user.login, true);
        event.preventDefault();
        });
    return link;

  },
  commentsSingleView : function() {
    var self = this;
    var link = new Element('a', {'href':'#', 'class':'msg button small', 'title' : 'Otwórz całą dyskusję git'}).update(self.comments.length);
    link.observe('click',function(event) {
        interfaces[self.owner_service_id].openFlak(self.id);
        event.preventDefault();
    });
    return link;

  },
  permaLink : function() {
        
    var self = this;
    var link = new Element('a', {"target": "_blank", 'href':self.permalink,'class':'button small', 'title':self.id, 'title' : 'Permalink'}).update('#');
    link.observe('click',function(event) {
      Titanium.Desktop.openURL(url);
      event.preventDefault();
    });
    return link;
  },
  userLink : function() {
    var self = this;
    var ulink= new Element('a', {'href':'#', 'class': 'button'}).update('@'+self.user.login);
    ulink.observe('click',function(event){
    try{ 
      Titanium.Desktop.openURL('http://flaker.pl/'+self.user.login);
    } catch(err) { console.dir(err); }
      event.preventDefault();
    });
    return ulink;
  },
  userAvatar : function(size) {
    var self = this;
    return new Element('img',{'src': self.user.avatar, 'class':'avatar'});
  },
  getActions: function() {
  var self = this;
    var actions = new Element('div',{'class':'actions'});
    actions.insert(self.userLink());
    actions.insert(self.getSourceIcon(self.source));
    actions.insert(self.permaLink());
    actions.insert(self.commentLink());
    actions.insert(self.commentsSingleView());
    actions.insert(self.createdAt());
    return actions;
  },
  parseBody : function(body) {
    function formatLinks(txt) {
      var findLinks = /http(s)*:\/\/[0-9a-z\/\.\-\&\=\?\%]+/gi;
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
    var self = this;
    var container = new Element('div', {'class':self.cclass});
    var p = new Element('p');
    var av_container = new Element('div', {'class': 'avatar_container'});
    container.insert(av_container.update(self.userAvatar()));
    p.insert(self.body);
    container.insert(p);
    container.insert(self.getActions());
    return container;
    }
});
