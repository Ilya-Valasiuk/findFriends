var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Interest', new Schema({
	title: String,
	description: String,
	image: String
}));