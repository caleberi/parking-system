const RequestDetails = require("./RequestDetail");
const config = require("../config/settings");

class RequestCache {
  constructor() {
    this.cache = {};
    this.maxRatePerIpAddress = config.rateCount;
    this.maxTimeRatePerIpRequest = config.rateTime;
  }
  limitMessage(count, maxtime) {
    return `It seems you have made ${count} request in less than ${maxtime} seconds \n which is above the specified amount of ${this.maxRatePerIpAddress} request per seconds`;
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
    if (key in that.cache) {
      let prev = that.cache[key].count;
      let expired = that.cache[key].expired(
        this.maxRatePerIpAddress,
        this.maxTimeRatePerIpRequest
      );
      this.cache[key].toString();
      if (!expired) {
        that.cache[key].count++;
        req.requestlimitObject = { "xrate-limit-test": true };
        return req;
      } else {
        if (expired) {
          that.cache[key].count = 1;
          that.cache[key].request = req.url;
          that.cache[key].createdTime = Date.now();
        }
        if (
          req.requestlimitObject &&
          "xrate-limit-test" in req.requestlimitObject
        )
          delete req.requestlimitObject;
        req.requestlimitObject = {
          "xrate-limit-test": false,
          "xrate-limit-message": that.limitMessage(
            prev,
            this.maxTimeRatePerIpRequest
          ),
        };
        return req;
      }
    } else {
      that.cache[key] = new RequestDetails(req);
      that.cache[key].count = 1;
      req.requestlimitObject = { "xrate-limit-test": true };
      return req;
    }
  }
}

module.exports = RequestCache;
