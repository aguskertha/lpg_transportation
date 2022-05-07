const mongoose = require('mongoose');

const UnitConversion = mongoose.model('UnitConversion', {
    KGtoLitre: {
        type: "Decimal128",
        require: true
    },
    CBMtoLitre:{
        type: "Decimal128",
        require: true
    },
    KGtoMMBTU:{
        type: "Decimal128",
        require: true
    },
    CBMtoMT:{
        type: "Decimal128",
        require: true
    },
    USDtoIDR:{
        type: "Decimal128",
        require: true
    }
});

module.exports = UnitConversion;