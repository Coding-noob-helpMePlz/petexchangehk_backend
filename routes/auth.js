const passport = require('passport');
const Users = require('../models/users');
const router = require('express').Router();
const cors = require('cors')

// router.use(
// 	cors({
// 		origin: process.env.FRONTEND_URL||'http://localhost:3000',
// 		methods: 'GET, POST, PUT,DELETE',
// 		credentials: true,
// 	})
// );

router.get(
	'/google',
	passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
	'/google/callback',
	passport.authenticate('google', {
		successRedirect: process.env.CLIENT_URL,
		failureRedirect: '/login/failed',
	})
);

// Run after it auth from google is successful
// router.get('/login/success', cors({
// 	origin: process.env.FRONTEND_URL
// 	,
// 		methods: 'GET, POST, PUT,DELETE, HEAD',
// 		credentials: true,
// 	}), async (req, res) => {
// 	console.log('REQ.USER:LOGIN/SUCCESS', req.user);
// 	res.status(200).json({ 'status': 'ok' })
// 	if (req.user) {
// 		let user = await Users.find({ userId: req.user.id }).then(async (user) => {
// 			console.log('see if user param is passed', user);
// 			if (user.length !== 0) {
// 				console.log('this user has userId, he already registed!!');
// 			} else {
// 				console.log('this use is new... building new userId...');
// 				await Users.create({ userId: req.user.id });
// 			}
// 			// console.log('USER_NICK', user.[].nickname);
// 			res.status(200).json({
// 				success: true,
// 				// message: 'successful nice',
// 				thirdPartyUser: req.user,
// 				nickname: user[0].nickname,
// 				contact: user[0].contact,
// 				cookies: req.cookies,
// 			});
// 		});
// 	}
// });

router.get('/login/success', cors({
	origin: process.env.FRONTEND_URL
	,
		methods: 'GET, POST, PUT, DELETE, HEAD',
		credentials: true,
	}), async (req, res) => {
	console.log('REQ.USER:LOGIN/SUCCESS', req.user);


	if (req.user) {
		console.log('try finding user')
		//* ok, I already know that the below code will not execute if req.user is undefined
		//* req.user is undefined now, but in what situation it will be defined?
		//* so, I guess if frontend embedded cookie, the server will recognize it
		//* and then in req.user have information
		let user = await Users.find({ userId: req.user.id }).then(async (user) => {
			console.log('see if user param is passed', user);
			if (user.length !== 0) {
				console.log('this user has userId, he already registed!!');
			} else {
				console.log('this use is new... building new userId...');
				await Users.create({ userId: req.user.id });
			}
			// console.log('USER_NICK', user.[].nickname);
			res.status(200).json({
				success: true,
				// message: 'successful nice',
				thirdPartyUser: req.user,
				nickname: user[0].nickname,
				contact: user[0].contact,
				cookies: req.cookies,
			});
		});
	}
	res.end('no user, have not login') //*


});

router.get('/login/failed', (req, res) => {
	console.log('login failed...');
	res.status(401).json({
		success: false,
		message: 'Login failure...',
	});
});

router.get('/logout', (req, res) => {
	console.log('REQ.USER:logout', req.user);
	req.logout();
	res.redirect(process.env.CLIENT_URL);
});






// router.get('/facebook',
//   passport.authenticate('facebook'));

// router.get('/facebook/callback',
// 	passport.authenticate('facebook',
// 		{
// 			successRedirect: process.env.CLIENT_URLe,
// 			failureRedirect: '/login'
// 		}),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });

module.exports = router;
