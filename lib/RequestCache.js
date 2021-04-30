const RequestDetails = require("./RequestDetail");
var InHouseRequestCache = {};

function RequestCache() {
  this.cache = InHouseRequestCache;
  this.maxRatePerIpAddress = config.rateCount;
  this.maxTimeRatePerIpRequest = config.rateTime;
}

RequestCache.prototype.limitMessage = function (count, maxtime) {
  return `It seems you have made ${count} in less than ${maxtime} \n which is above the specified limit of ${this.maxRatePerIpAddress}`;
};

/**
 *  TODO :  Make a requestCache to store certain request detail
 *  TODO : Make sure you check if the request is behind a proxy server using { request.headers['x-forwarded-for'] }
 *  TODO : Grab the IPADDRESS of the server if not behind proxy else get proxy server ipaddress and user request Id for  rate limiting validation
 */
RequestCache.prototype.insert = function (req) {
  const that = this;
  const key =
    req.headers["x-forwarded-for"] !== undefined
      ? request.headers["x-forwarded-for"]
      : req.connection.remoteAddress;
  const val = RequestDetails(req);
  if (that.cache.hasOwnProperty(key)) {
    let requestlimitObject = {};
    let currentRequestCount = that.cache[key].count;
    let elapsedDuration = new Date().getSeconds() - that.cache[key].createdTime;
    if (
      currentRequestCount < that.maxRatePerIpAddress &&
      elapsedDuration < that.maxTimeRatePerIpRequest
    ) {
      requestlimitObject["xrate-limit-test"] = true;
      req.requestlimitObject = requestlimitObject;
      return req;
    } else if (elapsedDuration > that.maxTimeRatePerIpRequest) {
      this.cache[key].count = 0;
      this.cache[key].createdTime = new Date().getSeconds();
      requestlimitObject["xrate-limit-test"] = true;
      req.requestlimitObject = requestlimitObject;
      return req;
    }
    requestlimitObject["xrate-limit-test"] = false;
    requestlimitObject["xrate-limit-message"] = that.limitMessage(
      count,
      elapsedDuration
    );
  } else {
    that.cache[key] = val;
    return req;
  }
};
RequestCache.prototype.delete = function (req) {
  const key =
    req.headers["x-forwarded-for"] !== undefined
      ? request.headers["x-forwarded-for"]
      : req.connection.remoteAddress;
  return (
    this.cache[key].createdTime > this.maxTimeRatePerIpRequest &&
    this.cache[key].expired(this.maxTimeRatePerIpRequest)
  );
};

RequestCache.prototype.clean = function (callback) {
  var that = this;
  that.cache = that.cache.filter((item) => callback(item));
};

RequestCache.prototype.init = function () {
  setInterval(this.clean(this.delete).bind(this), 10 * 1000);
};

module.exports = RequestCache;
