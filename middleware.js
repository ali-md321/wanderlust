const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.validateListing = (req,res,next) => {
    const result = listingSchema.validate(req.body);
    //if(!req.body){ throw new ExpressError(400,"listing is required!!")}
    if(result.error){
        const errMsg = result.error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg)
    }
    else{
        next();
    }
}

module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(!req.body) throw new ExpressError(400,"Enter a valid Review")
    if(error){
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        //redirectUrl save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to perform!!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwnerListing = async(req,res,next) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not owner of this listing!")
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next) => {
    let {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not author of this review!")
        return res.redirect(`/listings/${id}`);
    }
    next();
}
