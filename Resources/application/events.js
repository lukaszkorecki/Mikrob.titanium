// EVENT HANDLERS
var Events = (
  function() {
    function login_button (event) {
      Application.getServices();
      event.target.setAttribute("disabled", "disabled");
      if(Application.services.length === 0) {
        Application.openAddServiceWindow();

      } else {
        Application.refreshServices();
        Application.populateAccountSwitcher();
        active_service = 0;
        services[active_service].getUserAvatar();
        services[active_service].dashboardGet();
        interfaces[active_service].notify(Titanium.App.getName(),'Pobieram kokpit');

        // TODO make this a preference!
        var how_often = 30;
        if(services[active_service].type != 'twitter') {
          how_often = 15;
        }
        loop1 = new PeriodicalExecuter(run_loop1,how_often);
        function run_loop1() {
          interfaces[active_service].throbber.toggle();
          services[active_service].dashboardGet();
        }
        // Clean up old stuff
        Titanium.App.Properties.setString('username',"");
        Titanium.App.Properties.setString('password',"");

        $('login_form').remove();
        interfaces[active_service].throbber.toggle();

        $('input_area').toggle(); // <- this needs to be a function
        $('menubar').toggle();

      }
    }

    function sender_item(event) {
      var content = $('main_textarea').getValue();
      var len =content.length;
      if(len <= interfaces[active_service].character_limit) {
        interfaces[active_service].disableInputArea();
        interfaces[active_service].throbber.toggle();
        if(Application.attachment === "") {
          services[active_service].post(content);
        } else {
          try {
            services[active_service].postWithFile(content, Application.attachment);
          } catch(no_post_with_file) {
            alert("Nie udało się wysłać statusu w plikiem, sry");
          }
        }
        return false;
      } else {
        interfaces[active_service].notify("Błęd", "Treść za długa o "+(content.length - interfaces[active_service].character_limit)+" znaków");
      }

      if (len === 0) len=interfaces[active_service].character_limit;
      $('charcount').update(interfaces[active_service].character_limit-len);
      return true;
    }
    function main_textarea (event) {
      var content = (event.target_up || event.target).getValue();
      if(event.keyCode == 13  && services[active_service].type != 'Flaker') { // this needs to be service specific!
        content = content.replace("\n","");
        interfaces[active_service].disableInputArea();
        if( (content.length-1) <= interfaces[active_service].character_limit){
          interfaces[active_service].throbber.toggle();
          if(Application.attachment === "") {
            services[active_service].post(content);
          } else {
            try {
              services[active_service].postWithFile(content, Application.attachment);
            } catch(no_post_with_file) {
              console.dir(no_post_with_file);
            }
          }
          return false;
        } else {
          interfaces[active_service].notify("Błęd", "Treść za długa o "+(content.length - interfaces[active_service].character_limit)+" znaków");
          interfaces[active_service].enableInputArea();
        }
      }
      if(interfaces[active_service]) {
        if (content.length === 0) content.length=interfaces[active_service].character_limit;
        $('charcount').update(interfaces[active_service].character_limit-content.length);
      }

      return true;
    }

    function new_status_submit (event) {
      var target = event.target_up || event.target;
      if($F(target['content']).length <= interfaces[active_service].character_limit) {
        interfaces[active_service].throbber.toggle();
        target.disable();
        var blyp = $F(target['content']);
        services[active_service].post(blyp);
      } else {
        var yy = $F(target['content']).length - interfaces[active_service].character_limit;
        interfaces[active_service].notify("Błęd", "Treść za długa o "+yy+" znaków");
      }
    }

    function mark_as_read_button () {
      interfaces[active_service].setUnreadCount(" 0");
      $$('#dash'+active_service + ' .update').each(
        function(el, index) {
          if (el.hasClassName('unread')) {
            el.removeClassName('unread');
          }
          //if (index>19) {
          //  el.descendants().invoke('stopObserving');
          //  el.stopObserving().remove();
          //}
        });


    }

    function make_private () {
      var mt = $('main_textarea');
      if(mt.value.match(/^\>{1,}/)) {
        interfaces[active_service].setAreaContent('>',"prepend");
      } else {
        mt.value.replace(">>", ">");
      }
        mt.toggleClassName('priv_t');
    }

    function shorten_links () {
      var content = $('main_textarea').getValue();
      interfaces[active_service].shortenLinksInString(content, services[active_service].shortenLink);
    }

    function archive_button (event) {
      var target = $(event.target_up || event.target);
      if (archive_opened !== 0) {
        Application.closeArchiveWindow();
      } else {
        Application.openArchiveWindow();
      }
    }
    function preferences_button(event) {
      Application.openPreferencesWindow();
    }
    function home_button (event) {
      $('archive').hide();
      $('dash'+active_service).show();
      archive_opened = 0;
    }

    function change_service () {
      var old = active_service;
      active_service = (event.target_up || event.target).value || 0 ;
      if(old != active_service) {
        if(active_service == 'change') {
          active_service = old;
          Application.openAddServiceWindow();
        } else {
          Application.activateService(old, active_service);
        }
      }
    }

    function open_sender(event){
      Application.openSenderWindow();

    }

    function quote_link (event) {
      interfaces[active_service].setAreaContent($(event.target_up||event.target).getAttribute("data"), "append", true);

    }
    function message_link (event) {
      interfaces[active_service].setAreaContent($(event.target_up||event.target).getAttribute("data"), "before",true);

    }
    // no, it's not code duplication!
    function user_link (event) {
      var url = $(event.target_up || event.target).getAttribute("href");
      Application.openUrl(url);
    }
    function thread_link (event) {
      var url = $(event.target_up || event.target).getAttribute("href");
      Application.openUrl(url);
    }

    function tag_link (event) {
      var url = $(event.target_up || event.target).getAttribute("href");
      Application.openUrl(url);
    }

    function external_link (event) {
      var url = $(event.target_up || event.target).getAttribute("href");

      Application.openUrl(url);
    }

    function update_picture_link (event) {
      var image_url = $(event.target_up || event.target).getAttribute("href");
      image_url = Application.cache_io(image_url, "img");
      switch(Titanium.Platform.name) {
        case 'Darwin':
          (Titanium.Process.createProcess(["qlmanage", "-p", image_url ]))();
        break;
        case 'Linux':
          (Titanium.Process.createProcess(["xdg-open",  Application.cache_io(image_url, "img")]))();
        break;
        default:
          Application.openImageWindow(image_url);
        break;
      }
    }

    function quoted_link(event) {

    }
    function rdir_link(){}
    function sidebar_toggle() {
      interfaces[active_service].sidebar_toggle();
    }
    // ignore event delegation and use attached event
    function expanded_link() {
      return true;
    }
    function attach_file() {
      //      Application.attachFile();
      interfaces[active_service].attach_file();
    }
    function tray_icon() {
      var  w = Titanium.UI.getCurrentWindow();
      w.focus();
    }
    function attchmnt(event) {
      console.log("Click click!");
      $(event.target_up || event.target).toggle();
      Application.attachment = "";
      
    }
    return {
      sidebar_toggle : sidebar_toggle,
      tray_icon : tray_icon,
      login_button : login_button,
      login_form : login_button,
      main_textarea  : main_textarea ,
      sender_item : sender_item,
      new_status_submit  : new_status_submit ,
      mark_as_read_button  : mark_as_read_button ,
      make_private  : make_private ,
      shorten_links  : shorten_links ,
      archive_button  : archive_button ,
      home_button  : home_button ,
      change_service  : change_service ,
      quote_link  : quote_link ,
      message_link  : message_link ,
      user_link  : external_link ,
      thread_link  : external_link ,
      tag_link  : external_link ,
      rdir_link  : external_link,
      tagLink  : external_link ,
      quoted_link : external_link,
      external_link  : external_link ,
      special_youtube: external_link ,
      update_picture_link  : update_picture_link,
      permanent_link : external_link,
      open_sender : open_sender,
      expanded_link : expanded_link,
      attach_file : attach_file,
      tray_icon : tray_icon,
      preferences_button : preferences_button,

      attchmnt : attchmnt

    };
  }
)();

var KeyboardEvents = (
  function() {
    function navigate_over_updates(event) {
      var collection = $$('.update');

      // UP
      if(event.keyCode == 38 && (interfaces[active_service].active_entry-1 >= 0)) {
        interfaces[active_service].active_entry--;
      }
      // DOWN
      if(event.keyCode == 40 && interfaces[active_service].active_entry < (collection.length-1)) {
        interfaces[active_service].active_entry++;
      }

      $$('.active_entry').each(function(elem){ elem.removeClassName("active_entry"); });
      collection[interfaces[active_service].active_entry].scrollIntoViewIfNeeded();
      collection[interfaces[active_service].active_entry].addClassName("active_entry");
    }
    function reply_to(event) { // or quote!
      if(has_key_modifier(event)) {
        var klass = "message_link";
        if(event.shiftKey === true) {
          klass = "quote_link";
        }
        var el = $$(".update")[interfaces[active_service].active_entry].down("."+klass);
        fire(el);
      }
    }
    function expand_quoted(event) {
      if(has_key_modifier(event)) {
        var el = $$(".update")[interfaces[active_service].active_entry].down(".expanded_link",0);
        // TODO this needs to be fixed: look for #445
      }
    }
    function open_dashboard(event) {
      if(has_key_modifier(event)) {
        fire($("home_button"));
      }
    }
    function open_messages(event) {
      if(has_key_modifier(event)) {
        fire($("archive_button"));
      }
    }
    function open_preferences(event) {
      if(has_key_modifier(event)) {
        fire($("preferences_button"));
      }
    }
    function mark_all_as_read(event) {
      if(has_key_modifier(event)) {
        fire($("mark_as_read_button"));
      }
    }
    function make_private(event) {

    }
    //:private
    function fire(el){
      if(el) {
        Dispatcher( el.fire("click"));
      }
    }
    function has_key_modifier(event) {
      var os = document.body.className;

      if(os === "osx" && event.metaKey === true) {
        return true;
      }
      if((os.match(/win/i) || os.match(/linux/i)) && event.ctrlKey===true) {
        return true;
      }
      return false;
    }
    // provide
    return {
      navigate_over_updates : navigate_over_updates,
      reply_to : reply_to,
      expand_quoted : expand_quoted,
      open_dashboard : open_dashboard,
      open_messages : open_messages,
      open_preferences : open_preferences,
      mark_all_as_read : mark_all_as_read,
      make_private : make_private
    };
  }
)();
var PreferencesEvents = (
  function() {
    function delete_service(event) {
    }
    function add_service() {
    }
    return {
      delete_service : delete_service,
      add_service : add_service
    };
})();
