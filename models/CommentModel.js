var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment')

var CommentsSchema = new Schema({
    content : String,
    created_at : {
        type : Date,
        default : Date.now()
    },
    uploadPath : String,
    displayName : String,
    userID : String
})

CommentsSchema.plugin(autoIncrement.plugin, {model : "comment", field : "id", startAt : 1})
module.exports = mongoose.model("comments", CommentsSchema)