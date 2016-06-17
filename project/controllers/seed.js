// ===================================
// REQUIREMENTS
// ===================================
var express = require('express');
var mongoose = require('mongoose');
var db = process.env.MONGODB_URI || "mongodb://localhost/fwaking-awesome-movies";
var router = express.Router();
var User = require('../models/users.js');
var Movies = require('../models/movies.js');

// ===================================
// SEED ROUTE AND DATA
// ===================================
router.get('/', function(req, res) {

	var user1 = new User({
	  username: 'Ada',
	  password: 'password',
	});

	var movie1 = new Movies({
		id: ,
		title: ,
		img: ,
		description: , 
		watched: , 
		rating: 
	});

	var movie2 = new Movies({
		id: ,
		title: ,
		img: ,
		description: , 
		watched: , 
		rating: 
	});

	user1.save();
	movie1.save();
	movie2.save();
	user1.movies.push(movie1);
	user1.movies.push(movie2);
	user1.save();

	console.log("=======================");
	console.log("The reaper cometh");
	console.log("=======================");
	res.end();
});

module.exports = router;