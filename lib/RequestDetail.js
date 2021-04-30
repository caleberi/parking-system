function RequestDetails(req) {
  this.request = [...req.url];
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

module.exports = RequestDetails;
