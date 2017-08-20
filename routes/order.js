var express = require('express')
var CheckoutModel = require('../models/CheckoutModel')
var router = express.Router();
var adminRequired = require('../libs/adminRequired')

router.get('/', adminRequired,function(req, res){
    CheckoutModel.find(function(err, orderList){
        res.render('orderList', {orderList : orderList})
    })
})

router.get('/edit/:id', adminRequired,function(req, res){
    CheckoutModel.findOne({'id' : req.params.id}, function(err, order){
        res.render('orderForm', {order : order})
    })
})

router.post('/edit/:id', adminRequired, function(req,res){
    var query = {
        status : req.body.status,
        song_jang : req.body.song_jang
    };

    CheckoutModel.update({ id : req.params.id }, { $set : query }, function(err){
        res.redirect('/order');
    });
});
module.exports = router;