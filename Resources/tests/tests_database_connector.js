var DatabaseConnectorTest = Evidence.TestCase.extend("DatabaseConnectorTest",{
	setUp : function() {
		this.test_db = new DatabaseConnector('test', 'test_table', { 
				id : { field_type : 'id'},
				content : { field_type : "text"},
				tag : { field_type : "text"},
				hit_count : { field_type : "int", not_null : true }
			});

		this.test_db.save({
				fields : { 
					content : "test content yaknow",
					tag : "tea",
					hit_count : 10
				}
			});
		this.test_db.save({
				fields : { 
					content : "zażółć gęślą jaźń",
					tag : "polish",
					hit_count : 2
				}
			});
		this.test_db.save({
				fields : { 
					content : "test",
					tag : "test",
					hit_count : 0
				}
			});
		console.log(this.test_db.find().length);

	},
	tearDown : function() {
		this.test_db.query('drop table test_table');
		delete this.test_db;
	},
	testFindAll : function() {
		var res = this.test_db.find();
		this.assertEqual(res.length, 3);
	},
	testFindFrist: function() {
		var res = this.test_db.find({ count : 'first' });
		this.assertEqual(res.length, 1);
	},
	testFindCondition : function() {
		var res = this.test_db.find({ conditions : { field : 'id', 'value' : 1 }});
		this.assertEqual(res[0].row.id, 1);
		this.assertEqual(res[0].row.tag, 'tea');
		this.assertEqual(res[0].row.hit_count, 10);
		res = this.test_db.find({ conditions : { field : 'id', 'value' : 2 }});
		this.assertEqual(res[0].row.id, 2);
		this.assertEqual(res[0].row.tag, 'polish');
		this.assertEqual(res[0].row.hit_count, 2);
	},
	testSave : function() {
		this.test_db.save({
				fields : { 
					content : "test",
					tag : "test",
					hit_count : 0
				}
			});
		this.assertEqual(this.test_db.find().length, 4);
		this.assertEqual(this.test_db.find()[3].row.hit_count, 0);
	},
	testUpdate : function() {
		this.test_db.update({
			id : 1,
			fields : {
				hit_count : 100
			}
		});
		var res = this.test_db.find({ conditions : { field : 'id', value : 1 }});
		this.assertEqual(res[0].row.hit_count, 100);
		this.assertEqual(res[0].row.tag, 'tea');
	},
	testDelete : function() {
		this.test_db.remove({ id : 1});
		var res = this.test_db.find();
		this.assertEqual(res.length, 2);
		this.assertEqual(res[0].row.id, 2);
		this.assertEqual(res[1].row.id, 3);
	}
});
