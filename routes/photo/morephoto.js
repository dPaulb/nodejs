var express = require('express');
var router = express.Router();
var CategoryModel = require('../../models/CategoryModel')
var co = require('co')

var multer = require('multer')
var path = require('path')
var fs = require('fs')
    , gm = require('gm');
var adminRequired = require('../../libs/adminRequired')

var uploadDir = path.join(__dirname, '../uploads')

var storage = multer.diskStorage({

    destination : function(req, file, callback){
        callback(null, uploadDir)
    },
    filename : function(req, file, callback){
        callback(null, 'products-' + Date.now() + '.' + file.mimetype.split('/')[1])
    }

})
var upload = multer({storage : storage})


router.get('/:id', function(req, res){


    var getData = co(function*(){
        //var product = yield ProductsModel.findOne({'id' :  req.params.id}).exec();
        //var comment = yield CommentsModel.find({'product_id' : req.params.id}).exec();
        return {
            category : yield CategoryModel.findOne({'id' :  req.params.id}).exec()
        }
    })

    getData.then(function(result){
        //res.send(result)
        res.render('photo/morephoto', { category: result.category })
    })
})



module.exports = router;