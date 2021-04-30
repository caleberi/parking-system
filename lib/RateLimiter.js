var InHouseRequestCache = {};

function RequestDetails(req) {
  this.request = req.url;
  this.count = 0;
  this.IpAddr =
    req.headers["x-forwarded-for"] !== undefined
      ? request.headers["x-forwarded-for"]
      : req.connection.remoteAddress;
  this.createdTime = new Date().getSeconds();
}

RequestDetails.prototype.expired = function (maxtime) {
  return new Date().getSeconds() - this.createdTime > maxtime;
};

RequestDetails.prototype.toString = function () {
  return ` RequestDetails < request:${this.request},count:${this.count} ,ipaddress : ${this.IpAddr}, created:${this.createdTime}>`;
};

function RequestCache() {
  this.cache = InHouseRequestCache;
  this.maxRateCount = config.rateCount;
  this.maxRateTime = config.rateTime;
}

RequestCache.prototype.limitMessage = function (count, maxtime) {
  return `It seems you have made ${count} in less than ${maxtime} \n which is above the specified limit of ${this.maxRateCount}`;
};

/**
 *  TODO :  Make a requestCache to store certain request detail
 *  TODO : Make sure you check if the request is behind a proxy server using { request.headers['x-forwarded-for'] }
 *  TODO : Grab the IPADDRESS of the server if not behind proxy else get proxy server ipaddress and user request Id for  rate limiting validation
 */
RequestCache.prototype.insert = function (req) {
  const that = this;
  const key = req.params.userId;
  const val = RequestDetails(req);
  if (that.cache.hasOwnProperty(key)) {
    let requestlimitObject = {};
    let currentRequestCount = that.cache[key].count;
    let elapsedDuration = new Date().getSeconds() - that.cache[key].createdTime;
    if (
      currentRequestCount < that.maxRateCount &&
      elapsedDuration < that.maxRateTime
    ) {
      requestlimitObject["rate-limit-test"] = true;
      req.requestlimitObject = requestlimitObject;
      return req;
    } else if (elapsedDuration > that.maxRateTime) {
      this.cache[key].count = 0;
      this.cache[key].createdTime = new Date().getSeconds();
      requestlimitObject["rate-limit-test"] = true;
      req.requestlimitObject = requestlimitObject;
      return req;
    }
    requestlimitObject["rate-limit-test"] = false;
    requestlimitObject["rate-limit-message"] = that.limitMessage(
      count,
      elapsedDuration
    );
  } else {
    that.cache[key] = val;
    return req;
  }
};
RequestCache.prototype.delete = function (req) {
  const key = req.params.userId;
  return (
    this.cache[key].createdTime > this.maxRateTime &&
    this.cache[key].expired(this.maxRateTime)
  );
};

RequestCache.prototype.clean = function (callback) {
  var that = this;
  that.cache = that.cache.filter(callback);
};

RequestCache.prototype.triggerCleanUp = function (callback) {
  setInterval(this.clean(this.delete).bind(this), 10 * 1000);
};

function RateLimiter(req) {
  this.request = req;
}

// RateLimiter.prototype.createRequestDetail = function (req) {};
