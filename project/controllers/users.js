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

///Edit Movie
router.put('/:id/edit/:movie_id', function(req,res){
	console.log('testing edit movie');
	console.log(req.body);
	Movie.findByIdAndUpdate(req.params.movie_id, {watched: req.body.watched, rating: req.body.rating}, function(err,movie){
		if (err) {
			console.log(err);
		}
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

///Get Movie Data
router.get('/movies/:id/:movie_id', function(req,res){
	console.log('testing get movies route');
	console.log('this is the id:' +req.params.movie_id);
	User.findById(req.params.id, function(err,user){
		if (err) {
			console.log(err);
		}
		res.json(user.movies);
	});
});

///Create Movie
router.put('/:id/newmovie/', function(req,res){
	console.log(req.body);
	Movie.create(req.body, function(err,movie){
		console.log('-----------------------------------------------------------');
		console.log('adding movie');
		console.log('movie:');
		console.log(movie);
		if (err) {
			console.log(err);
		}
		User.findById(req.params.id, function(err,user){
			console.log('editing user');
			if (err) {
				console.log(err);
			}
			console.log(user.movies);
			console.log(req.body.title);
			user.movies.push(req.body);
			user.save();
			console.log('updated movies below');
			console.log(user.movies);
			res.send(movie);
		});
	});
});


///Delete Movie
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

module.exports = router;