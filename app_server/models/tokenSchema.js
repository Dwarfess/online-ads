var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

//setting the schema
var tokenScheme = new Schema({
    token: String,
    user_id:String
});
    
mongoose.model("token", tokenScheme);//create module with schema