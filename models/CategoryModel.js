var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var CategorySchema = new Schema({
    title : String,
    photoName : String,
    created_at : {
        type : Date,
        default : Date.now()
    },
    content : String,
    numofphoto : Number
});

CategorySchema.virtual('getDate').get(function(){
    var date = new Date(this.created_at);
    return {
        year : date.getFullYear(),
        month : date.getMonth()+1,
        day : date.getDate()
    };
});

autoIncrement.initialize(mongoose.connection)

CategorySchema.plugin( autoIncrement.plugin , { model : "category", field : "id" , startAt : 1 } );
module.exports = mongoose.model('category' , CategorySchema);