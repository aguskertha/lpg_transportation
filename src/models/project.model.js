const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    topicID: {
        type: String,
        require: true
    },
}, {timestamps: true,});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;