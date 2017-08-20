var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var MusicSelectSchema = new Schema({
    title : String,
    thumbnail : String,
    created_at : {
        type : Date,
        default : Date.now()
    },
    audioFileName : String,
    price : Number
});

MusicSelectSchema.virtual('getDate').get(function(){
    var date = new Date(this.created_at);
    return {
        year : date.getFullYear(),
        month : date.getMonth()+1,
        day : date.getDate()
    };
});

autoIncrement.initialize(mongoose.connection)

MusicSelectSchema.plugin( autoIncrement.plugin , { model : "musicselect", field : "id" , startAt : 1 } );
module.exports = mongoose.model('musicselect' , MusicSelectSchema);