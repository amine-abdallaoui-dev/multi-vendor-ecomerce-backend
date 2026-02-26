const {responseReturn} = require("../utiles/response");
const adminsModel = require("../models/adminsModel")
const bcrypt = require("bcrypt");
const {createToken} = require("../utiles/token");
class  authController {
    admin_login = async (req, res) => {

        const {email,password} = await  req.body;

        try{
            const admin = await adminsModel.findOne({email}).select("+password");
            if(admin){
                const checkPassword = await bcrypt.compare(password , admin.password);
                if(checkPassword){
                  const token =  await createToken({
                        id : admin.id,
                        role : admin.role
                    })
                    res.cookie("access_token",token,{
                        expires : new Date(Date.now() + 7*24*60*60*1000)
                    })
                    responseReturn(res,200,{token,message : "Login success !"})

                }else{
                    responseReturn(res,404,{error : "Password Wrong !"})
                }
            }else{
                responseReturn(res,404,{error : "Email Not Found !"})

            }
        }catch(err){
            responseReturn(res,500,err.message)
        }



    }

    getUser = async (req, res) => {
        const {role,id} = req;
        if(role === "admin"){
            try{
                const user = await  adminsModel.findById(id)
                console.log(user)
                if(user){
                    responseReturn(res,200,{userInfo : user});
                }else{
                    console.log("User not found")
                }
            }catch(err){
                console.log(error.message)
            }
        }
    }
}

module.exports = new authController;