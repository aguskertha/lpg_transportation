const mongoose = require('mongoose');

const TypeVoyage = mongoose.model('TypeVoyage', {
    name: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        require: true
    },
});

module.exports = TypeVoyage;