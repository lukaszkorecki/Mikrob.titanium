
/**
 * Class for establishing HTTP/REST connections
 * It utiilizes Titanium's native HTTPClient
 * Sort of works like JS native XHR, but has few extras - sending files and ability to specify the user agent
 * The constructor takes base API url as a param
 * @namespace app.class
 * @author Łukasz Korecki
 */
var HttpConnector = new Class.create({
	initialize : function(options) {
		this.client = Titanium.Network.createHTTPClient();
		// TODO add custom user agent
		this.headers = this.setRequestHeaders(options || {});
	},
/**
 * @param object - Object literal representing request headers (i.e{'Content-Type':'application/json'});
 */
	setRequestHeaders : function(obj) {
		var self = this;
		for (header in obj) {
			self.client.setRequestHeader(header, obj[header] );
		}

	},

/**
 * Sets Basic auth details
 *  @param string username
 *  @param string password
 */
	setUserCred : function(login, pass) {
		this.client.setBasicCredentials(login,pass);
	},
/**
 * GET request to a given resource 
 * @param string resource i.e. '/users/get/id'
 */
	get : function(url) {
		var self = this;
		self.client.onreadystatechange = function() {
			if(this.readyState == self.client.DONE) {
			
				var status = self.client.status;
				if (status>=200 && status < 400) {
					self.onSuccess(status, self.client.responseText);
				}else {
					self.onFail(status, self.client.responseText);
				}
			}
		};
			self.client.open("GET",url);
			self.client.send(null);
	},
/**
 * DELETE request to a given resource 
 * @param string resource i.e. '/users/get/id'
 */
	'delete' : function(url) {
		var self = this;
		self.client.onreadystatechange = function() {
			if(this.readyState == self.client.DONE) {
			
				var status = self.client.status;
				if (status>=200 && status < 400) {
					self.onSuccess(status, self.client.responseText);
				}else {
					self.onFail(status, self.client.responseText);
				}
			}
		};
			self.client.open("DELETE",url);
			self.client.send(null);
	},
/**
 * PUT request to a given resource 
 * @param string resource i.e. '/users/get/id'
 */
	put : function(url) {
		var self = this;
		self.client.onreadystatechange = function() {
			if(this.readyState == self.client.DONE) {
			
				var status = self.client.status;
				if (status>=200 && status < 400) {
					self.onSuccess(status, self.client.responseText);
				}else {
					self.onFail(status, self.client.responseText);
				}
			}
		};
			self.client.open("PUT",url);
			self.client.send(null);
	},
/**
 * POST request to a resource 
 * @param string resource - '/somewhere'
 * @param string data - post data to be sent
 */
	post : function(url, data) {
		var self = this;
		self.client.onreadystatechange = function() {
			if(this.readyState == self.client.DONE) {
			
				var status = self.client.status;
				if (status===200 || status ===201) {
					self.onSuccess(status, self.client.responseText);
				}else {
					self.onFail(status, self.client.responseText);
				}
			}
		};
			self.client.open("POST",url);
			self.client.send(data);
	},
/**
 * Fired when request was successfull
 * @param string http status code
 * @param string repsonseText of the HTTTPRequest
 */
	onSuccess : function(status, responseText) {},
/**
 *  Fired in case of 501, 403 etc
 * @param string http status code
 * @param string repsonseText of the HTTTPRequest
 */
	onFail : function(status, responseText) {}
});
