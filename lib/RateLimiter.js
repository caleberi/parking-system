const RequestCache = require("./RequestCache");
const RateLogger = require("./RateLogger");

class RateLimiter {
  constructor() {
    this.cache = new RequestCache();
    this.logger = new RateLogger();
  }
  start(req) {
    this.logger.logger(`starting logging .... 🚀 for %`, req.url);
    var req = this.cache.insert(req);
    return req;
  }
}

module.exports = RateLimiter;
