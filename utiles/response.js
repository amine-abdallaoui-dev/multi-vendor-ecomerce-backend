module.exports.responseReturn = async (res,code,data)=>{
    return res.status(code).json(data);
}