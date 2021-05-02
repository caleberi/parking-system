const fs = require("fs");
const promisify = require("util").promisify;
const config = require("../config/settings");

const FileReader = async (filePath, encoding) => {
  try {
    let data = await promisify(fs.readFile)(filePath, encoding);
    return JSON.parse(data.toString("utf8"));
  } catch (err) {
    console.log(err.toString());
  }
};
const FileWriter = async (filePath, data) => {
  try {
    await promisify(fs.writeFile)(filePath, JSON.stringify(data));
  } catch (err) {
    console.log(err.toString());
  }
};

class ParkingLotService {
  constructor(filePath) {
    this.filePath = filePath;
    this.parkingLotSize = config.parkingLotSize;
  }
  async getData() {
    let data = await FileReader(this.filePath, { encoding: "utf-8" });
    return data;
  }

  async parkCar(car) {
    try {
      let data = await this.getData();
      let canParkCar = data.length < config.parkingLotSize;
      if (canParkCar) {
        data.push(car);
        let _ = await FileWriter(this.filePath, data);
        return data.length - 1;
      } else {
        throw new Error("Parking slot is full 🚖");
      }
    } catch (err) {
      return err;
    }
  }

  async unParkCar(slotNumber) {
    let data = await this.getData();
    let ret = null;
    data = data.filter((item, id) => {
      if (id == slotNumber) {
        ret = item;
      }
      return item.id != slotNumber;
    });
    let _ = await FileWriter(this.filePath, data);
    return ret;
  }

  async;
}

module.exports = ParkingLotService;
