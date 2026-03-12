const express = require("express");
const {authMiddleware} = require("../middlewares/authMiddleware");
const productController = require("../controllers/productsController");
const router = express.Router();





router.post("/add-product",authMiddleware,productController.add_product)

router.get("/get-category",authMiddleware,productController.get_category)

router.get("/get-products" , authMiddleware , productController.getProducts);

router.get("/get-edit-product/:productId",authMiddleware,productController.getEditProduct);

router.post("/update-product", authMiddleware, productController.updateProduct);

router.post("/update-images",authMiddleware,productController.updateImage);

module.exports = router;