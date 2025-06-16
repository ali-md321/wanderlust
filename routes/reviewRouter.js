const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js").default;
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviewController.js");

//post-add review for listing
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);

//Delete review of listing
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;