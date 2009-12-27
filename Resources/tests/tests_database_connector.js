var DatabaseConnectorTest = Evidence.TestCase.extend("DatabaseConnectorTest",{
	setUp : function() {
		this.test_db = Titanium.Database.open("test_db");
		var create = "CREATE TABLE IF NOT EXISTS test ( id INTEGER PRIMARY KEY, content TEXT, tag TEXT)";
		var res = this.test_db.execute(create);
		console.log(res);


	},
	tearDown : function() {
		delete this.test_db;
	}
});
