var express = require('express');
var router = express.Router();

var mainCtrl = require('../controllers/mainCtrl');


router.post('/api/login', mainCtrl.login);//check user and login or create new user
router.get('/api/me', mainCtrl.getUser);//get the user
router.patch('/api/me', mainCtrl.editUser);//edit current user

module.exports = router;
