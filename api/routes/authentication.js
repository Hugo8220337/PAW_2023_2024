const express = require("express");
const router = express.Router();

const authentication = require("../controllers/authenticationController");

/** Rota para fazer login de um Administrador */
router.post("/admin", authentication.loginAdminArea);

/** Rota para fazer login de um doador */
router.post("/donor", authentication.loginDonor);

/** Rota para fazer login de um entidade */
router.post("/entity", authentication.loginEntity);

// registar entity
router.post("/registerEntity", authentication.registerEntity);

// Rota para registar donor
router.post("/registerDonor", authentication.registerDonor);

// Rota  para o porcesso do esquecimento da password
router.post("/forgotPassword", authentication.forgotPassword);

//Rota para dar reset a password
router.post("/resetPassword/:token", authentication.resetPassword);


module.exports = router;