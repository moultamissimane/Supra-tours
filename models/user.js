var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userSchema = new Schema( {
	
	unique_id: Number,
	email: String,
	username: String,
	password: String,
	passwordConf: String
}),
user = mongoose.model('user', userSchema);

module.exports = user;