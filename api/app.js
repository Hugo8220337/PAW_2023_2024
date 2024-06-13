require("dotenv").config(); // load das variáveis de ambiente



var createError = require('http-errors');
var express = require('express');
var path = require('path');
var mongoose = require("mongoose"); // para usar o monogDB
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');

var swaggerUi = require('swagger-ui-express'); //para usar o swagger
var swaggerDocument = require('./swagger.json'); //para usar o swagger

// api Routers
var authenticationRouter = require("./routes/authentication");
var administratorsRouter = require("./routes/administrators");
var employeesRouter = require("./routes/employees");
var entitiesRouter = require("./routes/entities");
var donorsRouter = require("./routes/donors");
var donationRequestsRouter = require("./routes/donationRequests");;
var donationsRouter = require("./routes/donations");
var conditionsRouter = require("./routes/conditions");
var storesRouter = require("./routes/stores");
var statisticsRouter = require("./routes/statistics");
var couponsRouter = require("./routes/coupons")

var app = express();

app.use(cors()); // para aceitar pedidos de servidores diferentes

/**
 *  Possibilita o envio de ficheiros
 */
app.use(fileUpload({
  createParentPath: true
}));

// Aumentar o tamanho máximo de um pedido
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// conexão com o mongoDB
mongoose.Promise = global.Promise;

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DB, {
    authSource: process.env.DB_AuthSource,
    user: process.env.DB_User,
    pass: process.env.DB_Password,
    useNewUrlParser: true,
  })
  .then(() => console.log("connection succesful"))
  .catch((err) => console.error(err));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // true para poder ler o body
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/login", authenticationRouter);
app.use("/api/administrators", administratorsRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/entities", entitiesRouter);
app.use("/api/donors", donorsRouter);
app.use("/api/donations", donationsRouter);
app.use("/api/donationRequests", donationRequestsRouter);
app.use("/api/conditions", conditionsRouter);
app.use("/api/stores", storesRouter);
app.use("/api/statistics", statisticsRouter);
app.use("/api/coupons", couponsRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes for Swagger
app.use("/api/v1/administrators", administratorsRouter);
app.use("/api/v1/authentication", authenticationRouter);
app.use("/api/v1/donationRequests", donationRequestsRouter);
app.use("/api/v1/donations", donationsRouter);
app.use("/api/v1/donors", donorsRouter);
app.use("/api/v1/employees", employeesRouter);
app.use("/api/v1/entities", entitiesRouter);
app.use("/api/v1/statistics", statisticsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
