const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "please enter email "]
    },
    message: {
        type:String,
        required: [true, "Please enter message"]
    },
    

});



module.exports = mongoose.model("Contact",contactSchema);