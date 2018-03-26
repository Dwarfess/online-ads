var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

//setting the schema
var itemScheme = new Schema({
    created_at: { type: Date, default: Date.now },
    title: String,
    price: Number,
    image: String,
    user_id: String,
    user: {
        _id: String,
        name: String,
        email: String,
        phone: String,
        password: String
    }
});
    
mongoose.model("item", itemScheme);//create module with schema
