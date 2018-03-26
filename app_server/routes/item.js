var express = require('express');
var router = express.Router();
var app = express();

var itemCtrl = require('../controllers/itemCtrl');

router.get('/api/item', itemCtrl.searchItems);//get all the tasks
//router.get('/api/reset', productCtrl.reset);//reset to default
//
//router.post('/api/saveMoving', tasksCtrl.saveMoving);//save moving tasks 
//router.post('/api/group', tasksCtrl.createGroup);//create new group
//router.post('/api/task', tasksCtrl.createTask);//create new task
//
//router.delete('/api/deleteGroup', tasksCtrl.deleteGroup);//delete the group
//router.delete('/api/deleteTask', tasksCtrl.deleteTask);//delete the task
//
//router.put('/api/update', tasksCtrl.update);//update the task



module.exports = router;
