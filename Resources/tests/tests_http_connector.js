var HttpConnectorTest = Evidence.TestCase.extend("HttpConnectorTest",{
	setUp : function() {
		this.headers = {
			'test_header_1' : 'test_value_1',
			'test_header_2' : 'test_value_2'
		};
		this.conn = new HttpConnector();
		this.conn_headers = new HttpConnector(this.headers);
	},
	tearDown : function() {
		delete this.headers;
		delete this.conn;
		delete this.conn_headers;
	},
	// Unit tests
	"testConstructor" : function() {
	
		var connector = this.conn;
		this.assertIn("setRequestHeaders", connector);
		this.assertEqual(connector.headers , {});
	},
	"testConstructorWithParams" : function() {
		var connector = this.conn_headers;
		this.assertIn("setRequestHeaders", connector);
		this.assertEqual(connector.headers.test_header_1  , this.headers.test_header_1 );
		this.assertEqual(connector.headers.test_header_2  , this.headers.test_header_2 );

	}
		
});
