var fs = require("fs");
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

    //SAVE MOVING TASKS
module.exports.saveMoving = async function(req, res){ 
    
    await tasksModel.remove({}, async function (err) {
        if (err) return handleError(err);
    });
        
    await (list(req.body));//function receives and adds the array with tasks to mongo
            
    tasksModel.find({}, function(err, doc){
        res.type('application/json');
        res.jsonp(doc);
    });     
};

    //RESET TO DEFAULT
module.exports.reset = async function(req, res){ 

    await tasksModel.remove({}, async function (err) {
        if (err) return handleError(err);
    });
    
    let file = JSON.parse(fs.readFileSync('app_client/tasks.json', 'utf8'));
    await (list(file));//function receives and adds the array with tasks to mongo
    
    tasksModel.find({}, function(err, doc){
        res.type('application/json');
        res.jsonp(doc); 
    });      
};


    //CREATE NEW GROUP
module.exports.createGroup = async function(req, res){
    var newGroup = new tasksModel({title:req.body.title});       
    await newGroup.save(async function(err){                
        if(err) return console.log(err);
        console.log("New group was saved", req.body.title);
    });
    
    tasksModel.find({}, function(err, doc){
        res.type('application/json');
        res.jsonp(doc); 
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
                            user: doc
                           };
                
                itemModel.create(item, function (err, doc) {
                    if (err) return handleError(err);
                    res.type('application/json');
                    res.jsonp(doc);
                });
            }); 
        } else  {
            var resp = {"status":401, "field":"Unauthorized","message":"You should log in  again"};
            res.jsonp(resp);
        }
    });
};	



    //DELETE THE GROUP
module.exports.deleteGroup = async function(req, res){
    let parse_url = url.parse(req.url).query;
    let id = qs.parse(parse_url).id;

    //find the task by id and delete
    await tasksModel.remove({"_id":id}, async function(err, doc){
        console.log("The group was deleted");
    });
    
    tasksModel.find({}, function(err, doc){
        res.type('application/json');
        res.jsonp(doc); 
    });
  
};

    //DELETE THE TASK FROM THE GROUP
module.exports.deleteTask = async function(req, res){
    let parse_url = url.parse(req.url).query;
    let id = qs.parse(parse_url).id;

    await tasksModel.update({},{$pull:{"tasks":{"_id":id}}},{multi:true}, async function(err, doc){
        console.log("The task was deleted"); 
    });
    
    tasksModel.find({}, function(err, doc){
        console.log(`************* return`);
        res.type('application/json');
        res.jsonp(doc); 
    });
};

    //UPDATE TASK
module.exports.update = async function(req, res){
    
    await tasksModel.updateOne({"tasks._id": req.body._id},
                         { $set: { "tasks.$.name":req.body.name,
                                   "tasks.$.due_date":req.body.due_date,
                                   "tasks.$.description":req.body.description
                                 }}, async function(err,doc){
        console.log(`That task was updated ${req.body.name}`);
    });
    
    tasksModel.find({}, function(err, doc){
        console.log(`************* return update ${req.body.name}`);
        res.type('application/json');
        res.jsonp(doc); 
    });
};