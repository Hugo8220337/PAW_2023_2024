const express = require("express");
const router = express.Router();

const authentication = require("../controllers/authenticationController");

// get the html page
router.get("/", authentication.loginGet);

// the actual login
router.post("/", authentication.loginPost);

router.get("/signout", authentication.signout);

module.exports = router;