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

    function resize_to (size) {
      var win = Titanium.UI.getCurrentWindow();
      var h = img.naturalHeight * (size / 100);
      var w = img.naturalWidth * (size/100);
      img.setAttribute("width",w );
      img.setAttribute("height",h );
      console.log(size);
      console.dir(img);
      win.width = w;
      win.height = h;
      win.setResizable(true);
    }
    // attach events
    ["img_25", "img_50", "img_75","img_100"].each(
      function(el){

        $(el).observe("click", function(){
                        var siz = el.split("_").last();
                        resize_to(siz);
                      });
      });

  });