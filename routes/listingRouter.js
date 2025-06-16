const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js").default;
const { isLoggedIn,validateListing,isOwnerListing } = require("../middleware.js");
const listingController = require("../controllers/listingController.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single('listing[image]'),validateListing,
        wrapAsync(listingController.createListing)
    )

//new Listing form 
router.get("/new",isLoggedIn,listingController.renderNewForm)

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwnerListing,
        validateListing,upload.single('listing[image]'),
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn, 
        isOwnerListing,
        wrapAsync(listingController.destroyListing)
    );


//get edit form 
router.get("/:id/edit",
    isLoggedIn,
    isOwnerListing,
    wrapAsync(listingController.renderEditForm)
)


module.exports = router;
