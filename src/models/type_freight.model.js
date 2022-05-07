const mongoose = require('mongoose');

const TypeFreight = mongoose.model('TypeFreight', {
    name: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        require: true
    },
});

module.exports = TypeFreight;