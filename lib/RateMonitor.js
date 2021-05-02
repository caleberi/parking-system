const config = require("../config/settings");
class RateMonitor {
  constructor(limiter) {
    this.limiter = limiter;
  }
  clean() {
    var that = this;
    that.limiter.cache.cache =
      Object.keys(that.limiter.cache.cache).length == 0
        ? that.limiter.cache.cache
        : Object.fromEntries(
            Object.entries(that.limiter.cache.cache).filter(function ([key, value]) {
              let _ = key;
              return value.expired(
                that.limiter.maxRatePerIpAddress,
                that.limiter.maxTimeRatePerIpRequest
              );
            })
          );
  }
  init() {
    var that = this;
    setInterval(that.clean.bind(that), config.monitorCleanUpTime * config.rateTime * 1000);
  }
  // TODO: think on when to clear the cache effienctly to avoid memory useage
  monitor() {
    this.init();
  }
}

module.exports = {
  Monitor: RateMonitor,
};
