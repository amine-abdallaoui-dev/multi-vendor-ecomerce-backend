const express = require("express");
const {authMiddleware} = require("../middlewares/authMiddleware");
const productController = require("../controllers/productsController");
const router = express.Router();





router.post("/add-product",authMiddleware,productController.add_product)

router.get("/get-category",authMiddleware,productController.get_category)

module.exports = router;