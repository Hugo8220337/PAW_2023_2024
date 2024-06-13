var express = require("express");
var router = express.Router();

const authentication = require("../controllers/authenticationController");
var statistics = require("../controllers/statisticsController");

/**
 * Devolve a quantidade de entidades, doadores, doações e items guardados na base de dados
 * Usado no home do frontOffice
 */
router.get("/numbers", statistics.getNumbers);

/** Devolve os countries para os donors */
router.get("/donors/countries", authentication.verifyAdminToken, statistics.donorsCountries);

/** Devolve os countries para as entidades */
router.get("/entities/countries", authentication.verifyAdminToken, statistics.entitiesCountries);

/** Devolve os anos */
router.get("/donations/year", authentication.verifyAdminToken, statistics.donationsYear);

/** Devolve os meses */
router.get("/donations/month", authentication.verifyAdminToken, statistics.donationsMonth);

module.exports = router;