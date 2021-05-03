> NOTE : This is just a starter file but I hope to fully start coding  after exams but 🙏 add feature request  so i can find solutions to them . Thank you.
# Parking-system

![banner](https://media.giphy.com/media/g9ibUdbOCcw6c/source.gif)

## Overview

A simple solution to a parking lot user and car tracking system 🚀.This project implements a simple rate limiter that can use to prevent over loading the backend server with request.
Currently this project is using a basic rate limiter but hopefully will be implementing a fully featured rate limiter using avaiable algorithm mention below [rate-limiter](https://en.wikipedia.org/wiki/Rate_limiting):

### Algorithms

- [ ] Token bucket
- [ ] Leaky bucket
- [ ] Fixed window counter
- [ ] Sliding window log
- [ ] Sliding window counter

> A rate limiting is used to control the rate of requests sent or received by a network interface controller. It can be used to prevent DoS attacks and limit web scraping .

### Implementation

This project is currently  using a file based mode for  databases for storing car number represented using an array from the service/* folder  and all data were obtained using the class  represented below:

```js
class ParkingLotService {
  constructor(filePath) {
    this.filePath = filePath;
    this.parkingLotSize = config.parkingLotSize;
  }
  async getData() {
      // logic implementation
  }
  async parkCar(car) {
    // logic implementation
  }
  async unParkCar(slotNumber) {
    // logic implementation
  }
  async getCarInformation({ carNumber, slotNumber }) {
    // logic implementation
}
module.exports = ParkingLotService;

````

> You can access the files using [service*](https://github.com/caleberi/parking-system/tree/main/service)

The RateLimiter uses an ip based logic to calculate the number of requests made by a user per specified seconds/ time . You can however easily configure the limiter using the environment variable file. The code below show how the rate limiter is been used in application and can be found in the lib directory.

````js
var app = express();
var RateLimiter = new Limiter();
var RateMonitor = new Monitor(RateLimiter);
RateMonitor.monitor();
app.use(logger("dev"));
app.use((req, res, next) => {
  _ = RateLimiter.start(req);
  if (req.requestlimitObject["xrate-limit-test"]) {
    next();
    return;
  } else {
    res.status(400).json({ rate_limit: req.requestlimitObject });
    return;
  }
});

````

> The RateLimiter is used [as] a middleware to handle requests before sending to their specific route.

### Setup

To run this project using nodejs you need install node lts version using [node](https://nodejs.org/en/) then run the following command

```bash
npm install

npm run dev

```

> You can use the provide postman collection for test using this link [postman-collection](https://www.getpostman.com/collections/145fc6d5e100d3ef0310)

#### Author

Hi there ✋ I am Adewole Caleb Erioluwa ! . A Self-taught software engineer from Nigeria specialized in Node backend related projects and my spare time , playing guitar and singing. My passion for software goes beyond building system but understanding how they work , improving performance , testing for defect/bugs amongst other. I am currently looking forward to contributing to open source project, and also learning a lot through open source.

> Skills: Cpp,JavaScript,Nodejs,Python,Dart.

- [ ]  📝 [Resume](https://drive.google.com/file/d/1vT8nj-DVIEPLLuXyZX9p6PX3USMrklpB/view?usp=sharing)
- [ ] 🔭 I’m currently working on extensive node and javascript project
- [ ] 🌱 I’m currently learning python,dart,cpp
- [ ] 👯 I’m looking to collaborate on cpp,python,dart,js projects
- [ ] 🤔 I’m looking to contribute to open source
- [ ] 📫 How to reach me: [Gmail💌](caleberioluwa@gmail.com) or [Linkedin🚀](https://www.linkedin.com/in/caleb-adewole-b6236a163/)
- 😄 Pronouns: he/him
- ⚡ Fun fact: I love singing 🎼,coding 💻,playing guitar 🎸 and also reading 🕶.

### License

MIT License

Copyright (c) 2021  Caleb Adewole

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
