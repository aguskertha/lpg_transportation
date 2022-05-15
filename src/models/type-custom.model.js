const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const typeCustomSchema = new Schema({
    data:{
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, {timestamps: true,});

const TypeCustom = mongoose.model('TypeCustom', typeCustomSchema);

module.exports = TypeCustom;