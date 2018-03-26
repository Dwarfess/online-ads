var mongoose = require('mongoose');
var userModel = mongoose.model('user');
var tokenModel = mongoose.model('token');

//LOGIN OR CREATE NEW USER
module.exports.login = function(req, res){  
    //regular for checking login
    var regex = new RegExp(["^", req.body.email, "$"].join(""), "i");
    userModel.findOne({"email":regex}, function(err, doc){
        if(doc){
            if(doc.password == req.body.password){
                let user = {name:doc.name};
                tokenModel.findOneAndUpdate({"user_id": doc._id}, {$setOnInsert: {"token":new Date().valueOf()}}, {new: true, upsert: true},
                function(err,doc){
                    console.log(`New token wad added ${doc.token}`);
                    user.token = doc.token;
                    res.type('application/json');
                    res.jsonp(user)
                }); 
            } else  {
                var resp = {"status":422, "field":"password","message":"Wrong password"};
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


//GET THE USER DATA
module.exports.getUser = function(req, res){  

    tokenModel.findOne({"token":req.headers.authorization}, function(err, doc){
        if(doc){
            userModel.findOne({"_id":doc.user_id}, function(err, doc){
                res.type('application/json');
                res.jsonp(doc);
            }); 
        } else  {
            var resp = {"status":401, "field":"Unauthorized","message":"You should again"};
            res.jsonp(resp);
        }
    });
}


//EDIT CURRENT USER
module.exports.editUser = function(req, res){ 

    tokenModel.findOne({"token":req.headers.authorization}, function(err, doc){
        if(doc){
            userModel.findOneAndUpdate({"_id":doc.user_id},
                {$set: {"name":req.body.name,
                       "email":req.body.email,
                       "phone":req.body.phone}
                }, {new: true}, function(err,doc){
                    if(err) return console.log(err);
                    console.log(`User ${doc.name} was updated`);
                    res.type('application/json');
                    res.jsonp(doc);
                }); 
        } else  {
            var resp = {"status":401, "field":"Unauthorized","message":"You should again"};
            res.jsonp(resp);
        }
    });
}

