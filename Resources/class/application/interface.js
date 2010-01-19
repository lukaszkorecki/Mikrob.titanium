/**
 *
 * Interface singleton - manages the tabs, views, columns and single purpose windows/sections 
 * TODO this object needs to be turned into a class and service specific functions need to go to 
 * its subclasses
 * @package mikrob.class.interface
 * @author Lukasz
 */

var Interface = new Class.create({
  initialize :function(container_id, service_id) {
    this.container_id = container_id;
    this.service_id = service_id;
    this.globalLimit = 20;
    this.throbber = $('throbber');
    this.character_limit = 140;

    this.ok_image = "app://mikrob_icon_ok.png";
    this.not_ok_image = "app://mikrob_icon_error.png";

  },
  afterSend : function(resp, was_success) {
    var self =this;
    self.throbber.toggle();
    self.notify(Titanium.App.getName(),'Wysłano','ok');
    $('sender').enable();
    $('charcount').update('0');
    if (was_success)    self.setAreaContent();
  },
  notify : function(login, body,img) {
    try {
      var window = Titanium.UI.getMainWindow(); // get the main window
      var note = Titanium.Notification.createNotification(window);
      note.setTitle(services[this.service_id].login+"@"+services[this.service_id].type+": "+login); //Add the title;
      note.setMessage(body); //Add the message;
      switch(img) {
        case 'ok':
          note.setIcon(this.ok_image);
          break;
        case 'fail':
          note.setIcon(this.not_ok_image);
          break;
        default:
          if (img) {
            note.setIcon(img);
          }
          break;
      }
      note.show();//Make it appear with the default timings.
    } catch(err) {
      console.dir(err);
    } 
       
   },
    setUnreadCount : function(count_str) {
     if(count_str =='0') {
       count_str ="0";
     }
       $('unread_count').update(count_str);
       try {
          console.log(count_str);
         if(count_str=="0") {
           Titanium.UI.setBadge();
         } else {
           Titanium.UI.setBadge(count_str);
         }
       } catch (badge_err) { console.log(badge_err); }
    },
  loginFail : function() {
    console.log("LOGIN FAIL");
   // $('login_form').show();
   // $('throbber').toggle();
   // $('sender').toggle();
  },
  setAreaContent : function(string, is_prepend) {
    var mt = $('main_textarea');
    if (string) {
      var old = mt.getValue();
      if(is_prepend) {
        mt.setValue(string+old);
      } else {
        mt.setValue(old+string);
      }
      mt.focus();
    } else {
      mt.setValue("");
    }
    mt.select();
    mt.selectionEnd = mt.getValue().length;
    mt.focus();
  },
  cacheImage : function(url) {
     var home_dir = Titanium.Filesystem.getUserDirectory();
     var Sep = Titanium.Filesystem.getSeparator();
     var name = '.mikrob_img_cache';
     var img_cache_dir = home_dir+Sep+name+Sep;
  },
  getImageFromCache : function(name) {
  }

});
