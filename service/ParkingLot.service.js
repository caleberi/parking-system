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

  async addSlot() {
    try {
      let data = await this.getData();
      let keys = Object.keys(data).sort((a, b) => a - b);
      let lastid = String(parseInt(keys[keys.length - 1]) + 1);
      data[lastid] = [];
      let _ = await FileWriter(this.filePath, data);
    } catch (err) {
      console.log(err);
    }
  }

  async getParkingSlotSpace(id, slotNos) {
    let data = await this.getData();
    return data.length < config.parkingLotSize
      ? data[id].filter((item) => item.parkingSlot == slotNos)
      : new Error("Parking slot is full 🚖");
  }
}

module.exports = ParkingLotService;
