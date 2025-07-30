const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema");
const { isLoggedIn, isOwner } = require("../middlewares");
const listingController = require("../controllers/listings")
const multer  = require('multer')
const {storage}=require("../cloudConfig")
const upload = multer({ storage })

// Middleware to validate schema
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details.map(el => el.message).join(", "));
    }
    next();
};
// ===========================
// ROUTES
// ===========================

// Create + Index
router.route("/")
  .get(wrapAsync(listingController.indexRoute))
  .post(
    isLoggedIn,
    validateListing,
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "image2", maxCount: 1 }
    ]),
    wrapAsync(listingController.newPostRoute)
  );

router.get("/admin/bulk-update", listingController.bulkUpdateCoordinates);
// New Form
router.get("/new", isLoggedIn, wrapAsync(listingController.newGetRoute));

// Show, Edit, Delete, Update
router.route("/:id")
    .get(wrapAsync(listingController.showGetRoute))
    .put(isLoggedIn, isOwner,  upload.single("listing[image][url]"),validateListing, wrapAsync(listingController.editPutRoute))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteRoute));

// Edit Form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editGetRoute));

module.exports = router;
