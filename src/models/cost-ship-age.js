const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const costShipAgeSchema = new Schema({
    shipAge: {
        type: String,
        required: true
    },
    constantFactor: {
        type: Number,
        required: true
    },
}, {timestamps: true,});

const CostShipAge = mongoose.model('CostShipAge', costShipAgeSchema);

module.exports = CostShipAge;