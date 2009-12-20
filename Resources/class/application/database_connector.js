var Database_Connector = new Class.create({
	initialize : function(db_name, table_name, table_object) {
	
		this.db_name = db_name;
		this.table_name = table_name;
		if (table_object) {
			this.init_table_if_needed(table_object);
		}
	},
/**
 *  @param object table_object - object literal repsresenting create statement fields and field types
 *  available field types: id, text, float, int, blob
 *  @see get_field_type() function
  *  {
 *		'id' : {field_type : 'id'},
 *		'noting' : false // NULL value field
 *		'title' : {field_type : 'text', not_null : true},
 *		'body' : {field_type : 'text', not_null : true},
 *		'category' : {field_type : 'text', not_null : false},
 *		'slug' : {field_type : 'text'},
 *  // etc
 *  }
 */
	init_table_if_needed : function(table_object) {
		var self = this;
		var sql = "CREATE TABLE IF NOT EXISTS "+this.table_name + "(";
		for(var k in table_object) {
			sql += k +" "+self.get_field_type(table_object[k])+", ";
		}
		sql += ");";

		return this.query(sql);
	},
	get_field_type : function(object) {
		var f_name ="";
		var not_null = false;
		if(object) {
			f_name = object.field_type;
			not_null = object.not_null || false;

		}
		var field_type ="";
		switch(f_name) {
			case 'id':
				field_type = "INTEGER PRIMARY KEY";
				break;
			case 'text':
				field_type = "TEXT";
				break;
			case 'float':
				field_type = "REAL";
				break;
			case 'int':
				field_type = "INTEGER";
				break;
			case 'blob':
				field_type = "BLOB";
				break;
			
			default:
				field_type = "NULL";
				not_null = false;
				break;
		}
		if (not_null) {
			field_type += " NOT NULL";
		}
		return field_type;
	},
	query : function(squery_str) {
		console.log(squery_str);
		return 'done';
		/*
		database  = Titanium.Database.open(this.db_name);
		var res = this.database.execute(squery_str);
		database.close();
		return res.rowCount();
		*/
	},
	/**
	 * @param object find object literal:
	 * {
	 *		count : "first" | "all", // optional ('all' is the default)
	 *		conditions : { field : "id", value : 1 } // optional (used in "WHERE" part of sql statemenet)
	 *	}
	 */
	find : function(object) {
		var sql = 'SELECT * FROM '+this.table_name;
		var count = "";
		var conditions = "";
		if (object.count) {
			switch(object.count) {
				case 'first':
					count += " LIMIT 1 ";
					break;
				
				default:
					count += " ";
					break;
			}
		}
		if(object.conditions) {
			conditions += " WHERE "+object.conditions.field + " = ".object.conditions.value;
		
		}
		var f_sql = sql +" " +conditions+" " +count+";";
		return this.query(f_sql);
	
	},

	/**
	 * @param object Field object literal:
	 * {
	 *	fields : {
	 *		field1 : "value1", //at least one required
	 *		field2 : "value2",
	 *		field : "value",
	 *	}
	 * }
	 */
	save : function(object) {
		var sql = "INSERT INTO "+this.table_name + " (";
		for(var key in object.fields) {
			sql += key+", ";
		}
		
		sql +=") VALUES(";
		for(var value in object.fields) {
			sql += object.fields[value]+", ";
		}
		sql+=")";

		return this.query(sql);
	},
	/**
	 * @param object Field object literal:
	 * {
	 *  id : 10,
	 *	fields : {
	 *		field1 : "value1", //at least one required
	 *		field2 : "value2",
	 *		field : "value",
	 *	}
	 * }
	 */
	update : function(object) {
			 
		var sql = "UPDATE "+this.table_name + " SET ";
		for(var key in object.fields) {
			sql += " "+key+"= "+object.fields[key]+",";
		}
		// remove last ,
		sql+=" WHERE id="+object.id;
		return this.query(sql);
	},
	'delete' : function(object) {
		var sql = "DELETE FROM "+this.table_name+" WHERE id='"+object.id+"';";
		return this.query(sql);
	
	},
	returnField : function(field) {
		return this.res.fieldByName(field);
	}
		
});
