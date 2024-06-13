
var express = require("express");
var router = express.Router();

const authentication = require("../controllers/authenticationController");
var coupon = require("../controllers/couponController");

/*Rota para gerar um token */
router.post("/generate", authentication.verifyToken, coupon.generate);

module.exports = router;