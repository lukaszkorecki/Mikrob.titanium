// delgate actions select to main dispatcher

function Dispatcher(event){
	var element = $(event.target);
	// get the id of clicked element
	var id = element.identify();
	// if the clicked element doesn't have an id
	// i.e. is an "anon" element, use the last class name
	// by convention it works as a id
	if(id.startsWith("anonymous_")) {
		id = element.className.strip().split(" ").last();
	}
	// if it's an image for the link, fix the id
	if(id.endsWith("_img") ) {
		id = id.replace("_img", "");
		event.target_up = event.target.up();
	}
	// now... DISPATCH! ;-)
	if(Events[id] !== undefined) {
		Events[id](event);
	} else {
		console.log("No such function: Events." + (id || "missing id"));
	}
  if(event.type == "keydown") {
    return true;
  } else {
	  event.preventDefault();
    return false;
  }

}
