const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const receivingSchema = new Schema({
    receivingName: {
        type: String,
        require: true
    },
    facilityTypes: [
        {
            facilityName: {
                type: String,
                require: true
            },
            unitCost: {
                type: Number,
                require: true
            },
            unit: {
                type: String,
                require: true
            },
            
        }
    ],

}, {timestamps: true,});

const Receiving = mongoose.model('Receiving', receivingSchema);

module.exports = Receiving;