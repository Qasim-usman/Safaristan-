const Listing = require("../models/listing")
const { getCoordinatesFromLocation } = require('../utils/geoCoding');
const fetch = require('node-fetch');
module.exports.indexRoute = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
};
module.exports.newGetRoute=async(req, res) => {
    res.render("listings/new");
}

// CREATE - New listing banane ka function
// controllers/listingController.js

module.exports.newPostRoute = async (req, res) => {
    try {
        console.log('🚀 [RENDER] New listing creation started');
        console.log('📍 [RENDER] Location:', req.body.listing.location);
        console.log('🌍 [RENDER] Country:', req.body.listing.country);
        
        const listing = new Listing(req.body.listing);
        
        // Image handling
        if (req.file) {
            listing.image = {
                url: req.file.path,
                filename: req.file.filename
            };
        }
        
        listing.owner = req.user._id;
        
        // Geocoding with timeout protection
        console.log('🔍 [RENDER] Starting geocoding...');
        const startTime = Date.now();
        
        const coordinates = await Promise.race([
            getCoordinatesFromLocation(req.body.listing.location, req.body.listing.country),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Geocoding timeout')), 20000)
            )
        ]);
        
        const endTime = Date.now();
        console.log(`⏱️ [RENDER] Geocoding took: ${endTime - startTime}ms`);
        console.log('📍 [RENDER] Final coordinates:', coordinates);
        
        listing.coordinates = coordinates;
        
        await listing.save();
        console.log('✅ [RENDER] Listing saved successfully');
        
        req.flash("success", "New listing created!");
        res.redirect("/listings");
        
    } catch (error) {
        console.error('❌ [RENDER] Controller Error:', error);
        req.flash("error", "Error creating listing. Please try again.");
        res.redirect("/listings/new");
    }
}
module.exports.showGetRoute=async (req, res) => {
    const { id } = req.params;
   const listing = await Listing.findById(req.params.id)
    .populate({
        path: 'review',
        populate: { path: 'author' }
    }).populate("owner");
    console.log(listing);
    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
}
module.exports.editGetRoute = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    const originalUrlImage = listing.image.url;
    const transformedUrlImage = originalUrlImage.replace("/upload/", "/upload/h_150,w_230/");

    res.render("listings/edit", { listing, transformedUrlImage });
};


// UPDATE - Existing listing edit karne ka function
module.exports.editPutRoute = async (req, res) => {
    try {
        const { id } = req.params;
        
        // 1️⃣ Listing find aur update kariye
        const listing = await Listing.findByIdAndUpdate(id, {
            ...req.body.listing
        });
        
        // 2️⃣ Image update handle kariye
        if (req.file) {
            const url = req.file.path;
            const filename = req.file.filename;
            listing.image = { url, filename };
        }
        
        // 3️⃣ 🆕 COORDINATES UPDATE KARIYE
        console.log('Updating coordinates for:', req.body.listing.location, req.body.listing.country);
        
        const coordinates = await getCoordinatesFromLocation(
            req.body.listing.location,
            req.body.listing.country
        );
        
        console.log('New coordinates:', coordinates);
        listing.coordinates = coordinates;
        
        // 4️⃣ Save kariye
        await listing.save();
        
        req.flash("success", "Listing updated successfully!");
        res.redirect(`/listings/${id}`);
        
    } catch (error) {
        console.error("Error updating listing:", error);
        req.flash("error", "Error updating listing. Please try again.");
        res.redirect(`/listings/${id}/edit`);
    }
}
module.exports.deleteRoute=async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
}
// Purane listings mein coordinates add karne ke liye
module.exports.bulkUpdateCoordinates = async (req, res) => {
    try {
        // Jo listings mein coordinates nahi hain
        const listings = await Listing.find({
            $or: [
                { coordinates: { $exists: false } },
                { "coordinates.lat": 0 }
            ]
        });
        
        console.log(`Found ${listings.length} listings to update`);
        
        for (let listing of listings) {
            // Coordinates get kariye
            const coordinates = await getCoordinatesFromLocation(
                listing.location,
                listing.country
            );
            
            // Update kariye
            await Listing.findByIdAndUpdate(listing._id, { coordinates });
            console.log(`✅ Updated: ${listing.title}`);
            
            // API limit ke liye 1 second wait
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        res.json({
            success: true,
            message: `Updated ${listings.length} listings`,
            count: listings.length
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
