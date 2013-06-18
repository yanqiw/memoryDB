//version 0.0.3
var memorydb = (function() {
	var mdb = {};
	var _tables = {};

	mdb.newTable = function(tableName) {
		if (_tables[tableName]) {
			return false;
		} else {
			_tables[tableName] = _MDBtable.createNew();
			mdb[tableName] = _tables[tableName];
		}
	}

	var _MDBtable = {

		createNew: function() {
			var _table = {};
			var _total = 0;
			var _counter = 0;
			var mdbtable = {};

			//Get all the non-deleted records
			mdbtable.getAll = function() {
				var result = [];
				for (var i in _table) {
					if (!_table[i]._del) {
						result.push(_table[i]);
					}
				}
				return result;
			}

			//Get all the records in the table include the deleted ones
			mdbtable.getAllWithDel = function() {
				var result = [];
				for (var i in _table) {
					result.push(_table[i]);
				}
				return result;
			}

			mdbtable.getCounter = function() {
				return _counter;
			}

			// insert records to the table
			mdbtable.insert = function(records) {
				if (_isArray(records)) {
					for (var i in records) {
						this._insertSingle(records[i]);
					}
				} else {
					this._insertSingle(records);
				}

			}

			// insert one record to the table
			mdbtable._insertSingle = function(record) {
				record._id = _generateUUID();
				record._del = false;
				_table[record._id] = record
				_total++;
				_counter++;
				return _counter;
			}
			// update the record in table by UID
			mdbtable.updateById = function(id, u) {
				for (key in u) {
					_table[id][key] = u[key];
				}

			}

			// get one record by UID
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
					var matchflag = false;

					//equal
					// for (var key in query) {
					// 	if (!_table[i]._del && _table[i][key] == query[key]) {
					// 		matchflag = true;
					// 		break;
					// 	};
					// }
					matchflag = this._paresQuery(query, _table[i]);

					if (matchflag)
						result.push(_table[i]);
				}

				return result;

			}

			//pares query
			mdbtable._paresQuery = function(query, doc) {
				var matchflag = true;
				var breakfor = false;
				for (var key in query) {
					switch (key) {
						case "$or":
						case "$and":
						case "$not":
							if (!this._operator(key, query[key], doc)) {
								matchflag = false;
								breakfor = true;
							};
							break;
						case "$gt":
						case "$lt":
						case "$in":
							if (!this._comparision(key, query[key], doc)) {
								matchflag = false;
								breakfor = true;
							}
							break;
						default:
							if (!this._equal(key, query[key], doc)) {
								matchflag = false;
								breakfor = true;
							}
							break;
					}
					if (breakfor) {
						break;
					}
				}
				return matchflag;
			}
			// handle the comparison in the query $all, $gt, $gte, $in, $lt, $lte, 

			mdbtable._comparision = function(operator, condations, doc) {
				var matchflag = false;
				switch (operator) {
					case "$in":
						for (var key in condations) {
							if (_isArray(condations[key])) {
								for (var i = 0; i < condations[key].length; i++) {
									if (this._equal(key, condations[key][i], doc)) {
										matchflag = true;
										break;
									}
								}
							}
						}
						break;
					default:
					break;
				}

				return matchflag;
			}

			// handle the operator in the query $and, $or, $not
			mdbtable._operator = function(operator, condations, doc) {
				var matchflag = false;
				switch (operator) {
					case "$or":
						for (var key in condations) {
							if (key.indexOf("$") == 0) {
								if (this._operator(key, condations[key], doc)) {
									matchflag = true;
								}
							} else if (this._equal(key, condations[key], doc)) {
								matchflag = true;
							}

						}

						break;
					case "$and":
						matchflag = true;
						for (var key in condations) {
							if (key.indexOf("$") == 0) {
								if (!this._operator(key, condations[key], doc)) {
									matchflag = false;

								}
							} else if (!this._equal(key, condations[key], doc)) {
								matchflag = false
							}


						}
						break;
					case "$not":
						for (var key in condations) {
							if (key.indexOf("$") == 0) {
								if (!this._operator(key, condations[key], doc)) {
									matchflag = true;

								}
							} else if (!this._equal(key, condations[key], doc)) {
								matchflag = true
							}
						}
						break;

				}

				return matchflag;

			}

			// handle the equal in query
			mdbtable._equal = function(key, condation, doc) {
				var matchflag = false;
				if (!doc._del && doc[key] == condation) {
					matchflag = true;
				};
				return matchflag;
			}

			// handel the reqular in query
			mdbtable._regular = function() {

			}


			//remove records in table by UID
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
	// generate the 32 bits UID
	_generateUUID = function() {
		var d = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
		});
		return uuid;
	}

	// Is array

	function _isArray(o) {
		return Object.prototype.toString.call(o) === '[object Array]';
	}

	// Is RegExp

	function _isRegExp(o) {
		return Object.prototype.toString.call(o) === '[object RegExp]';
	}

	//return the main object
	return mdb;
})();
