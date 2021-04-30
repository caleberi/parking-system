const RequestDetails = require("./RequestDetail");
const config = require("../config/settings");

function RequestCache() {
  this.cache = {};
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
      ? req.headers["x-forwarded-for"]
      : req.connection.remoteAddress;
  const val = new RequestDetails(req);
  console.log("===========", that.cache);
  let requestlimitObject = {};
  if (that.cache.hasOwnProperty(key)) {
    let currentRequestCount = that.cache[key].count;
    let elapsedDuration = new Date().getSeconds() - that.cache[key].createdTime;
    if (
      currentRequestCount < that.maxRatePerIpAddress &&
      elapsedDuration < that.maxTimeRatePerIpRequest
    ) {
      that.cache[key].count += 1;
      requestlimitObject["xrate-limit-test"] = true;
      req.requestlimitObject = requestlimitObject;
      console.log(req.requestlimitObject);
      return req;
    } else if (elapsedDuration > that.maxTimeRatePerIpRequest) {
      that.cache[key].count = 0;
      that.cache[key].createdTime = new Date().getSeconds();
      requestlimitObject["xrate-limit-test"] = true;
      req.requestlimitObject = requestlimitObject;
      console.log(req.requestlimitObject);
      return req;
    }
    requestlimitObject["xrate-limit-test"] = false;
    requestlimitObject["xrate-limit-message"] = that.limitMessage(
      count,
      elapsedDuration
    );
  } else {
    that.cache[key] = val;
    that.cache[key].count += 1;
    requestlimitObject["xrate-limit-test"] = true;
    req.requestlimitObject = requestlimitObject;
    return req;
  }
};
// RequestCache.prototype.delete = function (key, value) {
//   // const key =
//   //   req.headers.hasOwnProperty("x-forwarded-for") &&
//   //   req.headers["x-forwarded-for"] !== undefined
//   //     ? req.headers["x-forwarded-for"]
//   //     : req.connection.remoteAddress;

//   console.log(this.cache);
//   return (
//   );
// };

RequestCache.prototype.clean = function () {
  var that = this;
  console.log(that.cache);
  that.cache = Object.fromEntries(
    Object.entries(that.cache).filter(function ([key, value]) {
      _ = value;
      return (
        that.cache[key].createdTime > that.maxTimeRatePerIpRequest &&
        that.cache[key].expired(that.maxTimeRatePerIpRequest)
      );
    })
  );
};

RequestCache.prototype.init = function () {
  var that = this;
  setInterval(that.clean, 10 * 1000);
};

module.exports = RequestCache;
