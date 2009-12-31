var TwitterInterface = new Class.create(Interface, {
  initialize : function($super, container_id, service_id) {
    $super(container_id, service_id);
  },
  draw : function(updates, is_update) {
    var self = this;
    var len = updates.length;
    var dash = $(self.container_id);
    updates.reverse();
    updates.each(function(status) {
      var single_status = new TwitterStatus(status);
      dash.insert({'top' : single_status});
    });
  }
  
});
