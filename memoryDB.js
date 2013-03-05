
/*==================
 //Construction
 // paramter:
 // records: the data for init, array
 //=================*/
function MDBtable(records){
    this.table = {};
    this.total = 0; // the total record number
    this.counter = 0; // the un-deleted record number
    if (records) {
        for (; this.counter < records.length;) {
            this.insert(records[this.counter]);
        }
    }
}


// insert record to the table
MDBtable.prototype.insert = function(record){
    record._id = generateUUID();
    record._del = false;
    this.table[record._id] = record
    this.total++;
    this.counter++;
    return this.counter;
}


// update the record in table
MDBtable.prototype.updateById = function(id,u){
	for(key in u){
		this.table[id][key]=u[key];
	}

}

MDBtable.prototype.getById = function(id){
    if (this.table[id]) {
        return this.table[id];
    }
    else {
        return null;
    }
}
/*============================
 // query records in table
 // support operator: equal
 =============================*/
MDBtable.prototype.query = function(query){
    var result = [];
    
    for (var i in this.table) {
        var matchflag = true;
        //equal
        for (var key in query) {
            if (this.table[i]._del || this.table[i][key] != query[key]) {
                matchflag = false;
                break;
            };
                    }
        // equal end			
        if (matchflag) 
            result.push(this.table[i]);
    }
    
    
    return result;
    
}

//remove records in table
MDBtable.prototype.removeById = function(id){

    if (this.table[id]) {
        this.table[id]._del = true;
        this.counter--;
        return this.counter;
    }
    
    return false;
    
}

// index the table

MDBtable.prototype.index = function(){

}

// table to JSON
MDBtable.prototype.toJSON = function(){
	
}

// All the record in table to JSON
MDBtable.prototype.toJSONAll = function(){
	
}

/*==================
 //tookit
 //
 //
 //=================*/
function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
};
