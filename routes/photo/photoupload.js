var express = require('express');
var router = express.Router();
var multer = require('multer');
var CategoryModel = require('../../models/CategoryModel');
var path = require('path')
var uploadDir = path.join(__dirname , '../../public/photo')
var csrf = require('csurf')
var csrfProtection = csrf({cookie : true})
var co = require('co')
var loginRequired = require('../../libs/loginRequired');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        cb(null, 'photo-' + Date.now() + '.' + file.mimetype.split('/')[1])
    }
})

var upload = multer({ storage: storage , fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.JPG') {
        return callback(new Error('Only images are allowed'))
    }
    callback(null, true)
}})


router.get('/', csrfProtection,function(req, res){



        res.render('photo/photoupload', { csrfToken : req.csrfToken() })

});



router.post('/ajax_summernote', loginRequired, upload.single('thumbnail'), function(req,res){
    res.send( 'public/photo' + req.file.filename);
});



module.exports = router;