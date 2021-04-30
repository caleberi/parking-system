const util = require("util");

function RateLogger() {}
RateLogger.prototype.logger = function (msg, params) {
  let fmtstr = "" + msg.toString();
  let args = [new Date().getUTCDate(), __filename, ...params];
  return util.debuglog(fmtstr, ...args);
};

module.exports = RateLogger;
