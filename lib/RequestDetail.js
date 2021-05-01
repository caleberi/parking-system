class RequestDetails {
  constructor(req) {
    this.request = req.url;
    this.count = 0;
    this.IpAddr =
      req.headers["x-forwarded-for"] !== undefined
        ? request.headers["x-forwarded-for"]
        : req.connection.remoteAddress;
    this.createdTime = Date.now();
  }
  expired(maxcount, maxtime) {
    return (
      this.count >= maxcount || Date.now() - this.createdTime > maxtime * 1000
    );
  }
  toString() {
    return ` RequestDetails < request:${this.request},count:${this.count} ,ipaddress : ${this.IpAddr}, created:${this.createdTime}>`;
  }
}

module.exports = RequestDetails;
