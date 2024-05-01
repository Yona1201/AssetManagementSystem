const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    banner: {
        type: String,
    },
    header: {
        type: String,
    },
    image: {
        type: String,
    },
    description: {
        type: String,
    },
    tagLine: {
        type: String
    }
});

assetSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const About = mongoose.model('About', assetSchema);

module.exports = About;
