const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bunkerPriceSensitivitySchema = new Schema({
    start: {
        type: Number,
        required: true
    },
    end: {
        type: Number,
        required: true
    },
    interval: {
        type: Number,
        required: true
    },
}, {timestamps: true,});

const BunkerPriceSensitivity = mongoose.model('BunkerPriceSensitivity', bunkerPriceSensitivitySchema);

module.exports = BunkerPriceSensitivity;