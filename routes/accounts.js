var express = require('express')
var router = express.Router();
var UserModel = require('../models/UserModel')
var PasswordHash = require('../libs/PasswordHash')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

passport.serializeUser(function(user, done){
    console.log('serializeUser');
    done(null, user);
})

passport.deserializeUser(function (user, done) {
    var result = user;
    result.password = "";
    console.log('deserializeUser');
    done(null, user);
});


passport.use(new LocalStrategy({
    userIDField : 'userID',
    userPasswordField : 'userPassword',
    passReqToCallback : true
},
    function(req, username, password, done){
        UserModel.findOne({ userID : username , userPassword : PasswordHash(password) }, function (err,user) {
            if (!user){
                return done(null, false, { message: '아이디 또는 비밀번호 오류 입니다.' });
            }else{
                return done(null, user);
            }
        });
    }

))

router.get('/join', function(req, res){
    res.render('accounts/join')
})

router.post('/join', function(req, res){
    var User = new UserModel({
        userID : req.body.userID,
        userPassword : PasswordHash(req.body.userPassword),
        displayName : req.body.displayName

    })
    UserModel.findOne({userID : req.body.userID}, function(err, user){
        if(user){
            res.send("<script>alert('이미 존재하는 아이디입니다');location.href='/accounts/join';</script>")
        }
        else{
            User.save(function(err){
                res.send("<script>alert('회원가입 성공');location.href='/accounts/login';</script>")
            })
        }
    })


})

router.get('/login', function(req, res){
    res.render('accounts/login', {flashMessage : req.flash().error})
})

router.post('/login' ,
    passport.authenticate('local', {
        failureRedirect: '/accounts/login',
        failureFlash: true
    }),
    function(req, res){
        res.send('<script>alert("로그인 성공");location.href="/";</script>');
    }
);

router.get('/success', function(req, res){
    res.send(req.user);
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/accounts/login');
});

module.exports = router;