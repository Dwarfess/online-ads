var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

//setting the schema
var itemScheme = new Schema({
    title: String,
    tasks: [{
        name: String,
        due_date: { type: Date, default: Date.now },
        description: String
    }]
});
    
mongoose.model("item", itemScheme);//create module with schema
