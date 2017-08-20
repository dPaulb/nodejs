var express = require('express')
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')

var passport = require('passport')
var flash = require('connect-flash')
var session = require('express-session')


const mongoose = require('mongoose')
mongoose.Promise = global.Promise;
const autoIncrement = require('mongoose-auto-increment')
var db = mongoose.connection;
db.on('error', console.error);
db.on('open', function(){
    console.log('mongodb connect');
});

var connect = mongoose.connect('mongodb://127.0.0.1:27017/boothbooth', {useMongoClient : true});
autoIncrement.initialize(connect);

var admin = require('./routes/admin')
var index = require('./routes/index');
var accounts = require('./routes/accounts')
var photocategoryselect = require('./routes/photo/categoryselect')
var photoupload = require('./routes/photo/photoupload')
var morephoto = require('./routes/photo/morephoto')
var authFacebook = require('./routes/authFacebook')
var authKakao = require('./routes/authKakao')
var chat = require('./routes/chat')
var musicbooth = require('./routes/music/musicbooth')
var adminMusic = require('./routes/music/adminMusic')
var moremusic = require('./routes/music/moremusic')
var cart = require('./routes/cart')
var checkout = require('./routes/checkout')
var photoView = require('./routes/photo/photoView')
var order = require('./routes/order')
var statistics = require('./routes/statistics')
var categorysearch = require('./routes/categorysearch')

var app = express();


// 확장자가 ejs 로 끈나는 뷰 엔진을 추가한다.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())


var connectMongo = require('connect-mongo')
var MongoStore = connectMongo(session)

var sessionMiddleWare = session({
    secret : 'JKBOOTH',
    resave : false,
    saveUninitialized : true,
    cookie :{
        maxAge : 2000 * 60 * 60
    },
    store : new MongoStore({
        mongooseConnection : mongoose.connection,
        ttl: 14 * 24 * 60 * 60
    })
})

app.use(sessionMiddleWare);

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use(function(req, res, next) {
    app.locals.isLogin = req.isAuthenticated();
    //app.locals.urlparameter = req.url; //현재 url 정보를 보내고 싶으면 이와같이 셋팅
    //app.locals.userData = req.user; //사용 정보를 보내고 싶으면 이와같이 셋팅
    app.locals.userData = req.user
    app.locals.onName = req.body.displayName
    next();
});


app.use('/', index);
app.use('/accounts', accounts)
app.use('/photocategoryselect', photocategoryselect)
app.use('/uploads', express.static('uploads'));
app.use('/musicuploads', express.static('musicuploads'));
app.use('/static', express.static('static'));
app.use('/admin', admin);
app.use('/morephoto', morephoto)
app.use('/authFacebook', authFacebook)
app.use('/authKakao', authKakao)
app.use('/chat', chat)
app.use('/musicbooth', musicbooth)
app.use('/adminMusic', adminMusic)
app.use('/moremusic', moremusic)
app.use('/cart', cart)
app.use('/checkout', checkout)
app.use('/photoView', photoView)
app.use('/order', order);
app.use('/statistics', statistics)
app.use('/categorysearch', categorysearch)


var server = app.listen(2222, function(){
    console.log('Express listening on 2222');

})

var listen = require('socket.io')
var io = listen(server)
io.use(function(socket, next){
    sessionMiddleWare(socket.request, socket.request.res, next);
})

require('./libs/socketConnection')(io);




