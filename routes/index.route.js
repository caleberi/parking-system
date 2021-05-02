var express = require("express");
var router = express.Router();

module.exports = ({ ParkingLotServiceDB }) => {
  router.get("/lot", async (req, res, next) => {
    try {
      let data = await ParkingLotServiceDB.getData();
      res.status(200).json({ data });
      return;
    } catch (err) {
      res.status(400).json({ error: err });
      return;
    }
  });
  router.post("/park", async function (req, res, next) {
    var { input } = req.body;
    try {
      var data = await ParkingLotServiceDB.parkCar(input);
      res.status(200).json({ data });
      return;
    } catch (err) {
      res.status(400).json({ error: err.toString() });
      return;
    }
  });

  router.post("/unpark", async function (req, res, next) {
    var { slotNumber } = req.body;
    var data = await ParkingLotServiceDB.unParkCar(slotNumber);
    res.status(200).json({ data });
    return;
  });

  router.get("/car/info", async function (req, res, next) {
    var { slotNumber, carNumber } = req.query;
    var respBody;
    if (carNumber || slotNumber || (carNumber && slotNumber)) {
      respBody = {
        data: await ParkingLotServiceDB.getCarInformation({
          carNumber,
          slotNumber,
        }),
      };
    } else {
      res.status(400).json({ error: new Error("Invalid request input🤣") });
    }
    var data = await ParkingLotServiceDB.parkCar();
    res.status(200).json({ data });
    return;
  });

  return router;
};
