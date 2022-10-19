var express = require('express');
var router = express.Router();
var user = require('../models/user');
const Ticket = require('../models/Ticket')
const bcrypt = require('bcrypt')
const validation = require('../middleware/validation/validation')

const userValidation = validation.userValidation
const openTicket = validation.openTicket

router.get('/', function (req, res, next) {
	return res.render('index.ejs');
});

// register api
router.post('/', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body;


	if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			user.findOne({email:personInfo.email},function(err,data){
				if(!data){
					var c;
					user.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new user({
							unique_id:c,
							email:personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"You are regestered,You can login now."});
				}else{
					res.send({"Success":"Email is already used."});
				}

			});
		}else{
			res.send({"Success":"password is not matched"});
		}
	}
});

router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

// login api
router.post('/login', function (req, res, next) {
	//console.log(req.body);
	user.findOne({email:req.body.email},function(err,data){
		if(data){
			
			if(data.password==req.body.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({"Success":"Success!"});
				
			}else{
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not regestered!"});
		}
	});
});

// profile info api 
router.get('/profile', function (req, res, next) {
	console.log("profile");
	user.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('data.ejs', {"name":data.username,"email":data.email});
		}
	});
});

// logout api 
router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});

// forgetpassword api
router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	user.findOne({email:req.body.email},function(err,data){
		console.log(data);
		if(!data){
			res.send({"Success":"This Email Is not regestered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
		}
	});
	
});

//create a ticket
router.post('/ticket', (req, res) => {

    let [result, data] = userValidation(req.body.passenger)
    if (!result) return res.status(404).json({ message: data })

    const ticket = new Ticket({ seat_number: req.body.seat_number })
    const user = new user(req.body.passenger)

    user.save()
        .then(data => {
            if (data) {
                ticket.passenger = user._id
                ticket.save()
                    .then(data => res.status(200).json(data))
                    .catch(err => {
                        user.findOneAndDelete({ _id: user._id })
                            .then((data) => res.status(400))
                            .catch(err => res.status(400).json({ message: err }))
                    })
            }
        })
        .catch(err => res.status(404).json({ message: err }))

})

//update a ticket, update open/closed and user_details
router.put('/ticket/:ticket_id', (req, res) => {
    //check indempotency for ticket booking status
    const { ticket_id } = req.params
    const payload = req.body
    let passenger = null

    if ('passenger' in payload) {
        passenger = req.body.passenger
    }

    if (payload.is_booked == true) {
        Ticket.findById(ticket_id, function (err, ticket) {
            if (err) res.status(404).json({ message: err })
            if (ticket) {
                const user_id = ticket.passenger
                user.remove({ _id: user_id }, function (err) {
                    if (err) {
                        res.status(404).json({ message: err })
                    }
                    else {
                        ticket.is_booked = payload.is_booked
                        ticket.save()
                            .then(data => res.status(200).json(data))
                            .catch(err => res.status(404).json(err))
                    }
                });
            }
        })
    }

    if (payload.is_booked == false && passenger != null) {
        Ticket.findById(ticket_id, function (err, ticket) {
            if (err) res.status(404).json({ message: err })
            if (ticket) {
                const user = new user(passenger)
                user.save()
                    .then(data => {
                        ticket.passenger = data._id
                        ticket.is_booked = payload.is_booked
                        ticket.save()
                            .then(data => res.status(200).json(data))
                            .catch(err => res.status(404).json(err))
                    })
                    .catch(err => res.status(404).json({ message: err }))
            }
        })
    }
})

// edit details of a user 
router.put('/user/:ticket_id', (req, res) => {
    const { ticket_id } = req.params
    const payload = req.body

    Ticket.findById(ticket_id, function (err, ticket) {
        if (err) res.status(404).json({ message: err })
        if (ticket) {
            const user_id = ticket.passenger
            user.findById(user_id)
                .then(user => {
                    if ('username' in payload) user.name = payload.name
                    if ('email' in payload) user.email = payload.email
                    // if ('phone' in payload) user.phone = payload.phone
                    // if ('age' in payload) user.age = payload.age
                    user.save()
                        .then(data => res.status(202).json(data))
                        .catch(err => res.status(404).json({ message: err }))
                })
                .catch(err => res.status(404).json({ message: err }))
        }
    })
})

// get the status of a ticket based on ticket_id
router.get('/ticket/:ticket_id', (req, res) => {
    const { ticket_id } = req.params
    Ticket.findById(ticket_id, function (err, ticket) {
        if (err) res.status(404).json({ message: err })
        if (ticket) res.status(200).json({ status: ticket.is_booked })
    })
})

// get list of all open tickets
router.get('/tickets/open', (req, res) => {
    Ticket.find({ is_booked: false }, (err, data) => {
        if (err) res.status(404).json({ message: err })
        if (data) res.status(200).json(data)
    })
})

// get list of all closed tickets
router.get('/tickets/closed', (req, res) => {
    Ticket.find({ is_booked: true }, (err, data) => {
        if (err) res.status(404).json({ message: err })
        if (data) res.status(200).json(data)
    })
})

// View person details of a ticket
router.get('/ticket/details/:ticket_id', (req, res) => {
    const { ticket_id } = req.params
    Ticket.findById(ticket_id, function (err, ticket) {
        if (err) res.status(404).json({ message: err })
        if (ticket) {
            user.findById(ticket.passenger, function (err, user) {
                if (err) res.status(404).json({ message: err })
                if (user) res.status(200).json(user)
            })
        }
    })
})

router.post('/tickets/reset', (req, res) => {

    if (!("username" in req.body) && !("password" in req.body)) {
        res.status(400).json({ message: "username and password is needed in request body" })
    }

    const { username, password } = req.body

    if (!(bcrypt.compareSync(password, process.env.PASSWORD_HASH))) {

    }
    if (!(username === process.env.USER)) {
        res.status(400).json({ message: "username is incorrect" })
    }

    Ticket.find({}, (err, data) => {
        if (err) res.status(404).json({ message: err })
        if (data) {
            data.forEach(openTicket)
            res.status(200).json({ message: "success" })
        }
    })

})

module.exports = router;