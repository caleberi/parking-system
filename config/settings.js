require("dotenv").config();

const environment = {};
environment.staging = {
  parkingLotSize: parseInt(process.env.PARKING_LOT_SIZE),
  port: process.env.APP_PORT,
  env: process.env.NODE_ENV,
  rateCount: parseInt(process.env.RATE_COUNT),
  rateTime: parseInt(process.env.RATE_TIME),
  url: process.env.APP_URL,
  monitorCleanUpTime: parseInt(process.env.RATE_MONTIOR),
};

environment.production = {};

var currentEnv =
  typeof process.env.NODE_ENV.toLowerCase() == "string" &&
  typeof process.env.NODE_ENV != "undefined"
    ? process.env.NODE_ENV.toLowerCase()
    : "staging";

var appEnvironment = environment.hasOwnProperty(currentEnv)
  ? environment[currentEnv]
  : environment.staging;

module.exports = appEnvironment;
