const User = require("../models/user")
module.exports.signupGetRoute = (req, res) => {
    res.render("user/signup");
}
module.exports.signupPostRoute = async (req, res) => {
    try {
        let { email, username, password } = req.body;
        let newUser = new User({ email, username });
        let registerUser = await User.register(newUser, password);
        req.login(registerUser, (err) => {
            if (err) {
                next(err)
            }
            req.flash("success", "Welcome to Safaristan");
            res.redirect("/listings");
        })

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}
module.exports.loginGetRoute = (req, res) => {
    res.render("user/login");
}
module.exports.loginPostRoute = (req, res) => {
    req.flash("success", "Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}
module.exports.logoutRoute = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "Your are log out")
        res.redirect("/listings")
    })
}