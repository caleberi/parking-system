const RequestCache = require("./RequestCache");
const RateLogger = require("./RateLogger");

function RateLimiter() {
  this.cache = new RequestCache();
  this.logger = new RateLogger();
}

RateLimiter.prototype.start = function (req) {
  this.logger.logger(`starting logging .... 🚀 for %`, req.url);
  var req = this.cache.insert(req);
  this.cache.init(req);
  return req;
};

module.exports = RateLimiter;
