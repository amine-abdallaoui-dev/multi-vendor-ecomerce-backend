const formidable = require("formidable")
const {responseReturn} = require("../utiles/response");
const cloudinary = require("cloudinary");
const categoryModel = require("../models/CategoryModel");
class categoryController  {

    addCategory = async (req,res)=>{


        const form = formidable();
        form.parse(req,async (err,fields,files)=>{


           if(err){
               return responseReturn(res,404,{error : "something went wrong"});
           }else{
               let {name} = fields;
               let {image} = files
               let TrimName = name.trim()
               const slug = TrimName.split(" ").join("-")

               cloudinary.config({
                   cloud_name : process.env.cloud_name,
                   api_key : process.env.cloud_key,
                   api_secret: process.env.cloud_secret,
                   secure : true
               })

               const result = await cloudinary.uploader.upload(image.filepath,{folder : "category"})

               if(result){
                   try {
                       const categories = await categoryModel.create({
                           name,
                           image : result.url,
                           slug,
                       })
                       responseReturn(res,201,{categories,message : "category added successfully"})

                   }catch(err){
                       responseReturn(res,500,{error : "Internal Server Error"});
                   }
               }else{
                   responseReturn(res,404,{error : "something went wrong"});
               }
           }




        })

    }

    // end method

    // start method
    getCategory = async (req,res)=>{
        const {searchValue,parPage,page} = req.query;
        console.log(searchValue)

        const skipPages = parseInt(parPage) * (parseInt(page) - 1);
        try{
            if(searchValue){
                const categories = await categoryModel.find({
                    $text : {$search : searchValue}
                }).skip(skipPages).limit(parPage).sort({createdAt : -1});

                const CategoriesCount = await categoryModel.find({
                    $text : {$search : searchValue}
                }).countDocuments()

                responseReturn(res,200,{categories,CategoriesCount})
            }else{

                const categories = await  categoryModel.find({ }).skip(skipPages).limit(parPage).sort({createdAt : -1});
                const CategoriesCount = await  categoryModel.find({ }).countDocuments()
                responseReturn(res,200,{categories,CategoriesCount})
            }
        }catch(err){
            responseReturn(res,500,{error : "Internal Server Error"});
        }
    }
}


module.exports = new categoryController