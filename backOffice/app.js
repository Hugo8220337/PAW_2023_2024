var createError = require("http-errors");
var express = require("express");
var path = require("path");
const fs = require("fs");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var administratorsRouter = require("./routes/administrators");
var entitiesRouter = require("./routes/entities");
var donorsRouter = require("./routes/donors");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// se calhar poderia criar um index router
app.get("/", (req, res) => {
  res.render('login/index', { title: 'Admin Login'});
});

app.use("/administrators", administratorsRouter);
app.use("/entities", entitiesRouter);
app.use("/donors", donorsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Porta defolt do expressJS é a 3000. localhost:3000

module.exports = app;
