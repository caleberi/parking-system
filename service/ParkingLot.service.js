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
function ParkingLotService(filePath) {
  this.filePath = filePath;
  this.parkingLotSize = config.parkingLotSize;
}

ParkingLotService.prototype.getData = async function () {
  let data = await FileReader(this.filePath, { encoding: "utf-8" });
  return data;
};

module.exports = ParkingLotService;
