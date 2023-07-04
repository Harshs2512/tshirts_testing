const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    catName: {
        type: String,
        required: true,
    },

    slug: {
        type: String,
        lowercase: true,
    },
});

module.exports = mongoose.model("Category", categorySchema);