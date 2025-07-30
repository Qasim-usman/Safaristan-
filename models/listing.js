const { types, ref } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,  // spelling fix: reqiured -> required
    },
    description: {
        type: String,
    },
    image: {
        filename: {
            type: String
        },
        url: {
            type: String,
            default: "https://i.pinimg.com/736x/81/5c/56/815c56bf3ba4127c2db5b4b047abf2eb.jpg"
        }
    },
    image2: {
        filename: {
            type: String
        },
        url: {
            type: String,
            default: "https://i.pinimg.com/736x/81/5c/56/815c56bf3ba4127c2db5b4b047abf2eb.jpg"
        }
    },
    image3: {
        filename: {
            type: String
        },
        url: {
            type: String,
            default: "https://i.pinimg.com/736x/81/5c/56/815c56bf3ba4127c2db5b4b047abf2eb.jpg"
        }
    },
    price: {
        type: Number,
        required: true,  // spelling fix: reqiured -> required
    },
    location: {
        type: String,
    },
    country: {
        type: String
    },
    
    // YE ADD KARO - Coordinates field
    coordinates: {
        lat: {
            type: Number,
            default: 31.5204  // Lahore default
        },
        lng: {
            type: Number, 
            default: 74.3587  // Lahore default
        }
    },
    
    review: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
})

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({
            _id: { $in: listing.review },
        });
    }
});

const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing