const Listing = require("../models/listing")
const express = require('express');
const router = express.Router({ mergeParams: true });
const warpAsync = require('../utils/wrapAsync')
const ExpressError = require('../utils/ExpressError')
const { reviewSchema } = require("../schema")
const Review = require('../models/review')
const { isLoggedIn, isAuthor } = require("../middlewares");
const reviewController= require("../controllers/review")
const reviewvalidate = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    console.log(req.body)
    if (error) {
        throw new ExpressError(400, error)
    } else {
        next()
    }
}

// review route
router.post("/", isLoggedIn, reviewvalidate, warpAsync(reviewController.postRoute));

// delete review route
router.delete("/:reviewId", isLoggedIn, isAuthor, warpAsync(reviewController.destroyRoute));
module.exports = router