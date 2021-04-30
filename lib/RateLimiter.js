const RequestDetails = require("./RequestDetail");
const RequestCache = require("./RequestCache");

var InHouseRequestCache = {};

function RateLimiter(req) {
  this.request = req;
  this.cache = new RequestCache();
}

RateLimiter.prototype.check = function (req) {
  return this.cache.insert(req);
};

module.exports = RateLimiter;
