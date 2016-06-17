var express = require('express');
var router = express.Router();
var passport = require('../config/passport.js');
var User = require('../models/users.js');
var jwt = require('jsonwebtoken');

router.use(passport.initialize());
//this is the route that needs to be hit to run auth
router.post('/', passport.authenticate('local', { session: false }), function(req, res, next) {
	console.log('vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv');
	console.log(req.user.username + ' has logged in');
	

	//thid is the jwt token being set to a cookie
	var token = jwt.sign(req.user, process.env.JWT_SECRET, {
		expiresIn: 1440 
	});
	// i am setting cookies over here for the user's id and username
	var grabName = req.user.username;
	var grabId = req.user._id;
	res.json({ token: token,id:grabId, username: grabName });
});

module.exports = router;