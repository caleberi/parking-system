var express = require("express");
var parkingLotController = require("../controllers/parkingLot.controller");
var router = express.Router();

module.exports = ({ ParkingLotServiceDB }) => {
  router.get("/lot", parkingLotController.getCars(ParkingLotServiceDB));
  router.post("/park", parkingLotController.parkCar(ParkingLotServiceDB));
  router.post("/unpark", parkingLotController.unparkCar(ParkingLotServiceDB));
  router.get("/car/info", parkingLotController.getCarInformation(ParkingLotServiceDB));

  return router;
};
