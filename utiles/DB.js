const mongoose = require("mongoose");


module.exports.dbConnect = async ()=>{
    try{
        await mongoose.connect(process.env.DB_URL).then(()=>{
            console.log("database connected");
        });
    }catch(err){
        console.log(err.message);
    }
}