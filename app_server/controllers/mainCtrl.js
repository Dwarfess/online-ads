var mongoose = require('mongoose');
var userModel = mongoose.model('users');

//ADD NEW USER
module.exports.addNewUser = function(req, res){
    //regular for checking login
    var regex = new RegExp(["^", req.body.login, "$"].join(""), "i");
    
    userModel.findOne({"login":regex}, function(err, doc){
        if(doc){
            console.log("Go error");
            res.send("Error");
        } else{
            var newUser = new userModel({
                login: req.body.login,
                email: req.body.email,
                password: req.body.pass
            });
            
            newUser.save(function(err){                
                if(err) return console.log(err);
                res.send("Object is saved");
                console.log("Object is saved", newUser.login);
            });    
        }
    });	
}

module.exports.login = function(req, res){
    console.log(req.body); 
    //regular for checking login
    var regex = new RegExp(["^", req.body.email, "$"].join(""), "i");
    userModel.findOne({"email":regex}, function(err, doc){
        if(doc){
            if(doc.password == req.body.password){
                res.type('application/json');
                res.jsonp(doc);
            } else  {
                var resp = {status: 1};
                res.jsonp(resp);
                console.log("Wrong password");
            }
        } else{
            var newUser = new userModel({
                name: `User_${Math.floor(Math.random()*1000000)}`,
                email: req.body.email,
                password: req.body.password
            });
            
            newUser.save(function(err){                
                if(err) return console.log(err);
                var resp = {status: 2};
                res.jsonp(resp);
                console.log(`${newUser.name} was created`);
            });
            
            
        }
    });
}

