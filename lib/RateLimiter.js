const RequestCache = require("./RequestCache");

function RateLimiter(req) {
  this.request = req;
  this.cache = new RequestCache();
}

RateLimiter.prototype.start = function (req) {
  this.cache.insert(req);
  this.cache.init();
};

module.exports = RateLimiter;
