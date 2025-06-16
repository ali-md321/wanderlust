const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req,res,next) => {
        const listing = await Listing.findById(req.params.id);
        const newReview = new Review({...req.body.review,author : req.user._id});
        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();
        req.flash("success","New Review is Created!!")
        res.redirect(`/listings/${listing._id}`);
    }

module.exports.destroyReview = async(req,res,next) => {
    let {id,reviewId} = req.params;
    const result = await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!")
    res.redirect(`/listings/${id}`);
}