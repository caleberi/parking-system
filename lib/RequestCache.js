const RequestDetails = require("./RequestDetail");
const config = require("../config/settings");

class RequestCache {
  constructor() {
    this.cache = {};
    this.maxRatePerIpAddress = config.rateCount;
    this.maxTimeRatePerIpRequest = config.rateTime;
  }
  limitMessage(count, maxtime) {
    return `It seems you have made ${count} in less than ${maxtime} \n which is above the specified limit of ${this.maxRatePerIpAddress}`;
  }
  /**
   *  TODO :  Make a requestCache to store certain request detail
   *  TODO : Make sure you check if the request is behind a proxy server using { request.headers['x-forwarded-for'] }
   *  TODO : Grab the IPADDRESS of the server if not behind proxy else get proxy server ipaddress and user request Id for  rate limiting validation
   */
  insert(req) {
    const that = this;
    const key =
      req.headers["x-forwarded-for"] !== undefined
        ? req.headers["x-forwarded-for"]
        : req.connection.remoteAddress;
    const val = new RequestDetails(req);
    let requestlimitObject = {};
    if (key in that.cache) {
      console.log(that.cache[key]);
      let currentRequestCount = that.cache[key].count;
      let notExpired = that.cache[key].expired(this.maxTimeRatePerIpRequest);
      if (currentRequestCount < that.maxRatePerIpAddress && !notExpired) {
        that.cache[key].count++;
        requestlimitObject["xrate-limit-test"] = true;
        req.requestlimitObject = requestlimitObject;
        return req;
      } else {
        if (currentRequestCount >= that.maxRatePerIpAddress && !notExpired) {
          that.cache[key].count = 1;
          that.cache[key].createdTime = Date.now();
        }
        requestlimitObject["xrate-limit-test"] = false;
        requestlimitObject["xrate-limit-message"] = that.limitMessage(
          currentRequestCount,
          this.maxTimeRatePerIpRequest
        );
      }
    } else {
      that.cache[key] = val;
      that.cache[key].count = 1;
      requestlimitObject["xrate-limit-test"] = true;
      req.requestlimitObject = requestlimitObject;
      return req;
    }
  }
  clean() {
    var that = this;
    that.cache = Object.fromEntries(
      Object.entries(that.cache ? that.cache : {}).filter(function ([
        key,
        value,
      ]) {
        _ = value;
        return that.cache[key].expired(that.maxTimeRatePerIpRequest);
      })
    );
  }
  init() {
    var that = this;
    var workerId = setInterval(that.clean, 2 * config.rateTime * 1000);
    setInterval(function () {
      if (Object.keys(that.cache).length == 0) {
        clearInterval(workerId);
      }
    }, 2 * config.rateTime * 1000);
  }
}

module.exports = RequestCache;
