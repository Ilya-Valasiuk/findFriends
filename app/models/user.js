var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
	name: String,
	lastname: String,
	password: String,
	email: String,
	latitude: String,
	longitude: String,
	interests:  [Schema.Types.ObjectId],
	notification: [{
		from:String,
		date:Date
			}],
	image: String
}));