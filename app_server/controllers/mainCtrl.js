var mongoose = require('mongoose');
var userModel = mongoose.model('user');
var tokenModel = mongoose.model('token');

//LOGIN OR CREATE NEW USER
module.exports.login = function(req, res){  
    //regular for checking login
    let regex = new RegExp(["^", req.body.email, "$"].join(""), "i");
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
                let resp = {"field":"password","message":"Wrong password"};
                res.status(422).jsonp(resp);
                console.log("Wrong password");
            }
        } else{
            let newUser = new userModel({
                name: 'User',
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
        let regexName = /^[a-zA-Z]{3,15}$/i;
        let regexEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        let regexPhone = /^$|^[+](\d{2} )[(](\d{3})[)]( \d{3})( \d{2}){2}$/;
        
        let result = {status: true, msg: []};
        if (!regexName.test(obj.name)) {
            result.status = false;
            result.msg.push({field: "name", message:"invalid name"});
        }
        if (!regexEmail.test(obj.email)) {
            result.status = false;
            result.msg.push({field: "email", message:"Email error"});
        }
        if (obj.phone) {
            if (!regexPhone.test(obj.phone)) {
                result.status = false;
                result.msg.push({field: "phone", message:"Phone error"});
            }
        } 
        return result;
    }

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
                    console.log(`User ${doc.name} was updated`);
                    res.type('application/json');
                    res.jsonp(doc);
                }); 
        } else  {
            res.status(401).send("");
        }
    });
}

