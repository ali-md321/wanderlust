const Listing = require("../models/listing.js");

module.exports.index = async(req,res,next) => {
    const listings = await Listing.find();
    res.render("listings/allListings",{listings});
}

module.exports.showListing = async(req,res,next) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
                                .populate({
                                    path : "reviews",
                                    populate : {
                                        path : "author"
                                    }
                                })
                                .populate("owner");
    if(!listing){
        req.flash("error","Your Listing does not exist!")
        return res.redirect("/listings");
    }
    res.render("listings/show",{listing})
}

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new");
}

module.exports.createListing = async(req,res,next) => {
        let url,filename;
        if(req.file){
            url = req.file.path;
            filename = req.file.filename;
        }
        //console.log(url ,"...",filename);
        const listing = new Listing({...req.body.listing,owner : req.user._id});
        if(req.file){
            listing.image = {url,filename}
        }
        await listing.save();
        req.flash("success","New Listing is Created!!")
        res.redirect("/listings");
    }

module.exports.renderEditForm = async(req,res,next) => {
        let {id} = req.params;
        const listing = await Listing.findById(id);
        if(!listing){
            req.flash("error","Your Listing is does not exist to edit!")
            return res.redirect("/listings");
        }
        let showImageUrl = listing.image.url;
        showImageUrl = showImageUrl.replace("/upload","/upload/h_300,w_250");
        res.render("listings/edit",{listing,showImageUrl});
    }

module.exports.updateListing = async(req,res,next) => {
    let {id} = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id,{...req.body.listing},{new:true});
    if(req.file){
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = {url,filename};
        await updatedListing.save()
    }
    req.flash("success","Listing Updated!!")
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req,res,next) => {
    let {id} = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    console.log("Deleted Listing: ",listing);
    req.flash("success","Listing Deleted!")
    res.redirect("/listings");
}
