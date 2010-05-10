var TwitterStatus = new Class.create({
  initialize : function(obj, owner_service_id, username){
    this.user = obj.user;
    this.id = obj.id;
    this.owner_service_id = owner_service_id;
    this.username = username || false;
    this.cclass = "update";
    this.body = obj.text;
    this.created_at = obj.created_at;
  },
  userLink : function() {
    var self = this;
    var ulink= new Element('a', {'href':'#', 'class': 'button', 'title' : self.user.screen_name}).update(self.user.name);
    ulink.observe('click',function(event){
    try{ 
      Titanium.Desktop.openURL('http://twitter.com/'+self.user.screen_name);
    } catch(err) { console.dir(err); }
      event.preventDefault();
    });
    return ulink;
  },
  messageLink : function() {
    var self = this;
    var link = new Element('a', {'href' : '#' , 'class' : 'msg button small'}).update("Wiadomość");
    link.observe('click', function(event) {
      interfaces[self.owner_service_id].setAreaContent("d"+self.user.screen_name,"after");
      event.preventDefault();
      });
    return link;
  },
  replyLink : function() {
    var self = this;
    var link = new Element('a', {'href' : '#' , 'class' : 'msg button small'}).update("Odpowiedz");
    link.observe('click', function(event) {
      interfaces[self.owner_service_id].setAreaContent("@"+self.user.screen_name,"append");
      // TODO implement this:
      // interfaces[self.service_id].setAreaParam("id", self.id);
      event.preventDefault();
      });
    return link;
  },
  createdAt : function() {
    return this.created_at.substr(this.created_at.indexOf(" "));
  },
  getActions: function() {

    var self = this;
    var actions = new Element('div',{'class':'actions'});
    actions.insert(self.userLink());
    actions.insert(self.permaLink());
    actions.insert(self.replyLink());
    actions.insert(self.messageLink());
    actions.insert(self.createdAt());
    return actions;
  },
  permaLink : function() {
    var self = this;
    var url = 'http://twitter.com/'+self.user.screen_name+'/status/'+self.id;
    var link = new Element('a', {'href':url,'class':'button small', 'title':self.id}).update('Link');
    link.observe('click',function(event) {
      Titanium.Desktop.openURL(url);
      event.preventDefault();
    });
    return link;
  },
  userAvatar : function(size) {
    var self = this;

    if ( ! size) size="30";
    var avatar = self.user.profile_image_url;
    return new Element('img',{'src': avatar, 'class':'avatar', 'width' : 30, 'height' : 30 });
  },
  toElement : function() {
    var self = this;
    var container = new Element('div', {'class':self.cclass});
    var p = new Element('p');
    var av_container = new Element('div', {'class': 'avatar_container'});
    container.insert(av_container.update(self.userAvatar()));
    p.insert(self.body);
//    if(self.pictures !== false) p.insert(self.updatePicture());
    container.insert(p);
    container.insert(self.getActions());
    return container;
  }

});
