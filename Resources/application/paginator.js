function setup() {

  Element.observe('home_link','click',function(event) {
    services[active_service].dashboard_last_id=0;
    services[active_service].dashboardProcess = interfaces[active_service].draw;
    services[active_service].dashboardGet();
    event.preventDefault();
    $('current_page').update();
    loop1 = new PeriodicalExecuter(run_loop1,10);
    function run_loop1() {
      $('throbber').toggle();
      services[active_service].dashboardGet();
    }
  });
  Element.observe('next_page','click',function(event) {
    loop1.stop();
    event.preventDefault();
    services[active_service].dashboardProcess = interfaces[active_service].drawPage;
    services[active_service].dashboard_last_id=0;
    services[active_service].current_page = services[active_service].current_page + 1;
    var p =services[active_service].current_page;
    console.log(p);
    console.log(services[active_service].current_page);
    services[active_service].dashboardGet(p);
    $('current_page').update("Strona: "+p);
    console.log(services[active_service].current_page);
  });
  Element.observe('previous_page','click',function(event) {
    loop1.stop();
    event.preventDefault();
    services[active_service].dashboardProcess = interfaces[active_service].drawPage;
    services[active_service].dashboard_last_id=0;
    services[active_service].current_page = services[active_service].current_page - 1;
    var p =services[active_service].current_page;
    console.log(p);
    console.log(services[active_service].current_page);
    $('current_page').update("Strona: "+p);
    services[active_service].dashboardGet(p);
    console.log(services[active_service].current_page);
  });
}
