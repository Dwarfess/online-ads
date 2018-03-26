var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

//setting the schema
var userScheme = new Schema({
    name: String,
    email: String,
    phone: String,
    password: String
});
    
mongoose.model("user", userScheme);//create module with schema

