const RequestCache = require("./RequestCache");
const RateLogger = require("./RateLogger");

function RateLimiter(req) {
  this.request = req;
  this.cache = new RequestCache();
  this.logger = new RateLogger();
}

RateLimiter.prototype.start = function (req) {
  this.logger.logger(`starting logging .... 🚀 for %`, req.url);
  this.cache.insert(req);
  this.cache.init();
};

module.exports = RateLimiter;
