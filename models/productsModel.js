const mongoose = require('mongoose');
const { Schema , model} = mongoose;


const ProductSchema = new Schema({
    sellerId : {
        type: Schema.ObjectId,
        required: true
    },
    title : {
        type: String,
        required: true
    },
    brand : {
        type: String,
        required: true
    },
    category : {
        type: String,
        required: true
    },
    slug : {
        type: String,
        required: true
    },
    stock : {
        type: Number,
        required: true
    },
    price : {
        type: Number,
        required: true
    },
    discount : {
        type: Number,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    images : {
        type: Array,
        required: true
    },
    rating : {
        type: Number,
        default: 0
    },
    shopName : {
        type: String,
        required: true
    },

})
ProductSchema.index({
    title : "text",
    description : "text",
    shopName : "text",
    brand : "text",
    category: "text",
},{
    weights : {
        title : 5,
        description : 4,
        brand : 3,
        category: 2,
        shopName : 1
    }
})

module.exports = model("products", ProductSchema);