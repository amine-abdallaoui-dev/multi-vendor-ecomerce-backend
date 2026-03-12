const formidable = require("formidable");
const {responseReturn} = require("../utiles/response");
const cloudinary = require("cloudinary").v2;
const productsModel = require("../models/productsModel")
const CategoryModel = require("../models/CategoryModel")

class productController {
  add_product = async (req, res) => {
    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {
      try {
        if (err) {
          console.log(err);
        } else {
          let product = fields;
          let images = files.images;
          let name = product.title.trim();
          let slug = name.split(" ").join("-");
          cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.cloud_key,
            api_secret: process.env.cloud_secret,
          });
          let imagesUrl = [];
          for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.uploader.upload(
              images[i].filepath,
              { folder: "products" },
            );
            imagesUrl = [...imagesUrl, result.url];
          }
          try {
            const data = await productsModel.create({
              sellerId: req.id,
              title: product.title,
              slug: slug,
              brand: product.brand,
              category: product.category,
              stock: parseInt(product.stock),
              price: parseInt(product.price),
              discount: parseInt(product.discount),
              description: product.description,
              images: imagesUrl,
              shopName: "me",
            });
            console.log(data);
            responseReturn(res, 200, {
              message: "Product Added successfully ",
            });
          } catch (err) {
            responseReturn(res, 404, { error: "something went wrong" });
          }
        }
      } catch (err) {
        console.log(err);
      }
    });
  };

  // end method ********

  get_category = async (req, res) => {
    console.log("im her");

    try {
      const category = await CategoryModel.find({});
      console.log(category);
      responseReturn(res, 200, { category, message: "categories found" });
    } catch (err) {
      responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  //end method

  getProducts = async (req, res) => {
    const { page, parPage, search } = req.query;
    const { id } = req;

    console.log(page, parPage, search, id);
    const skipPage = parseInt(parPage) * (parseInt(page) - 1);
    try {
      if (search) {
        let products = await productsModel
          .find({
            $text: { $search: search },
            sellerId: id,
          })
          .skip(skipPage)
          .limit(parPage);
        let productsCount = await productsModel
          .find({
            $text: { $search: search },
            sellerId: id,
          })
          .countDocuments();
        responseReturn(res, 200, { products, productsCount });
      } else {
        const products = await productsModel
          .find({ sellerId: id })
          .skip(skipPage)
          .limit(parPage);
        const productsCount = await productsModel
          .find({ sellerId: id })
          .countDocuments();
        console.log(products);
        responseReturn(res, 200, { products, productsCount });
      }
    } catch (error) {
      responseReturn(res, 200, { error: error.message });
    }
  };

  // end method

  getEditProduct = async (req, res) => {
    const { productId } = req.params;

    try {
      const product = await productsModel.findById(productId);
      responseReturn(res, 200, { product });
    } catch (err) {
      responseReturn(res, 500, { error: err.message });
    }
  };

  //end method

  updateProduct = async (req, res) => {
    const {
      proId,
      title,
      brand,
      category,
      stock,
      price,
      discount,
      description,
    } = req.body;
    const { productId } = proId;

    try {
      await productsModel.findByIdAndUpdate(productId, {
        title,
        brand,
        category,
        stock,
        price,
        discount,
        description,
      });

      const product = await productsModel.findById([productId]);
      responseReturn(res, 200, {
        product,
        message: "Product updated successfully !",
      });
    } catch (err) {
      responseReturn(res, 500, {
        error: "Internal server error !",
      });
    }
  };

  // end method

    updateImage = async(req,res)=>{
        
        const form = formidable({multiples : true});
        form.parse(req, async(err,fields,files)=>{
          
          if(err){
            console.log(err.message)
          }else{
            const { oldImage, productId } = fields;
            const {newImage} = files;
            try{
              cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.cloud_key,
                api_secret: process.env.cloud_secret,
              });

              const result = await cloudinary.uploader.upload(newImage.filepath,{folder : "products"})
              if(result){
               try{
                 let { images } = await productsModel.findById(productId);
                 const index = await images.findIndex(
                   (img) => img === oldImage,
                 );

                 images[index] = result.url;


                 await productsModel.findByIdAndUpdate(productId, {
                   images,
                 }); 

                 const product = await productsModel.findById(productId);

                 responseReturn(res,201,{product,message : "product updated successfully"})

               }catch(eror){
                  
                responseReturn(res, 401, {
                  error: "product updated Field !",
                });

               }

                
              }

            }catch(error){
              console.log({'from her ': error.message})
            }
          }            

        })
        



    }
}

module.exports = new productController;