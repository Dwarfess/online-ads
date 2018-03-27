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
                var resp = {"field":"password","message":"Wrong password"};
                res.status(422).jsonp(resp);
                console.log("Wrong password");
            }
        } else{
            var newUser = new userModel({
                name: `User_${Math.floor(Math.random()*1000000)}`,
                email: req.body.email,
                password: req.body.password
            });
            
            userModel.create(newUser, function (err, doc) {
                let user = {name:doc.name};
                tokenModel.findOneAndUpdate({"user_id": doc._id}, {$setOnInsert: {"token":new Date().valueOf()}}, {new: true, upsert: true},
                function(err,doc){
                    console.log(`New token wad added ${doc.token}`);
                    user.token = doc.token;
                    res.type('application/json');
                    res.jsonp(user);
                }); 
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
            res.status(401).send("");
        }
    });
}


//EDIT CURRENT USER
module.exports.editUser = function(req, res){ 
    function checkParams(obj) {
        let result = {status: true, msg: []};
        if (obj.name.length < 3) {
            result.status = false;
            result.msg.push({field: "name", message:"Name error"});
        }
        if (obj.email.length < 3) {
            result.status = false;
            result.msg.push({field: "email", message:"Email error"});
        }
        if (obj.phone.length < 3) {
            result.status = false;
            result.msg.push({field: "phone", message:"Phone error"});
        }
        return result;
    }
    console.log(req);
    let chk = checkParams(req.body);
    console.log(chk);
    if (!chk.status) {
        res.status(422).jsonp(chk.msg);
        return;
    }
    
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
            res.status(401).send("");
        }
    });
}

