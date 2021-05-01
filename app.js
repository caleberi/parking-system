var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
var route = require("./routes/index.route");
var { Limiter } = require("./lib/index.lib");
var { Monitor } = require("./lib/RateMonitor");
var ParkingLotService = require("./service/ParkingLot.service");
var config = require("./config/settings");
var ParkingLotServiceDB = new ParkingLotService(
  path.join(__dirname, "./data/ParkingLot.data.json")
);
var app = express();
var RateLimiter = new Limiter();
var RateMonitor = new Monitor(RateLimiter);
RateMonitor.monitor();
app.use(logger("dev"));
app.use((req, res, next) => {
  _ = RateLimiter.start(req);
  if (req.requestlimitObject["xrate-limit-test"]) {
    next();
    return;
  } else {
    res.status(400).json({ rate_limit: req.requestlimitObject });
    return;
  }
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  "/",
  route({
    ParkingLotServiceDB,
  })
);

module.exports = app;
