var DatabaseConnector = new Class.create({
	initialize : function(db_name, table_name, table_object) {
	
		this.db_name = db_name;
		this.table_name = table_name;
		if (table_object) {
			this.init_table_if_needed(table_object);
		}
		this.result = "";
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
		var sql = "CREATE TABLE IF NOT EXISTS "+this.table_name + " (";
		for(var k in table_object) {
			sql += k +" "+self.get_field_type(table_object[k])+", ";
		}
		sql = sql.truncate(sql.length-2,"");
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
	result_as_object : function(res_object) {
		var row_count = res_object.rowCount();
		var obj = new Array();
		for(var r=0;r<res_object.rowCount();r++) {
			var blank = {};
			for(var i=0; i<res_object.fieldCount(); i++) {
				blank[res_object.fieldName(i)] = res_object.fieldByName(res_object.fieldName(i));
			}
			obj.push({row : blank});
			res_object.next();
		}
		this.result.close();
		return obj;
	},
	query : function(squery_str, return_object) {
		database  = Titanium.Database.open(this.db_name);
		var res = database.execute(squery_str);
		database.close();
		this.result = res;
		if(return_object) {
			return this.result_as_object(res);
		} else {
			return res.rowCount();
		}
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
		if(object) {
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
				conditions += " WHERE "+object.conditions.field + " = '"+object.conditions.value+"' ";
			}
		}
		var f_sql = sql +" " +conditions+" " +count+";";
		return this.query(f_sql , true);
	
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
		
		sql = sql.truncate(sql.length-2,"");

		sql +=") VALUES(";
		for(var value in object.fields) {
			sql += "'"+object.fields[value]+"', ";
		}
		sql = sql.truncate(sql.length-2,"");

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
			sql += " "+key+"= '"+object.fields[key]+"', ";
		}
		sql = sql.truncate(sql.length-2,"");
		// remove last ,
		sql+=" WHERE id="+object.id;
		return this.query(sql);
	},
	remove : function(object) {
		var sql = "DELETE FROM "+this.table_name+" WHERE id='"+object.id+"';";
		return this.query(sql);
	
	},
	returnField : function(field) {
		return this.res.fieldByName(field);
	}
		
});
