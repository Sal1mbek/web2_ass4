const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tourSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    dates: {
        type: String,
        required: true,
    },
    adults: {
        type: Number,
        required: true,
    },
    children: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;