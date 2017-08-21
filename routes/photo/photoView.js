var express = require('express');
var CommentModel = require('../../models/CommentModel')
var CategoryModel = require('../../models/CategoryModel')
var router = express.Router();
var co = require('co')
var loginRequired = require('../../libs/loginRequired')

router.get('/:uploadPath', function(req, res){
    var uploadPath = req.params.uploadPath
    // res.render('photo/photoView', {uploadPath : uploadPath})

    var getData = co(function*(){
        //var product = yield ProductsModel.findOne({'id' :  req.params.id}).exec();
        //var comment = yield CommentsModel.find({'product_id' : req.params.id}).exec();
        return {
            comment : yield CommentModel.find({'uploadPath' : req.params.uploadPath}).exec()

        }
    })
    getData.then(function(result){
        //res.send(result)
        res.render('photo/photoView', { uploadPath : uploadPath, comment: result.comment })
    })
})

router.post('/ajax_comment/insert',function(req, res){
    var comment = new CommentModel({
        content : req.body.content,
        uploadPath : req.body.uploadPath,
        displayName : req.user.displayName,
        userID : req.user.userID
    });
    comment.save(function(err, comment){
        res.json({
            id : comment.id,
            content : comment.content,
            displayName : comment.displayName,
            message : "success"
        });
    });
})

router.post('/ajax_comment/delete', function(req, res){
    CommentModel.remove({'id' : req.body.comment_id}, function(err){
        res.json({message : "success"})
    })
})

module.exports = router;