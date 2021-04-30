const fs = require("fs");
const promisify = require("util").promisify;

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
    this.data = await this.getData();
    this.parkingLotSize = config.parkingLotSize;
}

ParkingLotService.prototype.getData = async function () {
    return await FileReader(this.filePath, { encoding: 'utf-8' });
};
