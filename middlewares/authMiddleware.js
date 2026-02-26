const responseReturn = require("../utiles/response");

const jwt = require("jsonwebtoken");


module.exports.authMiddleware = async (req,res,next)=>{
    const {access_token} =  req.cookies;
    if(!access_token){
       res.status(409).json({error:"please login first" });
    }else{
        try{
            const decodeToken = await jwt.verify(access_token,process.env.SECRET);
            req.role = decodeToken.id
            req.id = decodeToken.id
            next();
        }catch(error){
            return res.status(409).json({error : error.message});
        }
    }
}