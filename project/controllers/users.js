var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/users.js');
var Movie = require('../models/movies.js');

///Does not require User Authentication

///Index

///Create User
router.post('/', function(req,res){
	User.create(req.body, function(err,user){
		if(err){
			console.log(err);
			res.status(500).end();
		}
		res.send(true);
		
	});
});

////Requires User Authentication
router.use(passport.authenticate('jwt', { session: false }));
///Show User
router.get('/:id', function(req,res){
	User.findById(req.params.id, function(err,user){
		if (err) {
			console.log(err);
		} 
		console.log(req.params)
		res.json(user);

	});
});

///Update User
router.put('/:id/edit', function(req,res){
	User.findByIdAndUpdate(req.params.id, { username: req.body.username, password: req.body.password }, function(err,user){
		if (err) {
			console.log(err);
		}
	});
});
///Delete User
router.delete('/:id', function(req,res){
	User.findByIdAndRemove(req.params.id);
});
///Edit Movie


///Delete Movie

module.exports = router;