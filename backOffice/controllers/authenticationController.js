const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const emailValidator = require("email-validator");

// todas as funções em baixo vão ser métdodos do objeto authenticationController
const authenticationController = {};

authenticationController.loginGet = (req, res) => {
  if (typeof req.user != "undefined") {
    return res.redirect("/");
  }

  const { error } = req.query;
  res.render("login/index", { title: "Login", error: error });
};

authenticationController.loginPost = async (req, res) => {
  const fetch = await import("node-fetch"); // import dinámico porque em cima não dá

  if (typeof req.user != "undefined") {
    return res.redirect("/");
  }

  const { email, password } = req.body;

  // validar se os campos foram preenchidos, e se o email foi devidamente preenchido
  if (email == undefined || !emailValidator.validate(email) || password == undefined) {
    res.redirect("/login?error=Password ou email inválidos");
    return;
  }

  try {
    const response = await fetch.default(`http://localhost:5000/api/login/admin`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    switch(response.status) {
      case 400:
        return res.redirect("/login?error=Password ou email inválidos");
      case 401:
        return res.redirect("/login?error=Não autorizado");
    }

    const data = await response.json();
    if (!data || data.token === '{}') {
      return res.redirect("/login?error=Email ou senha incorretos");
    }

    res.cookie("token", data.token); // define a cookie com o token
    res.cookie("userType", data.userType); // define a cookie com o tipo de utilizador

    // se for um admin encaminha para a página dos administradores
    // se for empregrado encaminha para as entidades (assim não mostra na navbar opções que não podem mexer)
    (data.userType == "admin") ? res.redirect("/administrators") : res.redirect("/entities");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error. " + error);
  }
};

authenticationController.signout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
};

authenticationController.verifyToken = (req, res, next) => {
  var token = req.cookies.token;
  
  if (!token) {
    return res.redirect("/login");
  }

  next();
};

module.exports = authenticationController;
