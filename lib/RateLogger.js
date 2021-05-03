const { debuglog } = require("util");
const config = require("../config/settings");
const debug = debuglog(config.debugName);
let enabled = debug.enabled;
if (enabled) console.log("Debug is now enabled");
class RateLogger {
  constructor() {}
  logger(msg, params) {
    // console.log("================================LOGGER =================================");
    let fmtstr = "%s : %s " + msg.toString();
    let args = [new Date().getUTCDate().toString(), __filename, ...params];
    debug(fmtstr, ...args);
  }
}

module.exports = RateLogger;
