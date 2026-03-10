const mongosse = require("mongoose");
const mongoose = require("mongoose");

const {Schema,model} = mongoose;

const sellerToCustomerSchema = new Schema({
    myId :{
        type:String,
        required:true,
    },
    customer : {
        type : Array,
        default: []
    }
})


module.exports = model("sellerToCustomer", sellerToCustomerSchema);