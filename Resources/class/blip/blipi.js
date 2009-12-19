
/**
 * Simple Class for communicating with Blipi.pl (blip.pl search engine and data aggregator)
 * Kudos to Marek Foss -> http://blipi.pl/ | http://www.marekfoss.org/
 *
 */
var Blipi = new Class.create({
	/**
	 * Constructor
	 * @param string ApiKey
	 */
	initialize : function(api_key) {
		this.api_key = api_key;
	
	},

	/**
	 * Api root
	 */
	api_root : 'http://api.blipi.pl/',

	/**
	 * Success handler - needs to be defined from outside
	 * @param string http response code (201 etc)
	 * @param string encoded JSON object (needs to be parsed)
	 */
	onSuccess : function(status, response) {
		console.log(status);
		console.log(response);
	},
	/**
	 * Failure handler - needs to be defined from outside
	 * @param string http response code (404 etc)
	 * @param string encoded JSON object (needs to be parsed)
	 */
	onFailure : function(status, response) {
		console.log(status);
		console.dir(Titanium.JSON.parse(response));
	},
	/**
	 * Retrieves user rank in Blipi Stats
	 * @param string user's blip login for example 'plugawy'
	 * @return null responds via onSuccess/onFailure callback
	 */
	userRank : function(user_name) {
		var url = this.api_root+this.api_key+'/minirank/'+user_name;
		req = new HttpConnector();
		req.get(url);
		req.onSuccess = this.onSuccess;
		req.onFailure = this.onFailure;
	},

	/**
	 * Retrieves user's follower count
	 * @param string user's blip login for example 'plugawy' (sadly - I don't have many followers :/)
	 * @return null responds via onSuccess/onFailure callback
	 */
	followerCount : function(user_name) {
		var url = this.api_root+this.api_key+'/licznik/'+user_name;
		req = new HttpConnector();
		req.get(url);
		req.onSuccess = this.onSuccess;
		req.onFailure = this.onFailure;

	},

	/**
	 *  The allmighty search (blip.pl is missing that thing)
	 *  @param string search term ('zupki chińskie')
	 *  @return null responds via onSuccess/onFailure callback
	 */
	search : function(term) {
		var s_term = encodeURIComponent(term);
		var url = this.api_root+this.api_key+'/szukaj/'+s_term;
		req = new HttpConnector();
		req.get(url);
		req.onSuccess = this.onSuccess;
		req.onFailure = this.onFailure;
	}

});
