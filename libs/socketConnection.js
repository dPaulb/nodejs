require('./removeByValue')();
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://127.0.0.1:27017/boothbooth'




module.exports = function(io){
    MongoClient.connect(url, function(err, db){
        //var messagesCollection = db.collection('messages')

        var userList = [];
        io.on('connection', function(socket){
            var session = socket.request.session.passport;
            var user = (typeof session != 'undefined') ? (session.user) : "";

            if(userList.indexOf(user.displayName) === -1){
                userList.push(user.displayName);

            }
            io.emit('join', userList);


            //io.emit('server message', {message : "유저가 입장했습니다."/*socket.id*/, displayname : user.displayName})

          db.collection("messages").find().toArray().then(function(docs){
                io.emit("chatHistory", docs);

            })

            socket.on('client message', function(data){

                messagesCollection.insertOne({text : data.message, displayname : user.displayName}, function(err, res){
                    console.log("inserted a document into the message")
                })

                io.emit('server message', {message : data.message, displayname : user.displayName});

            });

            socket.on('disconnect', function(){
                //io.emit('server message', {message : "유저가 나갔습니다", displayname : user.displayName})
                userList.removeByValue(user.displayName);
                io.emit('leave', userList);
            })
        })
    })
}
