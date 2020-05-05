const mongoose = require('mongoose');
const Schema = mongoose.Schema
const productSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        default: 0
    },
    images: {
        type: Array,
        default: []
    },
    categories: {
        type: Number,
        default: 1
    },
    sold: {
        type: Number,
        maxlength: 100,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    comments: {
        type: Array,
        default: []
    }
    //know when products are created 
}, { timestamps: true })

//initiating the $text for the search function
productSchema.index({
    title: 'text',
    description: 'text'
}, {
        //the title has more search power than description
        weights: {
            title: 5,
            description: 1
        }
    })

const Products = mongoose.model('Product', productSchema);
module.exports = { Products }