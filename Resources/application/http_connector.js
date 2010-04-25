/**
 * Class for establishing HTTP/REST connections
 * It utiilizes Titanium's native HTTPClient
 * Sort of works like JS native XHR, but has few extras - sending files and ability to specify the user agent
 * The constructor takes base API url as a param
 * @namespace app.class
 * @author Łukasz Korecki
 */
var HttpConnector = new Class.create(
  {
    initialize : function(options) {
      this.client = Titanium.Network.createHTTPClient();

      this.client.setTimeout(15000);
      // TODO add custom user agent
      this.headers = this.setRequestHeaders(options || {});
      // overrrrrrride the UA (http headers seem to have no effect)
      var ua =  Titanium.App.getName()+" "+Titanium.App.getVersion() + " ["+Titanium.App.getPublisher()+" "+Titanium.App.getID().split('.').reverse().join('.').replace('.','@',1)+"]";
      this.client.userAgent =ua;
      //    this.client.userAgent = 'deskBlip 0.7.9';

    },
    /**
     * @param object - Object literal representing request headers (i.e{'Content-Type':'application/json'});
     */
    setRequestHeaders : function(obj) {
      for (header in obj) {
        this.client.setRequestHeader(header, obj[header] );
      }
      return obj;

    },
    handleResponse : function(status,response_object) {
      switch(status) {
      case 200:
      case 201:
        this.onSuccess(status, response_object.responseText);
        break;
      case 204:
        // do nothing :-)
        break;
      case 401:
      case 403:
      case 404:
      case 500:
      case 501:
      case 503:
        this.onFail(status, response_object.responseText);
        break;
      default:
        this.onFail(status, response_object.responseText);
        break;
      }
    },

    /**
     * Sets Basic auth details
     *  @param string username
     *  @param string password
     */
    setUserCred : function(login, pass) {

      this.login = login;
      this.password = pass;
      this.client.setBasicCredentials(login,pass);
      this.client.setRequestHeader('Authorization', "Basic "+btoa(login+":"+pass));
      return btoa(login+":"+pass);
    },
    /**
     * GET request to a given resource
     * @param string resource i.e. '/users/get/id'
     */
    debug_response : function(method, url, client) {
      return true;
      console.log("HttpConnector: \n" + url + "\nmethod: "+method+"\nstatus: ");
      console.log(this.client.status + " " + this.client.statusText);
    },
    request  : function(method, url, data) {
      function state_change(client) {
        if(client.readyState == client.DONE) {
          this.handleResponse(client.status, client);
        }
      }
      this.client.onreadystatechange = state_change.bind(this);
      if(this.login && this.password) {
        this.client.open(method,url, true, this.login, this.password);
      } else {
        this.client.open(method,url);
      }
      if(data) {
              this.client.send(data);
      } else {
              this.client.send(null);
      }

    },
    get : function(url) {
      this.request("GET", url);
    },
    /**
     * DELETE request to a given resource
     * @param string resource i.e. '/users/get/id'
     */
    'delete' : function(url) {
      this.request("DELETE", url);
    },
    /**
     * PUT request to a given resource
     * @param string resource i.e. '/users/get/id'
     */
    put : function(url) {
      this.request("PUT",url);
    },
    /**
     * POST request to a resource
     * @param string resource - '/somewhere'
     * @param string data - post data to be sent - needs to be a query string and URIencoded
     */
    post : function(url, data) {
      this.request("POST", url, data);
    },

    /**
     * Fired when request was successfull
     * @param string http status code
     * @param string repsonseText of the HTTTPRequest
     */
    onSuccess : function(status, responseText, callback) {
      callback(status, responseText);
    },
    /**
     *  Fired in case of 501, 403 etc
     * @param string http status code
     * @param string repsonseText of the HTTTPRequest
     */
    onFail : function(status, responseText) {}
  });
