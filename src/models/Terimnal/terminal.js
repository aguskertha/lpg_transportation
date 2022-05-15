const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const terminalSchema = new Schema({
    terminalName: {
        type: String,
        required: true
    },
    ProjectID: {
        type: String,
        required: true
    },
    Receiving:{
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    Storage:{
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    LPGFillingStation:{
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    ControlRoom:{
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    FirefightingSystem:{
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    Utility:{
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    OfficeBuilding:{
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    LandRent:{
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    Capex:{
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    Opex:{
        type: mongoose.Schema.Types.Mixed,
        required: true
    }

}, {timestamps: true,});

const Terminal = mongoose.model('Terminal', terminalSchema);

module.exports = Terminal;