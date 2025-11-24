const dotenv = require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const nodemailer = require('nodemailer');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session())

mongoose.connect(process.env.MONGO_URI);

const appUrl = process.env.APP_URL;

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    googleId: String,
    secrets: []
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());


passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {
        id: user.id
      });
    });
  });

passport.deserializeUser(function(user, cb) {
process.nextTick(function() {
    return cb(null, user);
});
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `${appUrl}/auth/google/secrets`
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id, username: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/', function(req, res) {
    res.render('home');
});

app.route('/login')
    .get((req, res) => {
        res.render('login');
    })
    .post(async (req, res) => {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });

        await User.findOne({ username: req.body.username })
        .then( async (user) => {
            if (req.body.username !== user.username) { 
                res.render('login', {message: "User with this login not found.", link:"Register to login."});
            } 

            if (req.body.username === user.username) { 
                req.login(user, function(err){
                    if (err){
                        res.render('login');
                    } else {
                        passport.authenticate('local',{ failureRedirect: '/wrong-password', failureMessage: false })(req, res, function() {
                            res.redirect('/secrets');
                        });
                    }
                });
            } 
        })
        .catch((err) => {
            console.error(err);
            res.render('login');
        });
    });

app.route('/register')
    .get((req, res) => {
        res.render('register');
    })
    .post((req, res) => {
        User.register({username: req.body.username}, req.body.password, function(err, user) {
            if(err) {
                    res.render('register', {message: "User with this login already exist.", link:"Go to login page?"});
            } else {
                passport.authenticate('local')(req, res, function(){
                    res.redirect('/secrets');
                });
            }
        });
    });

app.route('/reset')
    .get((req, res) => {
        res.render('reset');
    })
    .post(async (req, res) => {
        try {
            const email = req.body.username;
            const user = await User.findOne({ username: email });
            if (user.username === email) {
                const id = user.id;
                const link = `${appUrl}/reset/${id}`;
                const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_ADDRESS,
                    pass: process.env.EMAIL_PASSWORD
                }
                });
    
                var mailOptions = {
                from: 'Secrets app',
                to: email,
                subject: 'Password',
                html: `<h3>To change the password, follow the link below and enter the new password.</h3> <br> <a href="${link}"> Reset password</a>`
                };
    
                transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    res.render('message', {message: 'Something went wrong. Try later'});
                } else {
                    res.render('message', {message: 'Reset password link have been sent to your email.'});
                }
                });
            }  else {
                res.render('message', {message: 'User with this login not found.'});
            }
        } catch(e) {
            res.render('message', {message: 'User with this login not found.'});
        }
    })

app.route('/reset/:id')
    .get((req, res) => {
        const id = req.params.id;
        res.render('reset', {title:"Reset password", reset: true, id: id});
    })

app.route('/changepassword')
    .get ((req, res) => {
        res.render('reset', {title:"Change password", change: true});
    })
    .post( async(req, res) => {
        await User.findByUsername(req.body.username, (err, user) => {
            if (err) {
                res.render('message', {message: 'User with this login not found.'});
            } else {
                user.changePassword(req.body.oldpassword, 
                req.body.newpassword, function (err) {
                    if (err) {
                        res.render('message', {message: 'Something went wrong. Try later'});
                    } else {
                        res.render('message', {message: 'Your password has been successfully changed.'});
                    }
                });
            }
        });
    });

app.route('/resetpassword')
    .post(async(req, res) => {
        const id = req.body.id;
        await User.findOne({ _id: id })
        .then(async(user) => {
            await user.setPassword(req.body.newpassword, async (err, u, passwordErr) => {
                if (err){
                    res.render('message', {message: 'Something went wrong. Try later'});
                } else {
                    await u.save();
                    res.render('message', {message: 'Your password has been successfully changed.'});
                }
                if(passwordErr) {
                    res.render('message', {message: 'Something went wrong. Try later'});
                }
            });
        })
        .catch((e) => {
            res.render('message', {message: 'Something went wrong. Try later'});
        })
    });

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/secrets', 
    passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
      res.redirect('/secrets');
});

app.route('/submit')
    .get((req, res) => {
        if (req.isAuthenticated()) {
            res.render('submit');
        } else {
            res.redirect('/login');
        }
    })
    .post((req, res) => {
        const newSecret = req.body.secret;

        if (!newSecret.length == 0) {
            User.findById(req.user.id)
            .then((data) => {
                data.secrets.push(newSecret);
                data.save();
                res.redirect('/secrets');
            })
        } else {
            return
        }
    });

app.get('/secrets', async function(req, res) {
    if (req.isAuthenticated()) {
        await User.find({'secrets': {$ne: []}})
        .then((data) => {
            res.render('secrets', {userData: data})
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/wrong-password', function(req, res) {
    res.render('wrong-password');
});


app.get('/logout', function(req, res) {
    req.logout(function(err) {
        if (err) {}
        res.redirect('/');
      });
});

 
app.listen(process.env.PORT || 5000);