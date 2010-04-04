
var Update = new Class.create(
  {
    initialize : function(obj, owner_service_id, username)  {
      this.owner_service_id = owner_service_id;
      this.id = obj.id;
      this.username = username || false;
      this.user = obj.user;
      this.body = this.parseBody(obj.body);
      this.raw_body = obj.body;
      this.created_at = obj.created_at;
      this.transport = (obj.transport) ? obj.transport.name : "?";
      console.dir(obj);
      if(obj.pictures !== undefined && obj.pictures.length>0) {
        this.pictures = obj.pictures;
      } else {
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
      obj = null;
    },
    transportName : function() {
      if(this.transport) {
        return (new Element("span").update(" "+this.transport));
      } else {
        return "";
      }

    },
    createdAt : function() {
      return (new Element("span").update(this.created_at.substr(this.created_at.indexOf(" ")).trim()));
    },
    updatePicture : function() {
      var pic = false;
      if (this.pictures !==false && this.pictures[0] != undefined) {
        var img_link = this.pictures[0].url;
        var link = new Element('a',{'href':img_link, "class" : "update_picture_link"});
        var n_img_link = img_link.replace('.jpg','_standard.jpg');
        var img = new Element('img',{'src':n_img_link, "class" : "update_picture_link_img"});
        if(  n_img_link.match('secure_picture')) {
          img.setAttribute("src", "app://icons/ui/48_warning.png");
          link.setAttribute("title", "Prywatny obrazek");
          link.addClassName("external_link");
          img.addClassName("external_link_img");
        }
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
      var icon = "Wiadomość";
      var prefix = ">";
      if(this.type == "PrivateMessage") {
	      prefix = ">>";
      }
      var link = new Element('button', {
                               'href':'#',
                               "data" : prefix+this.user.login,
                               'class':'msg  small message_link',
                               'title' : 'Wiadomość'
                             }).update(icon);

      return link;
    },
    quoteLink : function() {
      var icon = "Cytuj";
      var link = new Element('button', {
                               'href':'#',
                               'class':'quote small quote_link',
                               'title' : 'Cytuj',
                               "data" : "http://blip.pl/"+this.short_type+"/"+this.id
                             }).update(icon);
      return link;
    },
    permaLink : function() {
      var url = 'http://blip.pl/'+this.short_type+'/'+this.id;
      var icon = "Link";
      var link = new Element('button', {
                               'href':url,
                               'class':' small permanent_link',
                               "target" : "_blank",
                               'title' : 'Permalink'
                             }).update(icon);
      return link;
    },
    threadLink : function() {
      var url = "http://blip-thread.heroku.com/threads/"+this.id;
      var icon = "Watek";
      var link = new Element('button', {
                               'href': url,
                               'class':' small thread_link',
                               "target" : "_blank",
                               'title':'Otwórz konwersacje'
                             }).update(icon);
      return link;
    },
    deleteLink : function() {

    },

    userLink : function() {
      var ulink= new Element('a', {'href':'#', 'class': 'user_link'}).update('^'+this.user.login);

      return ulink;
    },
    userAvatar : function(size) {
      if ( ! size) size="30";
      var avid= this.user.avatar ? this.user.avatar['url_'+size] : "";
      var avatar = "";
      if(avid != "") {
        avatar = "file://"+Application.cache_io("http://blip.pl" + avid,"av");
      }
      return new Element('img',{'src': avatar, 'class':'avatar'});
    },
    getActions: function() {
      var actions = new Element('div',{'class':'actions'});
      actions.insert(this.createdAt());
      actions.insert(this.transportName());
      var buttons = new Element("span", { 'class' : "buttons"});
      buttons.insert(this.permaLink());
      buttons.insert(this.quoteLink());
      buttons.insert(this.messageLink());
//      buttons.insert(this.threadLink());
      actions.insert(buttons);

      return actions;
    },
    toElement : function() {

      var container = new Element('div', {'class':this.cclass});
      var p = new Element('p');
      var av_container = new Element('div', {'class': 'avatar_container'});
      container.insert(av_container.update(this.userAvatar()));
      p.insert(this.userLink());
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
      body = body.replace('&', '&amp;').replace(/\>/gi, '&gt;').replace(/\</gi, '&lt;') ;
      body = BodyParser.justLink(body);
      body = BodyParser.userLink(body, "blip.pl/users");
      body = BodyParser.tagLink(body, "blip.pl/tags");
      return body;
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
      container.insert(this.transportName());
      return container;
    }
  });

var Message = new Class.create(
  Update,
  {
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
      var recipient_link = new Element('a', {'href':'#', 'class':'user_link'}).update(this.recipient.login);
      return recipient_link;
    },
    recipientAvatar: function(size) {
      if ( ! size) size="30";
      var avid= this.recipient.avatar ? this.recipient.avatar['url_'+size] : "";
      var avatar = "";
      if(avid != "") {
        avatar = "file://"+Application.cache_io("http://blip.pl" + avid,"av");
      }
      return new Element('img',{'src': avatar, 'class':'avatar recipient_avatar'});

    },
    getActions :function() {

      var actions = new Element('div',{'class':'actions'});
      actions.insert(this.createdAt());
      actions.insert(this.transportName());
      var buttons = new Element("span", { 'class' : "buttons"});
      buttons.insert(this.permaLink());
      buttons.insert(this.quoteLink());
      buttons.insert(this.messageLink());
      actions.insert(buttons);
      return actions;

    },
    toElement : function(){



      var container = new Element('div', {'class':this.cclass+' '+this.mclass});
      var p = new Element('p');
      var av_container = new Element('div', {'class': 'avatar_container'});
      av_container.insert(this.userAvatar());
      av_container.insert(this.recipientAvatar());
      container.insert(av_container);
      p.insert(this.userLink());
      p.insert(this.separator);
      p.insert(this.recipientLink());
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
var TwitterBlip = new Class.create(
  Update,
  {
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
var Notice = new Class.create(
  Update,
  {
    initialize : function($super, obj, owner_service_id) {
      $super(obj, owner_service_id);
    },
    toElement : function() {

      // TODO this is saying avatar, because eventually it will
      // render an avatar
      var container = new Element('div', {'class': this.cclass+' update'});

      var p = new Element('p');
      var av_container = new Element('div', {'class': 'avatar_container'});
      container.insert(av_container.update(this.userAvatar()));
      p.insert(this.body);
      container.insert(p);

      //container.insert(this.getActions());
      return container;
    }
  });
