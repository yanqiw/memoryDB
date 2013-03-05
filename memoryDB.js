var memorydb = (function() {
	var mdb = {};
	var _tables = {};
	
	mdb.newTable = function(tableName) {
		if (_tables[tableName]) {
			return false;
		} else {
			_tables[tableName] = MDBtable.createNew();
			mdb[tableName] = _tables[tableName];
		}
	}
	
	
	
	var MDBtable = {
		createNew : function() {
			var _table = {};
			var _total = 0;
			var _counter = 0;
			var mdbtable = {};
			
			mdbtable.getAll = function(){
				var result = [];
				for(var i in _table){
					result.push(_table[i]);
				}
				return result;
			}
			
			mdbtable.getCounter = function(){
				return _counter;
			}
			
			// insert record to the table
			mdbtable.insert = function(record) {
				record._id = _generateUUID();
				record._del = false;
				_table[record._id] = record
				_total++;
				_counter++;
				return _counter;
			}
			// update the record in table
			mdbtable.updateById = function(id, u) {
				for (key in u) {
					_table[id][key] = u[key];
				}

			}

			mdbtable.getById = function(id) {
				if (_table[id]) {
					return _table[id];
				} else {
					return null;
				}
			}
			/*============================
			 // query records in table
			 // support operator: equal
			 =============================*/
			mdbtable.query = function(query) {
				var result = [];

				for (var i in _table) {
					var matchflag = true;
					//equal
					for (var key in query) {
						if (_table[i]._del || _table[i][key] != query[key]) {
							matchflag = false;
							break;
						};
					}
					// equal end
					if (matchflag)
						result.push(_table[i]);
				}

				return result;

			}
			//remove records in table
			mdbtable.removeById = function(id) {

				if (_table[id]) {
					_table[id]._del = true;
					_counter--;
					return _counter;
				}

				return false;

			}
			// index the table

			mdbtable.index = function() {

			}
			// table to JSON
			mdbtable.toJSON = function() {

			}
			// All the record in table to JSON
			mdbtable.toJSONAll = function() {

			}
			return mdbtable;
		}
	};
	
	
	// tookit
	_generateUUID = function() {
		var d = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
		});
		return uuid;
	}
	
	//return the main object
	return mdb;
}
)();
