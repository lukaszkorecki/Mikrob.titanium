/*
  	@usage
		
		eg. 1:
			var notification = new Notification("Message title", "Message box");
			notification.show();

			notification.onclick = function(){
				alert('Notification clicked');
			};

			//and hide the notification after 1500 ms
			setTimeout(function(){
				notification.hide();
			}, 1500);

		eg. 2:
			var template = "<h1><span id='title'></span></h1><p><span id='message'></span></p>";
			var notification = new Notification(title, message, template);
			notification.show();

	@info - made some changes to be used with Prototype/Scriptaculous by Łukasz Korecki
		

*/
function Notification(title, message, template){
	this.title = title;
	this.message = message;
	if(!template){  //if template is not provided
		//template = "<div style='border:1px solid black;background:white;padding:10px;-webkit-border-radius:10px;margin:10px;-webkit-box-shadow: 0px 0px 10px #000'>" +
		template = "<div id=\"notification\" >" +
						"<h1><span id='title'></span></h1>" + 
						"<p><span id='message'></span></p>" +
				   "</div>";
	}
	this.template = template;
	this.width = 300;
	this.height = 100;
	this.margin = 40;
	this.proxy = {};
}

Notification.prototype = {
	/* 
		@public 
		Shows a notification message in a window on the upper right corner of the main screen.
		
		@api_used
			* air.Screen.mainScreen.visibleBounds:
				@docs http://livedocs.adobe.com/labs/air/1/jslr/flash/display/Screen.html
			* air.NativeWindowInitOptions:      
				@docs  http://livedocs.adobe.com/labs/air/1/jslr/flash/display/NativeWindowInitOptions.html 
			* air.HTMLLoader.createRootWindow:
				@docs http://livedocs.adobe.com/labs/air/1/jslr/flash/html/HTMLLoader.html

		@see_also There is an example at the top of the file that explains how to use the "show" and "hide" functions .				
	*/
	show: function(){
        if(this.htmlLoader){
			//We already have a window created. Just replace the text.
			var self = this;
			this.fadeOut(function(){
				self.injectMessage();
			});
		}else{
			var visibleBounds = air.Screen.mainScreen.visibleBounds;

			var bounds = new air.Rectangle(
					/* left */ visibleBounds.right - this.width - this.margin, 
					/* top */ this.margin,
					/* width */ this.width,
					/* height */ this.height);

			//this is how we tell the runtime what kind of window we want
			//in this particular case, a transparent one is needed
			var options = new air.NativeWindowInitOptions();
			options.transparent = true;
			//transparent windows must have the systemChrome set to none
			options.systemChrome = air.NativeWindowSystemChrome.NONE;

			this.htmlLoader = air.HTMLLoader.createRootWindow( 
					false, //hidden 
					options, 
					false, //no scrollbars
					bounds);

			var self = this;

			this.htmlLoader.addEventListener(air.Event.COMPLETE, function(){
				 // Remove the complete event, as it is also called when the window is closed 
				 self.htmlLoader.removeEventListener( air.Event.COMPLETE, arguments.callee );

				 // Put the title and message into the elements and also resize the window to have
				 // the entire message in view
				 self.injectMessage();

				 // Ready to make the window visible
				 self.htmlLoader.stage.nativeWindow.visible = true;
			});

			// When the paintsDefaultBackground = false, the runtime makes the body background transparent.
			this.htmlLoader.paintsDefaultBackground = false;

			var html ='<html><head><script src="lib/prototype.js" type="text/javascript" charset="utf-8"></script><script src="lib/scriptaculous.js" type="text/javascript" charset="utf-8"></script><style> #notification {border:5px solid #eee; background-image:url(icons/deadline_128x128.png); background-repeat:no-repeat; background-position:10px 10px; background: black; -webkit-border-radius: 10px;	color:#eee;	padding:10px;border:1px solid black;padding:10px;	margin:10px;	-webkit-box-shadow: 0px 0px 10px #000 }	</style></head><body>'+this.template+'</body></html>';
			// Inject the template in the htmlLoader
			this.htmlLoader.loadString(
					   html);
			// add the onclick handler
			this.htmlLoader.addEventListener("click", function(){
				if(self.onclick){
					self.onclick();
				}
			});
			
			
			// We should close all the notifications when the window is closing
			this.windowCloseEvent = function(){
				self.close();
			};
			
			window.addEventListener('unload', this.windowCloseEvent);
		}
	},  
	
	/* 
		@public
		Hides the notification window. You should call this to close the notification message.
		@see_also There is an example at the top of the file that explains how to use the "show" and "hide" functions .
	*/
	hide: function(){
		if(this.htmlLoader){
			var self = this;
			this.fadeOut(function(){
				self.close();
			});
		}
	},            
	
	/*
	 	@internal 
	    Puts the title and message strings in the created window and shows the window.
	*/
	injectMessage: function(){
		var titleElement = this.htmlLoader.window.document.getElementById("title");
		var messageElement = this.htmlLoader.window.document.getElementById("message");

	    if(titleElement) titleElement.innerHTML = this.title;
		if(messageElement) messageElement.innerHTML = this.message;
			
		//Adjust the height in order to have the whole message inside
		this.htmlLoader.stage.nativeWindow.height = this.htmlLoader.window.document.height;
		
		//inject the opener and the proxy object (not essential, but nice to have)
		this.htmlLoader.window.proxy = this.proxy;
		this.htmlLoader.window.opener = window;
		
		this.fadeIn();
	},
	
	
	/*
	  	@internal
		Uses mootools animations to fade in the window. Document's body CSS opacity property is used to 
		make the window transparent. 
		There is another way of doing this, by fading the htmlLoader.opacity.
	*/
	fadeIn: function(){
	 // do nuthin
	},
	/*
	  	@internal
		Reverses the fadeIn function, but this time also calls the callback after it finishes
	*/
	fadeOut: function(callback){
		callback();
	}, 
	/*
		@internal
		Closes the nativeWindow and deletes the reference to it, so the runtime can carbage collect it.
		It's called when the fade out animation finishses. 
	*/
	close: function(){
        window.removeEventListener('unload', this.windowCloseEvent);
        if(this.htmlLoader){
			this.htmlLoader.stage.nativeWindow.close();
			this.htmlLoader = null;
		}   	
	}, 
	/*
		@public
		Should be overriden by the user.
	*/	
	onclick: function(){
		
	}
};
