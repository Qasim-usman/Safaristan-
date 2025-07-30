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


// CREATE - New listing banane ka function
module.exports.newPostRoute = async (req, res) => {
  try {
    const listing = new Listing(req.body.listing);

    // Access uploaded files
    if (req.files && req.files.image && req.files.image2 &&req.files.image3)  {
      listing.image = {
        url: req.files.image[0].path,
        filename: req.files.image[0].filename
      };
      listing.image2 = {
        url: req.files.image2[0].path,
        filename: req.files.image2[0].filename
      };
    }
      listing.image3 = {
        url: req.files.image3[0].path,
        filename: req.files.image3[0].filename
      };
    

    listing.owner = req.user._id;

    const coordinates = await getCoordinatesFromLocation(
      req.body.listing.location,
      req.body.listing.country
    );
    listing.coordinates = coordinates;

    await listing.save();

    req.flash("success", "New listing created with 2 images!");
    res.redirect("/listings");
  } catch (error) {
    console.error("Error creating listing:", error);
    req.flash("error", "Error creating listing. Please try again.");
    res.redirect("/listings/new");
  }
};

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
    const originalUrlImage2 = listing.image2.url;
    const originalUrlImage3 = listing.image3.url;
    const transformedUrlImage = originalUrlImage.replace("/upload/", "/upload/w_230/");
    const transformedUrlImage2 = originalUrlImage2.replace("/upload/", "/upload/w_230/");
    const transformedUrlImage3= originalUrlImage3.replace("/upload/", "/upload/w_230/");

    res.render("listings/edit", { listing, transformedUrlImage,transformedUrlImage2,transformedUrlImage3 });
};

// UPDATE - Existing listing edit karne ka function
module.exports.editPutRoute = async (req, res) => {
    try {
        const { id } = req.params;
        
        // 1️⃣ Listing find aur update kariye
        const listing = await Listing.findByIdAndUpdate(id, {
            ...req.body.listing
        });
        
        // 2️⃣ Images update handle kariye (both image and image2)
        if (req.files) {
            // Handle first image
            if (req.files.image && req.files.image[0]) {
                listing.image = {
                    url: req.files.image[0].path,
                    filename: req.files.image[0].filename
                };
            }
            
            // Handle second image
            if (req.files.image2 && req.files.image2[0]) {
                listing.image2 = {
                    url: req.files.image2[0].path,
                    filename: req.files.image2[0].filename
                };
            }
        }
            if (req.files.image3 && req.files.image3[0]) {
                listing.image3 = {
                    url: req.files.image3[0].path,
                    filename: req.files.image3[0].filename
                };
            }
        
        
        // 3️⃣ COORDINATES UPDATE KARIYE
        if (req.body.listing.location && req.body.listing.country) {
            console.log('Updating coordinates for:', req.body.listing.location, req.body.listing.country);
            
            const coordinates = await getCoordinatesFromLocation(
                req.body.listing.location,
                req.body.listing.country
            );
            
            console.log('New coordinates:', coordinates);
            listing.coordinates = coordinates;
        }
        
        // 4️⃣ Save kariye
        await listing.save();
        
        req.flash("success", "Listing updated successfully!");
        res.redirect(`/listings/${id}`);
        
    } catch (error) {
        console.error("Error updating listing:", error);
        req.flash("error", "Error updating listing. Please try again.");
        res.redirect(`/listings/${id}/edit`);
    }
};
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