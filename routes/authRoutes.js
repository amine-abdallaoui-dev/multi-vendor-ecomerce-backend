const authController = require("../controllers/authController");
const {authMiddleware} = require("../middlewares/authMiddleware");
const router = require("express").Router();


router.post("/admin-login",authController.admin_login);


router.get("/user_info",authMiddleware,authController.getUser);

router.post("/seller-register",authController.sellerRgister);

router.post("/seller-login",authController.sellerLogin);


module.exports = router;