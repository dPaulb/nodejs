var express = require('express');
var router = express.Router();
const loginRequired = require('../../libs/loginRequired');
var musicSelectModel = require('../../models/MusicSelectModel')


router.get('/', function(req, res){
    musicSelectModel.find( function(err, music){ //첫번째 인자는 err, 두번째는 받을 변수명

        res.render( 'music/musicSelect' , { music : music });
    });
})


module.exports = router;