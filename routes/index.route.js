var express = require("express");
var router = express.Router();

module.exports = ({ ParkingLotServiceDB }) => {
  router.get("/park:input", async function (req, res, next) {
    var { input } = req.params;
    try {
      var data = await ParkingLotServiceDB.parkCar(input);
      res.status(200).json({ data });
      return;
    } catch (err) {
      res.status(400).json({ error: err.toString() });
      return;
    }
  });

  router.get("/unpark:slotNumber", async function (req, res, next) {
    var { slotNumber } = req.params;
    var data = await ParkingLotServiceDB.unParkCar(slotNumber);
    res.status(200).json({ data });
    return;
  });

  router.get("/car/info", async function (req, res, next) {
    var { slotNumber, carNumber } = req.query;
    var respBody;
    if (carNumber || slotNumber) {
      respBody = {
        data: await ParkingLotServiceDB.getParkedCarNumber(
          carNumber || slotNumber
        ),
      };
    } else {
      res.status(400).json({ error: new Error("Invalid Query input🤣") });
    }
    var data = await ParkingLotServiceDB.parkCar();
    res.status(200).json({ data });
    return;
  });

  return router;
};
