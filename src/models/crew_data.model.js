const mongoose = require('mongoose');

const CrewData = mongoose.model('CrewData', {
    name: {
        type: String,
        require: true
    },
    DeckDept: {
        deckMaster: {
            type: Number,
            require: true
        },
        deckChiefOfficer: {
            type: Number,
            require: true
        },
        deckOfficer: {
            type: Number,
            require: true
        },
        deckRadioOperator: {
            type: Number,
            require: true
        },
        deckBoatswain : {
            type: Number,
            require: true
        },
        deckAbleBodied : {
            type: Number,
            require: true
        },
        deckOrdinarySeamen : {
            type: Number,
            require: true
        },
        deckChef : {
            type: Number,
            require: true
        },
        deckAssistantChef : {
            type: Number,
            require: true
        },
        deckOthers : {
            type: Number,
            require: true
        },
    },
    EngineDept: {
        engineChiefEngineer : {
            type: Number,
            require: true
        },
        engineChiefMachinist : {
            type: Number,
            require: true
        },
        engineMachinist : {
            type: Number,
            require: true
        },
        engineForemen : {
            type: Number,
            require: true
        },
        engineOiler : {
            type: Number,
            require: true
        },
        engineWiper : {
            type: Number,
            require: true
        },
        engineOthers : {
            type: Number,
            require: true
        },
    },
    total : {
        type: Number,
        require: true
    },
});

module.exports = CrewData;