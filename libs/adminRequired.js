module.exports = function(req, res, next){
    if(!req.isAuthenticated()){
        res.redirect('/accounts/login')
    }
    else{
        if(req.user.userID !== "admin"){
            res.send('<script>alert("관리자만 접근 가능한 페이지 입니다.");history.back();</script>')
        }else{
            return next();
        }
    }
}