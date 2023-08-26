const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
    },

    desc: {
        type: String,
        default: "",
        max: 100
    },
    img: {
        type: String
    },
    likes: {
        type: Array,
        default: []
    }
}, { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);