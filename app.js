var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
var route = require("./routes/index.route");
var { Limiter } = require("./lib/index.lib");
var ParkingLotService = require("./service/ParkingLot.service");
var ParkingLotServiceDB = new ParkingLotService(
  path.join(__dirname, "./data/ParkingLot.data.json")
);
var app = express();
var RateLimiter = new Limiter();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  _ = RateLimiter.start(req);
  if ("requestlimitObject" in req) {
    next();
    return;
  } else {
    res.rate_limit = {
      ...req.requestlimitObject,
    };
    res.redirect(301, "/api/limit");
    return;
  }
});

app.use(
  "/",
  route({
    ParkingLotServiceDB,
  })
);

module.exports = app;
