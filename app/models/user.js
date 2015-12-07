var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
	name: String,
	lastname: String,
	password: String,
	email: String,
	image: String
}));