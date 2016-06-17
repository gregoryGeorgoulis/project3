// ===============================
//  REQUIREMENTS
// ===============================
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var MoviesSchema = require('./movies').schema;


// ===============================
//  MODEL SCHEMA
// ===============================
var UserSchema = mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String },
  movies: [MoviesSchema]
});

// ===============================
//  USER AUTHENTICATION STUFF
// ===============================
UserSchema.pre('save', function(next) {
	if(this.isModified('password')) {
		this.password = bcrypt.hashSync(this.password, 10);
	}
	next();
});

UserSchema.methods.authenticate = function(passwordTry) {
	return bcrypt.compareSync(passwordTry, this.password);
};

// ===============================
//  LET'S ROUTE IT OUT
// ===============================
var User = mongoose.model('User', UserSchema);
module.exports = User;