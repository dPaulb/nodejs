var express = require('express')
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;
var UserModel = require('../models/UserModel')
var router = express.Router();

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {

    done(null, user);
});

passport.use(new FacebookStrategy({
        clientID: "1621181871285995",
        clientSecret: "3b1735296a19a4a9ce0862fd653f18da",
        callbackURL: "http://localhost:2222/authFacebook/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email', 'friends']
    },
    function(accessToken, refreshToken, profile, done) {

        UserModel.findOne({ username : "fb_" + profile.id }, function(err, user){
            if(!user){  //없으면 회원가입 후 로그인 성공페이지 이동
                var regData = { //DB에 등록 및 세션에 등록될 데이터
                    userID :  "fb_" + profile.id,
                    userPassword : "facebook_login",
                    displayName : profile.displayName
                };
                var User = new UserModel(regData);
                User.save(function(err){ //DB저장
                    done(null,regData); //세션 등록
                });
            }else{ //있으면 DB에서 가져와서 세션등록
                done(null,user);
            }

        });
    }
));


router.get('/facebook', passport.authenticate('facebook', { scope: 'email, user_friends'}) );


//인증후 페이스북에서 이 주소로 리턴해줌. 상단에 적은 callbackURL과 일치
router.get('/facebook/callback',
    passport.authenticate('facebook',
        {
            successRedirect: '/authFacebook/facebook/success',
            failureRedirect: '/authFacebook/facebook/fail'
        }
    )
);


//로그인 성공시 이동할 주소
router.get('/facebook/success', function(req,res){
    //res.send(req.user);
    res.redirect('/')
});

router.get('/facebook/fail', function(req,res){
    res.send('facebook login fail');
});


module.exports = router;