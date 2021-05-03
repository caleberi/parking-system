exports.getCars = (ParkingLotServiceDB) => async (req, res, next) => {
  try {
    let data = await ParkingLotServiceDB.getData();
    res.status(200).json({ data });
    return;
  } catch (err) {
    res.status(400).json({ err });
    return;
  }
};

exports.parkCar = (ParkingLotServiceDB) =>
  async function (req, res, next) {
    var { input } = req.body;
    try {
      var data = await ParkingLotServiceDB.parkCar(input);
      res.status(200).json({ data });
      return;
    } catch (err) {
      res.status(400).json(JSON.parse(err));
      return;
    }
  };

exports.unparkCar = (ParkingLotServiceDB) =>
  async function (req, res, next) {
    var { slotNumber } = req.body;
    var data = await ParkingLotServiceDB.unParkCar(slotNumber);
    res.status(200).json({ data });
    return;
  };

exports.getCarInformation = (ParkingLotServiceDB) =>
  async function (req, res, next) {
    var { slotNumber, carNumber } = req.query;
    var respBody;
    if (carNumber || slotNumber || (carNumber && slotNumber)) {
      respBody = {
        data: await ParkingLotServiceDB.getCarInformation({
          carNumber,
          slotNumber,
        }),
      };
      res.status(200).json(respBody);
      return;
    } else {
      res.status(400).json({ error: new Error("Invalid request input🤣") });
      return;
    }
  };
