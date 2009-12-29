var HttpConnectorTest = Evidence.TestCase.extend("HttpConnectorTest",{
	setUp : function() {
		this.t_headers = {
			'testheader1' : 'testvalue1',
			'testheader2' : 'testvalue2'
		};
		this.conn = new HttpConnector();
		this.conn_headers = new HttpConnector(this.t_headers);
		this.ua = Titanium.App.getName()+" "+Titanium.App.getVersion();
		this.login = 'test';
		this.pass = 'test1';
		this.cred = btoa(this.login+":"+this.pass);
	},
	tearDown : function() {
		delete this.t_headers;
		delete this.conn;
		delete this.conn_headers;
		delete this.ua;
	},
	// Unit tests
	"testConstructor" : function() {
		var x = {};
		this.assertIdentical(this.conn.headers.length, x.length);
		this.assertIdentical(this.conn_headers.headers.length, this.t_headers.length);
	},
	"testConstructorWithParams" : function() {
		this.assertIdentical(this.conn_headers.headers.length, this.t_headers.length);
	},
	"testUserAgent" : function() {
		var connector_ua = this.conn.client.userAgent;
		this.assertEqual(connector_ua, this.ua);
	},
	"testSetUserCred" : function() {
		var connector = this.conn;
		this.assertEqual(connector.setUserCred('test', 'test1'), this.cred);

	}

		
});
