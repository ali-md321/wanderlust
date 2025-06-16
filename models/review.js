const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    comment :{
        type : String,
        required : true
    },
    rating : {
        type: Number,
        min : 1, max : 5,
        default : 3
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
})

module.exports = mongoose.model("Review",reviewSchema);