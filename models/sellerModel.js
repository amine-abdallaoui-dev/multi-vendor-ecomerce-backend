const mongoose=require('mongoose')

const {Schema,model} = mongoose;


const sellerSchema = new Schema({
    name : {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true,
    },
    password : {
        type: String,
        required: true,
        select: false
    },
    role : {
        type: String,
        required: true,
    },
    image : {
        type: String,
        default : ""
    },
    method : {
        type: String,
        required: true,
    },
    status : {
        type: String,
        default : "pending",
    },
    payment : {
        type: String,
        default: "Inactive",
    },
    shopInfo : {
        type: Object,
        default: {},
    }


},{timestamps : true})


module.exports = model("sellers",sellerSchema)

