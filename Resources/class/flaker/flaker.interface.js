var FlakerInterface = new Class.create(Interface, {
initialize : function($super, container_id, service_id) {
  $super(container_id, service_id);
  this.character_limit = 1000;
},
draw : function(updates, is_update) {
    var self = this;
    var len = updates.length;
    var dash = $(self.container_id);

    if(is_update !==0) updates.reverse();
    updates.each(function(single, index){
      var flak = new Flak(single);
      dash.insert({top: flak});
      if (index < 5 ) {
        var av =  'app://icons/nn_nano.png';
        if(flak.user.avatar) {
          av = flak.user.avatar;
        }
        self.notify(flak.user.login, flak.raw_body, av );
        flak = null;
      }
    });

    if (  is_update ===0) {
      self.setUnreadCount('0');
    } else {
      var unr = $$('#'+self.container_id + ' .unread').length;
      self.setUnreadCount(""+unr);

    }
    self.throbber.toggle();

}
    });
