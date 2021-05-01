const util = require("util");
const config = require("../config/settings");
function RateLogger() {}
RateLogger.prototype.logger = function (msg, params) {
  console.log(
    "================================LOGGER ================================="
  );
  let fmtstr = "%s : %s " + msg.toString();
  let args = [new Date().getUTCDate().toString(), __filename, ...params];
  let enabled = util.debuglog(config.env).enabled;
  if (enabled) console.log("Debug is now enabled");
  console.log(fmtstr);
  util.debuglog(config.env)(fmtstr, ...args);
};

module.exports = RateLogger;
