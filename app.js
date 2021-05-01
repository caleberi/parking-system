var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
var route = require("./routes/index.route");
var { Limiter } = require("./lib/index.lib");
var ParkingLotService = require("./service/ParkingLot.service");
var config = require("./config/settings");
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
    req.rate_limit = {
      ...req.requestlimitObject,
    };
    res.redirect(200, config.url + "/api/limit");
    return;
  }
});

app.use(
  "/",
  route({
    ParkingLotServiceDB,
  })
);

app.get("/api/limit", (req, res, next) => {
  console.log("here we are");
  if (req.requestlimitObject) {
    res.status(400).json({ rate_limit: req.requestlimitObject });
    return;
  }
  next();
});

module.exports = app;
