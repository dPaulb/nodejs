var express = require('express')
var router = express.Router();
var CategoryModel = require('../models/CategoryModel')

router.get('/', (req, res) => {
    res.render('photo/categorysearch')
})

router.get('/result', (req, res) => {
    var regex = req.query.category
    CategoryModel.find({'title' : new RegExp(''+regex+'', "i")}, function(err, category){
        res.render('photo/searchResult', {category : category})
        var reggg = new RegExp('^' + regex + '*' ,"i")
        console.log(reggg)
    })

})

router.get('/ajax', function(req, res){
    res.render('photo/categorySearchAjax')
})
router.post('/ajax_search', function(req, res){
    // CategoryModel.findOne({title : req.body.title}, function(err, category){
    //     if(err){
    //         console.log("failed")
    //     }
    //     else{
    //     res.json({
    //         categoryname : category.title,
    //         message : "success"
    //     })
    //     }
    //
    // })
    //
    // if(CategoryModel.find({title : req.body.title}).count() === 0){
    //     console.log("zero")
    // }
    // else{
    //     console.log(CategoryModel.find({title : req.body.title}).count())
    // }
    var regex = req.body.title

    //var query = CategoryModel.find({title : req.body.title}).count();
    var query = CategoryModel.find({title : new RegExp(''+regex+'+', "i")}).count();
    var secondQuery = CategoryModel.findOne({title : new RegExp(''+regex+'+', "i")})

    query.exec(function(err, results){
        if(results === 0){
            res.json({
                categoryname : "결과가 없습니다",
                message : "success"
            })
        }
        else{
            secondQuery.exec(function(err, secResults){
                res.json({
                    categoryname : secResults.title,
                    path : secResults.photoName,
                    message : "success"
                })
            })
        }

    })
    // secondQuery.exec(function(err, results){
    //     // if(!err){
    //     //     res.json({
    //     //         categoryname : results.title,
    //     //         message : "success"
    //     //     })
    //     // }
    //
    //     // if(results.count() === 0){
    //     //     res.json({
    //     //         categoryname : "결과가 없습니다.",
    //     //         message : "success"
    //     //     })
    //     // }
    //     // else{
    //     //     res.json({
    //     //         categoryname : results.title,
    //     //         message : "success"
    //     //     })
    //     // }
    //
    //
    // })


})





module.exports = router;