var express = require('express')
var router = express.Router();
var UserModel = require('../models/UserModel')
var passport = require('passport')
var KakaoStrategy = require('passport-kakao').Strategy;


passport.use(new KakaoStrategy({
        clientID : "81e09a9a90afbd033744d90ce13c1704",
        callbackURL : "http://localhost:2222/authKakao/oauth"
    },
    function(accessToken, refreshToken, profile, done){
        // 사용자의 정보는 profile에 들어있다.
        UserModel.findOne({ username : "kk_" + profile.id }, function(err, user){
            if(!user){  //없으면 회원가입 후 로그인 성공페이지 이동
                var regData = { //DB에 등록 및 세션에 등록될 데이터
                    userID :  "kk_" + profile.id,
                    userPassword : "kakao_login",
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


router.get("/login", passport.authenticate('kakao',{state: "success"}));
router.get("/oauth", passport.authenticate('kakao'), function(req, res){
    // 로그인 시작시 state 값을 받을 수 있음

    if(req.query.state === "success"){
        res.redirect('/')
    }
    else{
        res.send("kakao login fail")
    }
});
module.exports = router;
