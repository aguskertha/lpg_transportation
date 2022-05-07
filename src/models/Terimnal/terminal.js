const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const terminalSchema = new Schema({
    terminalName: {
        type: String,
        require: true
    },
    infrastructureCost: {
        type: Number,
        require: true
    },
    taxPermit: {
        type: Number,
        require: true
    },
    PMTFeed: {
        type: Number,
        require: true
    },
    totalCapex: {
        type: Number,
        require: true
    },
    disposalPrice: {
        type: Number,
        require: true
    },
    totalOpex: {
        type: Number,
        require: true
    },

}, {timestamps: true,});

const Terminal = mongoose.model('Terminal', terminalSchema);

module.exports = Terminal;