var express = require('express');
var router = express.Router();
var multer = require('multer')
var path = require('path')
var CategoryModel = require('../models/CategoryModel')
var fs = require('fs')
    , gm = require('gm');
var adminRequired = require('../libs/adminRequired')
var im = require('imagemagick');
var uploadDir = path.join(__dirname, '../uploads')
var co = require('co')

var storage = multer.diskStorage({

    destination : function(req, file, callback){
        callback(null, uploadDir)
    },
    filename : function(req, file, callback){
        callback(null, 'products-' + Date.now() + '.' + file.mimetype.split('/')[1])
    }

})
var upload = multer({storage : storage})

router.get('/',function(req,res){
    //edit에서도 같은 form을 사용하므로 빈 변수( product )를 넣어서 에러를 피해준다
    res.render('form', {category : ""});
});

router.post('/', upload.any(), function (req, res, next) {

    var imagePath = 'uploads/' + req.files[0].filename;
    gm(imagePath).autoOrient().write('uploads/' + req.files[0].filename, function(err){
        if (err) {
            console.log(err)
        }
    });

    if(req.files){
        var filenames = "";
        var photonames = "";
        for(var i in req.files){
            filenames = ("/" + req.files[0].filename)

        }



    }
    const category = new CategoryModel({
        title : req.body.title,
        photoName : (req.files) ? filenames : "",
        content : req.body.description,
        numofphoto: 9

    })
    category.save(function(err){
        res.redirect('/photocategoryselect')

    })


});



router.post('/products/ajax_summernote', upload.single('thumbnail'), function(req,res){



    var imagePath = 'uploads/' + req.file.filename;
    gm(imagePath).autoOrient().write('uploads/' + req.file.filename, function(err){
        if (!err) {
            res.send( '/uploads/' + req.file.filename);
        }
    });








//   res.send( '/uploads/' + req.file.filename);





});

router.post('/ajax_more_photo', function(req, res){
    //넣을 변수 값을 셋팅한다
    var query = {
        numofphoto: req.body.numberofphoto
    };

    CategoryModel.update({id: req.body.id}, {$set: query}, function (err) {
        res.json({message : "success"}) //수정후 본래보던 상세페이지로 이동
    });


})

router.get('/edit/:id', function(req, res){
    var getData = co(function*(){
        return{
            category : yield CategoryModel.findOne({'id' : req.params.id}).exec()
        }
    })

    getData.then(function(result){
        res.render('form', {category : result.category})
    })
})

router.post('/edit/:id', upload.any(),function(req, res){



    if(req.files){

    for(var i = 1;i<req.files.length;i++){
        var imagePath = 'uploads/' + req.files[i].filename;
        gm(imagePath).autoOrient().write('uploads/' + req.files[i].filename, function(err){
            if (err) {
                console.log(err)
            }
        });


     }

    }


    // if(req.files[0]){
    //     var imagePath = 'uploads/' + req.files[0].filename;
    //     gm(imagePath).autoOrient().write('uploads/' + req.files[0].filename, function(err){
    //         if (err) {
    //             console.log(err)
    //         }
    //     });
    //
    //     if(req.files){
    //         var filenames = "";
    //         for(var i in req.files){
    //             filenames = ("/" + req.files[0].filename)
    //
    //         }
    //
    //     }
    // }


    CategoryModel.findOne({'id' : req.params.id}, function(err, category){

        var filenames = "";
        if(req.files[0]){

            for(var j in req.files){
                filenames = ("/" + req.files[0].filename)

            }

        }
        else {
            filenames = category.photoName;
        }

        var query = {
            content : req.body.description,
            photoName : (req.files[0]) ? filenames : category.photoName,
            title : req.body.title

        }

        CategoryModel.update({'id' : req.params.id}, {$set : query}, function(err){
            res.redirect('/morephoto/' + req.params.id);
        })
    })


})


router.get('/read', function(req, res){

    gm('uploads/products-1503025005288.jpeg').autoOrient();


})


module.exports = router;