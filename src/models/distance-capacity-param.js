const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const distanceCapacityParamSchema = new Schema({
    lower: {
        type: Number,
        required: true
    },
    upper: {
        type: Number,
        required: true
    },
    foc: {
        type: Number,
        required: true
    },
    roundtrip: {
        type: Number,
        required: true
    },
}, {timestamps: true,});

const DistanceCapacityParam = mongoose.model('DistanceCapacityParam', distanceCapacityParamSchema);

module.exports = DistanceCapacityParam;