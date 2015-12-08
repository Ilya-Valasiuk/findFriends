var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var mongoose  = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var User   = require('./models/user'); // get our mongoose model
var Interes   = require('./models/interes'); // get our mongoose model

module.exports = function (app, express, io) {
	/*io.on('connection', function (socket) {
		console.log('user connected');

		socket.on('disconnect', function () {
			console.log('disconnect');
		});

		socket.on('chat message', function (msg) {
			console.log('message: ' + msg);
			io.emit('chat message', msg);
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

			if(!user) {
				res.json({success: false, message: 'authenticate failed. User not found'});
			} else if(user.password !== req.body.password) {
				res.json({success: false, message: 'authenticate failed. Wrong password'});	
			} else {
				var userInfo = {
		            _id: user._id,
		            email: user.email,
		            name: user.name,
		            lastname: user.lastname
		          };
				var token = jwt.sign(userInfo, app.get('superSecret'), {
					expiresIn: '1d' 
				});

				res.json({
					success: true,
					message: 'Enjoy',
					token: token
				});
			}
		});
	});

	apiRoutes.post('/createUser', function (req, res){
		var data = req.body;
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
	apiRoutes.get('/user/interests', function(req, res) {
		User.findOne({email: req.decoded.email}, function (err, user) {
			if(err) throw err;

			res.json({
				interests: user.interests
			})
		});
	});
	apiRoutes.put('/user/interests/:id', function(req, res) {
		var interesId = req.params.id ? req.params.id : '';
		interesId = new ObjectId(interesId);
		User.findOne({email: req.decoded.email}, function (err, user) {
			if(err) throw err;

			if(~user.interests.indexOf(interesId)) {
	          res.json({
	            success: true,
	            interests: user.interests,
	            message: 'interes exist'
	          });
	        } else {
	          user.interests.push(interesId);
	          user.save(function(err, user) {
	            if(err) throw err;
	              res.json({
	              success: true,
	              interests: user.interests,
	              message: 'interes added'
	            });    
	          });   
	        }
	    });
	});
	apiRoutes.delete('/user/interests/:id', function(req, res) {
		var interesId = req.params.id ? req.params.id : '';
		interesId = new ObjectId(interesId);
		User.findOne({email: req.decoded.email}, function (err, user) {
			if(err) throw err;
    		var index = user.interests.indexOf(interesId);
          	if(~index) {
          		 user.interests.splice(index, 1);
          		  user.save(function(err, user) {
		            if(err) throw err;
		              res.json({
		              success: true,
		              interests: user.interests,
		              message: 'interes removed'
		            });    
		          });
          	} else{
	              res.json({
		              success: true,
		              interests: user.interests,
		              message: 'interes not found'
		            });   
	        }
	    });
	});
	apiRoutes.get('/interests', function(req, res) {
		Interes.find({}, function (err, insterests) {
			if(err) throw err;

			res.json({
				interests: insterests
			})
		});
	});
	apiRoutes.get('/', function(req, res) {
		res.json({message: 'welcome to api'});
	});
	apiRoutes.get('/logout', function(req, res) {
		res.json({message: 'logout'});
	});

	apiRoutes.put('/user/position/:coordinates', function(req, res) {
		var coordinates = req.params.coordinates ? req.params.coordinates : '';
		coordinates = coordinates.split('&')
		User.findOne({email: req.decoded.email}, function (err, user) {
			if(err) throw err;

			user.latitude = coordinates[0];
			user.longitude = coordinates[1];
			user.save(function(err, user) {
			if(err) throw err;
			  res.json({
				  success: true,
				  message: 'coordinates save'
				});    
			});   
	    });
	});

	apiRoutes.get('/user', function(req, res) {
		User.findOne({email: req.decoded.email}, function (err, user) {
			res.json({
				userInfo: user
			});
		});
	});

	apiRoutes.get('/search-users', function(req, res) {
		User.findOne({email: req.decoded.email}, function (err, user) {
			if(err) throw err;
			var interesIds = user.interests;
			User.find({'interests': {
				"$in": interesIds
			}}, function (err, users) {
				if(users.length) {
					res.json({
			            success: true,
			            users: users
			          }); 	
				} else {
					res.json({
			            success: false,
			            message: 'users not found'
			          }); 
				}
			})
		});
	});

	apiRoutes.put('/user/notification/:id', function(req, res) {
		var toUserId = req.params.id;

		User.findOne({_id: toUserId}, function (err, user) {
			if(err) throw err;	

			if(user) {
				user.notification.push({from: req.decoded.email, date: new Date()});
				user.save(function(err, user) {
					console.log(user);
					if(err) throw err;
					res.json({
						success: true,
						message: 'notification sent'
					});
				});
			} else {
				res.json({
					success: false,
					message: 'some error'
				});
			}
		})
	});
	function findWithAttr(array, attr, value) {
	    for(var i = 0; i < array.length; i += 1) {
	        if(array[i][attr] == value) {
	            return i;
	        }
	    }
	}
	apiRoutes.delete('/user/notification/:id', function(req, res) {
		var id = req.params.id;

		User.findOne({email: req.decoded.email}, function (err, user) {
			if(err) throw err;	

			if(user) {
				var arrOfNot = user.notification;
				var index = findWithAttr(arrOfNot, '_id', id);
				user.notification.splice(index, 1);
				user.save(function(err, user) {
					if(err) throw err;
					res.json({
						success: true,
						userInfo: user,
						message: 'notification delete'
					});
				});
			} else {
				res.json({
					success: false,
					message: 'some error'
				});
			}
		})
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