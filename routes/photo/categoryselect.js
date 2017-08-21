var express = require('express');
var router = express.Router();
const loginRequired = require('../../libs/loginRequired');
var categoryModel = require('../../models/CategoryModel')
var co = require('co')


router.get('/', function(req, res){
    categoryModel.find( function(err,category){ //첫번째 인자는 err, 두번째는 받을 변수명

        res.render( 'photo/categoryselect' , { category : category });
    });
})

router.get('/delete/:id', function(req, res){
    var getData = co(function*(){
        //var product = yield ProductsModel.findOne({'id' :  req.params.id}).exec();
        //var comment = yield CommentsModel.find({'product_id' : req.params.id}).exec();
        return {
            category : yield categoryModel.remove({'id' :  req.params.id}).exec()
        }
    })

    getData.then(function(result){
        //res.send(result)
        res.redirect('/photocategoryselect')
    })
})


module.exports = router;