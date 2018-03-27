var fs = require("fs");
var formidable = require('formidable');
var url = require('url');
var qs = require("querystring");

var mongoose = require('mongoose');
var userModel = mongoose.model('user');
var tokenModel = mongoose.model('token');
var itemModel = mongoose.model('item');

    //GET ALL ITEMS
module.exports.searchItems = function(req, res){ 
    let parse_url = url.parse(req.url).query;
    let title = qs.parse(parse_url).title;
    let user_id = qs.parse(parse_url).user_id;
    let order_by = qs.parse(parse_url).order_by;
    let order_type = qs.parse(parse_url).order_type;
    
    let find = title ? {"title":title} : {};
    let order = (order_type == "asc") ? 1 : -1;  
    if (user_id != "") find.user_id = user_id;

    let sort = null;
    switch (order_by) {
        case "created_at": sort = {created_at: order};break;
        case "price": sort = {price: order};break;
    }

    itemModel.find(find, null,{sort: sort}, function(err, doc){
        res.type('application/json');
        res.jsonp(doc);
    });    
};


    //GET ITEM BY ID
module.exports.getItemById = function(req, res){ 
    itemModel.findOne({_id:req.params.id}, function(err, doc){
        if(doc){
            res.type('application/json');
            res.jsonp(doc);
        } else {
            res.status(404).send("");
        }
    });    
};


    //GET ALL THE USER ITEMS
module.exports.getUserItems = function(req, res){ 
    itemModel.find({user_id:req.params.id}, function(err, doc){
        if(doc){
            res.type('application/json');
            res.jsonp(doc);
        } else {
            res.status(404).send("");
        }
    });    
};

    //ADD NEW ITEM
module.exports.createItem = function(req, res){ 
    tokenModel.findOne({"token":req.headers.authorization}, function(err, doc){
        if(doc){
            userModel.findOne({"_id":doc.user_id}, function(err, doc){
                
                let item = {title: req.body.title,
                            price: req.body.price,
                            user_id: doc._id,
                            image: '',
                            user: doc
                           };
                
                itemModel.create(item, function (err, doc) {
                    if (err) return handleError(err);
                    res.type('application/json');
                    res.jsonp(doc);
                });
            }); 
        } else  {
            let resp = {"field":"title","message":"Title is required"};
            res.status(422).jsonp(resp);
        }
    });
};

    //UPDATE ITEM
module.exports.updateItem = function(req, res){
    //find token
    tokenModel.findOne({"token":req.headers.authorization}, function(err, doc){
        if(doc){
            let user_id = doc.user_id;
            //find item
            itemModel.findOne({_id:req.params.id}, function(err, doc){
                if(doc){
                    if(user_id==doc.user_id){//check owner the ad
                        itemModel.findOneAndUpdate({_id:req.params.id},
                            {$set: {"title":req.body.title,
                                   "price":req.body.price}
                            }, {new: true}, function(err,doc){
                                console.log(`Item ${doc.title} was updated`);
                                res.type('application/json');
                                res.jsonp(doc);
                            });
                    } else {
                        res.status(403).send("");
                    }
                } else {
                    res.status(404).send("");
                }
            });  
        } else  {
            res.status(401).send("");
        }
    });
};

//DELETE ITEM
module.exports.deleteItem = function(req, res){

    tokenModel.findOne({"token":req.headers.authorization}, function(err, doc){
        if(doc){
            let user_id = doc.user_id;
            //find item
            itemModel.findOne({_id:req.params.id}, function(err, doc){
                if(doc){
                    if(user_id==doc.user_id){//check owner the ad
                        itemModel.remove({"_id":req.params.id}, function(err, doc){
                            res.status(204).send(""); 
                        });
                    } else {
                        res.status(403).send("");
                    }
                } else {
                    res.status(404).send("");
                }
            });  
        } else  {
            res.status(401).send("");
        }
    });
};


    //ADD IMAGE TO ITEM
module.exports.uploadImage = function(req, res){ 
    
    tokenModel.findOne({"token":req.headers.authorization}, function(err, doc){
        if(doc){
            let user_id = doc.user_id;
            //find item
            itemModel.findOne({_id:req.params.id}, function(err, doc){
                if(doc){
                    if(user_id==doc.user_id){//check owner the ad
                        
                        var form = new formidable.IncomingForm();
                        form.parse(req, function (err, fields, files) {
                            if(files.file){
                                var oldpath = files.file.path;
                                var newpath = './app_client/img/' + files.file.name;
                                fs.rename(oldpath, newpath, function (err) {
                                    //if (err) throw err;

                                    itemModel.findOneAndUpdate({_id:req.params.id},
                                    {$set: {"image":'img/' + files.file.name}
                                    }, {new: true}, function(err,doc){
                                        console.log(`Image was added from ${doc.title}`);
                                        res.type('application/json');
                                        res.jsonp(doc);
                                    });

                                });
                            } else {
                                let resp = {"field":"image","message":"At first choose some image"};
                                res.status(422).jsonp(resp);
                            }
                        });
                    } else {
                        res.status(403).send("");
                    }
                } else {
                    res.status(404).send("");
                }
            });  
        } else  {
            res.status(401).send("");
        }
    });
}

//DELETE IMAGE
module.exports.deleteImage = function(req, res){

    tokenModel.findOne({"token":req.headers.authorization}, function(err, doc){
        if(doc){
            let user_id = doc.user_id;
            //find item
            itemModel.findOne({_id:req.params.id}, function(err, doc){
                if(doc){
                    if(user_id==doc.user_id){//check owner the ad
                        itemModel.findOneAndUpdate({_id:req.params.id},
                            {$set: {"image":""}
                            }, {new: true}, function(err,doc){
                                console.log(`Image was deleted from ${doc.title}`);
                                res.status(204).send("");
                            });
                    } else {
                        res.status(403).send("");
                    }
                } else {
                    res.status(404).send("");
                }
            });  
        } else  {
            res.status(401).send("");
        }
    });
};