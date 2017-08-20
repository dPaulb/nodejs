module.exports = function(req, res, next) {
    if (!req.isAuthenticated()){
        res.redirect('/login_warning');
    }
    else{
        return next();
    }
};