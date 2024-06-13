var express = require("express");
var router = express.Router()

const authentication = require("../controllers/authenticationController");
var conditions = require("../controllers/conditionController");


router.get("/list", authentication.verifyToken, conditions.listConditions);

router.get("/:id", authentication.verifyToken, conditions.getConditionById);

router.post("/", authentication.verifyAdminToken, conditions.registerCondition);

router.put("/:id", authentication.verifyAdminToken, conditions.editCondition);

router.delete("/:id", authentication.verifyAdminToken, conditions.removeCondition);


module.exports = router;