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
	User.findByIdAndRemove(req.params.id, function(err,user) {
		if (err) {
			console.log(err);
		}
		for (i = 0; i < user.movies.length; i++){
			Movie.findByIdAndRemove(user.movies[i].id, function(err,movie){
				if (err) {
					console.log(err);
				}
			}); 
		}
	});
});

///Delete Movie
<<<<<<< HEAD

=======
router.delete('/:id/delete/:movie_id', function(req,res){
	User.findBy(req.params.id).then(function(user){
		user.movies.forEach(function(movie){
			var index = user.movies.indexOf(movie);
			user.movies.splice(index,1);
			user.save();
		});
	});
	Movie.findByIdAndRemove(req.params.movie_id);
});
<<<<<<< HEAD
>>>>>>> user-controller
=======
>>>>>>> fb5a34d2c0179e2980e8ce678f8eaf8f2474f7f9
>>>>>>> index-html
module.exports = router;