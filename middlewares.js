const Listing = require("./models/listing")
const Review = require("./models/review")
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl =req.originalUrl;
        req.flash("error", "You must be Logged in.");
        return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirectUrl=(req,res,next)=>{
    if( req.session.redirectUrl){
        res.locals.redirectUrl =req.session.redirectUrl
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id}=req.params;
    let listings= await Listing.findById(id);
    if(!listings.owner.equals(res.locals.userCurr._id)){
        req.flash("error","Your are not owner of this listing")
        return res.redirect(`/listings/${id}`)
    }
    next();
}
module.exports.isAuthor = async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let reviewListing= await Review.findById(reviewId);
    if(!reviewListing.author.equals(res.locals.userCurr._id)){
        req.flash("error","Your are not author of this review")
        return res.redirect(`/listings/${id}`)
    }
    next();
}