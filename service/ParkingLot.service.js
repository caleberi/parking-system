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
      let canParkCar = data.length <= config.parkingLotSize;
      if (canParkCar) {
        data.push(car);
        let _ = await FileWriter(this.filePath, data);
        return data.length - 1;
      } else {
        throw new Error("Parking slot is full 🚖 . try another parking lot");
      }
    } catch (err) {
      throw new Error(
        JSON.stringify({
          message: err.message,
        })
      );
    }
  }

  async unParkCar(slotNumber) {
    let data = await this.getData();
    if (data.length == 0) {
      throw new Error(
        "Trying to unpark a car that is park 🤷‍♀️ may be it has already been unparked before 🚗 🏘 "
      );
    }
    let ret = {};
    let result = data.filter((item, id) => {
      if (id == parseInt(slotNumber)) {
        ret = { carNos: item };
      }
      return id != slotNumber;
    });
    let _ = await FileWriter(this.filePath, result);
    return ret;
  }

  async getCarInformation({ carNumber, slotNumber }) {
    slotNumber = parseInt(slotNumber);
    let data = await this.getData();
    let ret = {};
    if (carNumber && slotNumber) {
      data.forEach((item, id) => {
        if (id == slotNumber && carNumber == item) {
          ret = { carNos: item, slotNos: id };
        }
      });
    } else if (slotNumber) {
      data.forEach((item, id) => {
        if (id == slotNumber) {
          ret = { carNos: item, slotNos: id };
        }
      });
    } else if (carNumber) {
      let data = await this.getData();
      if (carNumber) {
        data = data.forEach((item, id) => {
          if (item == carNumber) {
            ret = { carNos: item, slotNos: id };
          }
        });
      }
    } else {
    }
    return ret;
  }
}

module.exports = ParkingLotService;
