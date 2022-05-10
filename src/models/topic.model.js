const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topicSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        require: true
    },
}, {timestamps: true,});

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;