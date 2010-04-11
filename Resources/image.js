document.observe(
  'dom:loaded',
  function(){
    var image_url = Titanium.API.get('image_url');
    var loader = $('cont').down('img',0);
    var img = $('cont').down('img',1);
    img.toggle();
    img.setAttribute('src', image_url);
    function resize_window() {
      var win = Titanium.UI.getCurrentWindow();

      win.width = img.width;
      win.height = img.height;
      img.toggle();
      loader.toggle();
      win.setResizable(true);

    }
    resize_window.delay(1);


  });