// ===============================
// REQUIRED
// ===============================
var mongoose = require('mongoose');

// ===============================
// MODEL SCHEMA
// ===============================
var MoviesSchema = mongoose.Schema({
	id: String, 
	title: String, 
	img: String, 
	description: String, 
	watched: Boolean, 
	rating: String
});

var Movies = mongoose.model('Movies', MoviesSchema);

// ===============================
// ROUTE IT OUT
// ===============================

module.exports = Movies;