const Listing = require("../models/listing")
const Review = require("../models/review")
module.exports.postRoute = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save(); // ✅ Pehle save karo
    listing.review.push(newReview._id); // ✅ Only push the ID
    await listing.save();
    req.flash("success", "Review Added");
    res.redirect(`/listings/${listing._id}`);
}
module.exports.destroyRoute = async (req, res) => {
    let { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId)
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } })
    req.flash("success", "Review Deleted")
    res.redirect(`/listings/${id}`);
}
