const {responseReturn} = require("../utiles/response");
const adminsModel = require("../models/adminsModel")
const bcrypt = require("bcrypt");
const {createToken} = require("../utiles/token");
const sellerModel = require("../models/sellerModel")
const sellerToCustomer = require("../models/sellerToCustomer");
class  authController {
    // start admin login logic
    admin_login = async (req, res) => {

        const {email,password} = await  req.body;

        try{
            const admin = await adminsModel.findOne({email}).select("+password");


            if(admin){
                const checkPassword = await bcrypt.compare(password , admin.password);
                if(checkPassword){
                    const data = await {id : admin.id , role : admin.role};
                    console.log(data);
                  const token =  await createToken(data)

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
    // start admin login logic

    // start get user  logic
    getUser = async (req, res) => {
        const {role,id} = req;
        if(role === "admin"){
            try{
                const user = await  adminsModel.findById(id)
                if(user){
                    responseReturn(res,200,{user : user});
                }else{
                    responseReturn(res,404,{error : "User not found!"})
                }
            }catch(err){
                console.log(error.message)
            }
        }else{
            try{
                const user = await  sellerModel.findById(id);
                if(user){
                    responseReturn(res,200,{user : user});
                }
            }catch(err){
                responseReturn(res,404,{error : "User not found!"})
            }
        }
    }

    // end get user logic

    // start seller register logic

    sellerRgister = async (req, res) => {
         const {name,email,password} = req.body;

         try{
             const user = await sellerModel.findOne({email});
             if(user){
                responseReturn(res,404,{error : "Email already exists"})
             }else{
                 const seller = await sellersModel.create({
                     name,
                     email,
                     password : await bcrypt.hash(password,10),
                     role : "seller",
                     method : "manuel",

                 })
                 const seller_id = await sellerToCustomer.create({
                     myId : seller.id,
                     customer : []
                 })
                 const token = await createToken({role : seller.role , id : seller.id})
                 res.cookie("access_token",token,{expires : new Date(Date.now() + 7*24*60*60*1000)})
                 responseReturn(res,200,{token,message:"Register success !"})

             }
         }catch(err){
            console.log(err.message)
         }



    }

    // end seller register logic

    // start seller Login logic

    sellerLogin = async (req, res) => {
        const {email,password} = req.body;
        console.log(req.body)

        if(email !== "" && password !== ""){
           try{
               const seller = await sellerModel.findOne({email}).select("+password");
               if(seller){
                   console.log(seller)
                   const checkPassword = await bcrypt.compare(password , seller.password)
                   if(checkPassword){
                       const token = await createToken({
                           role : seller.role,
                           id : seller.id
                       })
                       res.cookie("access_token",token,{expires : new Date(Date.now() + 7*24*60*60*1000)})
                        responseReturn(res,200,{token,message:"Login success !"})
                   }else {
                       responseReturn(res,404,{error : "Password Wrong !"})
                   }
               }else{
                    responseReturn(res,404,{error : "Email Not Found !"})
               }
           }catch(err){
               console.log(err.message)
           }
        }

    }
}



module.exports = new authController;