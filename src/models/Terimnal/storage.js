const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storageSchema = new Schema({
    storageName: {
        type: String,
        require: true
    },
    facilityTypes: [
        {
            facilityName: {
                type: String,
                require: true
            },
            specifications: [
                {
                    name: {
                        type: String,
                        require: true
                    },
                    unitCost: {
                        type: Number,
                        require: true
                    },
                    unit: {
                        type: String,
                        require: true
                    }
                }
            ]
        }
    ],

}, {timestamps: true,});

const Storage = mongoose.model('Storage', storageSchema);

module.exports = Storage;