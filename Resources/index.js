function run_tests() {
  var win = Titanium.UI.getCurrentWindow();
  var w2 = win.createWindow('app://test.html');
  
  w2.setHeight(20);
  w2.setWidth(20);
  w2.setResizable(false);
  w2.open();

}
// Window settings (position, size)
Titanium.API.addEventListener(Titanium.EXIT,function() { 
  Application.saveWindowSettings();
});
Titanium.API.addEventListener(Titanium.OPEN,function(event) { 
  console.dir(event);
  Application.loadWindowSettings();
});
Titanium.API.addEventListener(Titanium.CLOSE,function() { 
  Application.populateAccountSwitcher();
  Application.refreshServices();
});
// globalz
var interfaces = new Array();
// TODO this should come from the DB
var services = new Array();
var username,loop1,active_service =0;
document.observe('dom:loaded',function(){
  Application.loadWindowSettings();
  $('sender').toggle();
  $('throbber').toggle();

  Element.observe('login_form','submit',function(event){
    Application.getServices();
    if(Application.services.length === 0) {
      Application.openAddServiceWindow();
    
    } else {
      Application.refreshServices();
      Application.populateAccountSwitcher();
      active_service = 0;
      services[active_service].dashboardGet();
      interfaces[active_service].notify(Titanium.App.getName(),'Pobieram kokpit');

      var how_often = 15;
      if(services[active_service].type != 'blip') {
      how_often = 30;
      }
      loop1 = new PeriodicalExecuter(run_loop1,how_often);
      function run_loop1() {
        $('throbber').toggle();
        services[active_service].dashboardGet();
      }


      // Clean up old stuff
      Titanium.App.Properties.setString('username',"");
      Titanium.App.Properties.setString('password',"");

      this.fade();
      $('throbber').toggle();
      $('sender').toggle();
    }
    event.preventDefault();
  });
  Element.observe('sender','submit',function(event){
    event.preventDefault();
    if($F(this['content']).length <= interfaces[active_service].character_limit) {
      $('throbber').toggle();
      this.disable();
      var blyp = $F(this['content']);
      services[active_service].post(blyp);
    } else {
      yy = $F(this['content']).length - interfaces[active_service].character_limit;
      interfaces[active_service].notify("Błęd", "Treść za długa o "+yy+" znaków");
    }
  });
  Element.observe('main_textarea','keydown',function(event){
    var content = this.getValue();
    if(event.keyCode == 13) {
      content.length = content.length-1;
      if( content.length <= interfaces[active_service].character_limit){
        event.preventDefault();
        $('throbber').toggle();
        $('sender').disable();
        services[active_service].post(content);
      } else {
        interfaces[active_service].notify("Błęd", "Treść za długa o "+(content.length - interfaces[active_service].character_limit)+" znaków");
      }
    }
    $('charcount').update(content.length);
  });
  Element.observe('mark_as_read_button','click',function(event){
    event.preventDefault();
    var unread = $$('#dash'+active_service +' .unread');

    for(var i=19, l = unread.length;i<l;i++) {
      unread[i].remove();
    }
    unread.each(function(el) { el.removeClassName('unread'); } );
    interfaces[active_service].setUnreadCount('0');
  });
  Element.observe('make_private','click',function(event){
    interfaces[active_service].setAreaContent('>',true);
    $('main_textarea').toggleClassName('priv_t');
  });
  Element.observe('shorten_links','click',function(event){
    event.preventDefault();
    var content = $('main_textarea').getValue();
    console.log("tresc z element.observe.click\n\t"+content);
    interfaces[active_service].shortenLinksInString(content, services[active_service].shortenLink);

  });
  Element.observe('change_service', 'change', function(event){
    var old = active_service;
    active_service = event.target.value || 0 ;
    if(old != active_service) {
      if(active_service == 'change') {
        active_service = old;
        Application.openAddServiceWindow();
      } else {
        Application.activateService(old, active_service);
      }
    }

  });
  Element.observe('archive_button','click',function(event) {
      event.preventDefault();
      Application.openArchiveWindow('blip');
  });
});
