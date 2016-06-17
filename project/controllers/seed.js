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
		imdbID: "tt2294629",
		title: "Frozen",
		poster: "http://ia.media-imdb.com/images/M/MV5BMTQ1MjQwMTE5OF5BMl5BanBnXkFtZTgwNjk3MTcyMDE@._V1_SX300.jpg",
		description: "When the newly crowned Queen Elsa accidentally uses her power to turn things into ice to curse her home in infinite winter, her sister, Anna, teams up with a mountain man, his playful reindeer, and a snowman to change the weather condition.", 
		watched: false, 
		rating: "5"
	});

	var movie2 = new Movies({
		imdbID: "tt0387564",
		title: "Saw",
		poster: "http://ia.media-imdb.com/images/M/MV5BMjAyNTcxNzYwMV5BMl5BanBnXkFtZTgwMzQzNzM5MjE@._V1_SX300.jpg",
		description: "Two strangers awaken in a room with no recollection of how they got there or why, and soon discover they are pawns in a deadly game perpetrated by a notorious serial killer.", 
		watched: false, 
		rating: "4"
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