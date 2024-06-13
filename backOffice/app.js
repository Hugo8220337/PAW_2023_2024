require("dotenv").config(); // load das variáveis de ambiente

var createError = require("http-errors");
var express = require("express");
var path = require("path");
const fs = require("fs");
var favicon = require('serve-favicon');
var cookieParser = require("cookie-parser");
var cors = require('cors');
var logger = require("morgan");

// BackOffice Routers
var authenticationRouter = require("./routes/authentication");
var administratorsRouter = require("./routes/administrators");
var employeesRouter = require("./routes/employees");
var entitiesRouter = require("./routes/entities");
var donorsRouter = require("./routes/donors");
var donationsRouter = require("./routes/donations");
var conditionsRouter = require("./routes/conditions");
var storesRouter = require("./routes/stores");
var statisticsRouter = require("./routes/statistics");

var app = express();

app.use(cors());


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // true para poder ler o body
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use("/login", authenticationRouter);
app.use("/administrators", administratorsRouter);
app.use("/employees", employeesRouter);
app.use("/entities", entitiesRouter);
app.use("/donors", donorsRouter);
app.use("/donations", donationsRouter);
app.use("/conditions", conditionsRouter);
app.use("/stores", storesRouter);
app.use("/statistics", statisticsRouter);


// Redirecionado para o login caso não se tenha colocado nenhuma rota
app.use((req, res) => {
  res.redirect('/login');
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", { layout: false, title: err.status }); // TODO colocar aqui a página 404
});

// Porta defolt do expressJS é a 3000: localhost:3000

module.exports = app;
