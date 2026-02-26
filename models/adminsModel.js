const {Schema,model} = require("mongoose");


const AdminsSchema = new Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    password: {
        type : String,
        required : true,
    },
    image : {
        type : String,
        required : true,
    },
    roles : {
        type : String,
        required : true,
    }
})


module.exports = model("admins",AdminsSchema);