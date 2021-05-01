var express = require("express");
var router = express.Router();

module.exports = ({ ParkingLotServiceDB }) => {
  router.get("/test", async function (req, res, next) {
    var data = await ParkingLotServiceDB.getData();
    res.status(200).json({ data });
    return;
  });

  return router;
};
