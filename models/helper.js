const mongoose = require("mongoose");

const helperSchema = new mongoose.Schema({

    name:
    {
        type: String,
        required: true
    },

    skills:
    {
        type: [String],
        required: true
    },

    latitude:
    {
        type: Number,
        required: true
    },

    longitude:
    {
        type: Number,
        required: true
    },

    rating:
    {
        type: Number,
        required: true
    },

    available:
    {
        type: Boolean,
        required: true
    }

});

module.exports = mongoose.model("Helper", helperSchema);
