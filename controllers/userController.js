const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res) => {
    res.render("users/signup");
}

module.exports.userSignup = async (req,res,next) => {
        try{
            let {username,password,email} = req.body;
            const newUser = new User({username,email});
            const regUser = await User.register(newUser,password);
            req.login(regUser,(err) => {
                if(err){
                    return next(err);
                }
                req.flash("success","Welcome to WonderLust!!");
                res.redirect("/listings");
            });
        }catch(e){
            req.flash("error",e.message);
            res.redirect("/signup")
        }
}

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login");
}

module.exports.userLogin = async(req,res) => {
    req.flash("success","Welcome Back to WanderLust!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.userLogout = (req,res,next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success","You are Logged Out!!");
        res.redirect("/listings");
    })
}