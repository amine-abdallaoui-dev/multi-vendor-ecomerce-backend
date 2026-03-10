const formidable = require("formidable");
const {responseReturn} = require("../utiles/response");
const cloudinary = require("cloudinary").v2;
const productsModel = require("../models/productsModel")
const CategoryModel = require("../models/CategoryModel")

class productController {

    add_product = async(req, res)=> {
        const form =  formidable({multiples : true});
        form.parse(req, async(err,fields,files)=>{

            try {
                if (err) {
                    console.log(err);
                } else {

                    let product = fields;
                    let images = files.images;
                    let name = product.title.trim()
                    let slug = name.split(" ").join('-')
                    cloudinary.config({
                        cloud_name: process.env.cloud_name,
                        api_key: process.env.cloud_key,
                        api_secret: process.env.cloud_secret,
                    })
                    let imagesUrl = [];
                    for (let i = 0; i < images.length; i++) {
                        const result = await cloudinary.uploader.upload(images[i].filepath, {folder: "products"})
                        imagesUrl = [...imagesUrl, result.url];
                    }
                    try {
                        const data = await productsModel.create({
                            sellerId : req.id,
                            title: product.title,
                            slug: slug,
                            brand: product.brand,
                            category: product.category,
                            stock: parseInt(product.stock),
                            price: parseInt(product.price),
                            discount: parseInt(product.discount),
                            description: product.description,
                            images: imagesUrl,
                            shopName: "me"
                        })
                        console.log(data)
                        responseReturn(res, 200, {message: "Product Added successfully "})
                    } catch (err) {
                        responseReturn(res, 404, {error: "something went wrong"});
                    }

                }
            }catch (err){
                console.log(err);
            }
        })
    }

    // end method ********

    get_category = async(req,res)=>{

                    console.log("im her")

        try {
            const category = await CategoryModel.find({});
            console.log(category)
            responseReturn(res, 200, {category , message : "categories found"});
        }catch(err){
             responseReturn(res, 500, {error : "Internal Server Error"});

        }

    }

}

module.exports = new productController;