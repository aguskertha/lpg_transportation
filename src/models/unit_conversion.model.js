const mongoose = require('mongoose');

const UnitConversion = mongoose.model('UnitConversion', {
    KGtoLitre: {
        type: Number,
        require: true
    },
    CBMtoLitre:{
        type: Number,
        require: true
    },
    KGtoMMBTU:{
        type: Number,
        require: true
    },
    CBMtoMT:{
        type: Number,
        require: true
    },
    USDtoIDR:{
        type: Number,
        require: true
    },
    MTtoKG:{
        type: Number,
        require: true
    },
    KMtoMILE:{
        type: Number,
        require: true
    },
    KMtoNauticalMILE:{
        type: Number,
        require: true
    },
});


module.exports = UnitConversion;