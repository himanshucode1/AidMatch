const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

    serviceType:
    {
        type: String,
        required: true
    },

    userLatitude:
    {
        type: Number,
        required: true
    },

    userLongitude:
    {
        type: Number,
        required: true
    },

    helperId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Helper"
    },

    status:
    {
        type: String,
        default: "assigned"
    }

});

module.exports = mongoose.model("Booking", bookingSchema);
