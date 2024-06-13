var express = require("express");
var router = express.Router();

var authentication = require("../controllers/authenticationController")
var statistics = require("../controllers/statisticsController");

/* GET list vai ser a homepage das entidades. Vai fazer a listagem */
router.get("/", authentication.verifyToken, statistics.list);

module.exports = router;