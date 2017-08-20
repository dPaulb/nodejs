var express = require('express')
var CheckoutModel = require('../models/CheckoutModel')
var router = express.Router();
var adminRequired = require('../libs/adminRequired')

router.get('/', adminRequired,function(req, res){

    CheckoutModel.find(function(err, orderList){
        var barData = [];
        var pieData = [];

        orderList.forEach(function(order){
            var date = new Date(order.created_at);
            var monthDay = (date.getMonth() + 1) + '-' + date.getDate();

            if(monthDay in barData){
                barData[monthDay]++;
            }
            else{
                barData[monthDay] = 1;
            }

            if(order.status in pieData){
                pieData[order.status]++;
            }
            else{
                pieData[order.status] = 1;
            }

        })
        res.render('admin/statistics', {barData : barData, pieData : pieData})
    })

})



module.exports = router;