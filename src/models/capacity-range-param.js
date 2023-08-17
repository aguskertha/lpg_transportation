const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const capacityRangeParamSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    start: {
        type: Number,
        required: true
    },
    end: {
        type: Number,
        required: true
    },
}, {timestamps: true,});

const CapacityRangeParam = mongoose.model('CapacityRangeParam', capacityRangeParamSchema);

module.exports = CapacityRangeParam;