var express = require('express');
var router = express.Router();
var MusicSelectModel = require('../../models/MusicSelectModel')
var co = require('co')

router.get('/:id', function(req, res){


    var getData = co(function*(){
        //var product = yield ProductsModel.findOne({'id' :  req.params.id}).exec();
        //var comment = yield CommentsModel.find({'product_id' : req.params.id}).exec();
        return {
            music : yield MusicSelectModel.findOne({'id' :  req.params.id}).exec()
        }
    })

    getData.then(function(result){
        //res.send(result)
        res.render('music/moremusic', { music: result.music })
    })
})

router.get('/test/test', function(req, res){
    res.render('music/test')
})

router.get('/delete/:id', function(req, res){
    var getData = co(function*(){
        //var product = yield ProductsModel.findOne({'id' :  req.params.id}).exec();
        //var comment = yield CommentsModel.find({'product_id' : req.params.id}).exec();
        return {
            music : yield MusicSelectModel.remove({'id' :  req.params.id}).exec()
        }
    })

    getData.then(function(result){
        res.redirect('/musicbooth')
    })
})

module.exports = router;