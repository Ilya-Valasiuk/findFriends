var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var User   = require('./models/user'); // get our mongoose model

module.exports = function (app, express) {

	/*app.get('/setup', function (req, res) {
		var user = new User({
			name: 'Ilya', 
			password: 'password',
			admin: true
		});

		user.save(function (err) {
			if(err) {
				throw err;
			}

			console.log('user save successfully');
			res.json({success: true});
		});
	});*/

	// API ROUTES -------------------
	// we'll get to these in a second
	var apiRoutes = express.Router();

	apiRoutes.post('/authenticate', function(req, res) {
		User.findOne({
			email: req.body.email
		}, function (err, user) {
			if(err) {
				throw err;
			}
			console.log(user);

			if(!user) {
				res.json({success: false, message: 'authenticate failed. User not found'});
			} else if(user.password !== req.body.password) {
				res.json({success: false, message: 'authenticate failed. Wrong password'});	
			} else {
				var token = jwt.sign(user, app.get('superSecret'), {
					expiresInMinutes: 1440 // 24 hours 
				});

				res.json({
					success: true,
					message: 'Enjoy',
					email: user.email,
					token: token
				});
			}
		});
	});

	apiRoutes.post('/createUser', function (req, res){
		var data = req.body;
		console.log('----------------- CREATE USER -----------------');
		console.log(data);
		var user = new User({
			name: data.name,
			lastname: data.lastname,
			password: data.password,
			email: data.email,
			image: data.image
		});

		user.save(function (err) {
			if(err) {
				throw err;
			}
			console.log('user save successfully');
			res.json({success: true});
		});
	});

	/* SECURE */

	apiRoutes.use(function(req, res, next) {
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		if(token) {

			jwt.verify(token, app.get('superSecret'), function (err, decoded) {
				if(err) {
					res.json({success: false, message: 'Failed to authenticate token.'});
				} else {
					req.decoded = decoded;
					next();
				}
			});
		} else {
			return res.status(403).send({
				success: false,
				message: 'No token provided.'
			});
		}
	});

	apiRoutes.get('/', function(req, res) {
		res.json({message: 'welcome to api'});
	});

	apiRoutes.get('/user', function(req, res) {
		console.log('here');
		console.log(req.body);
		console.log(req.headers);
		User.findOne({
			email: req.body.email
		}, function (err, user) {
			if(err) {
				throw err;
			}
			if(!user) {
				return res.status(403).send({
					success: false,
					message: 'No user find.'
				})
			}
			res.json(user);
		});
	});

	apiRoutes.get('/users', function(req, res) {
		console.log('--------------------USERS-------------------')
		User.find({}, function (err, users) {
			res.json(users);
		});
	});

	app.use('/api', apiRoutes);

	app.get('*', function(req, res) {
	    res.sendFile(__dirname + '/public/index.html');
	});
	
}