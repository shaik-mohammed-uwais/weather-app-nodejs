//================================ node js part ================================

const http = require(`http`);
const fs = require(`fs`);
var requests = require(`requests`);
const cheerio = require(`cheerio`);
const EventEmitter = require("events");
const emitter = new EventEmitter();

const homeFile = fs.readFileSync("index.html", "utf-8");
// const $ = cheerio.load(homeFile);
// const textBoxValue = $(`#city`).val();
// emitter.emit("change", textBoxValue);
// emitter.on('change', (newValue) => {})

const recpVal = (temp, val) => {
  let temperature = temp.replace("{%temp%}", val.main.temp);
  temperature = temperature.replace("{%tempMin%}", val.main.temp_min);
  temperature = temperature.replace("{%tempMax}", val.main.temp_max);
  temperature = temperature.replace("{%location%}", val.name);
  temperature = temperature.replace("{%country%}", val.sys.country);
  temperature = temperature.replace("{%tempstatus%}", val.weather[0].main);
  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      `https://api.openweathermap.org/data/2.5/weather?q=bangalore&appid=cb002300dea853d802d872a82830abfd&units=metric`
    )
      .on("data", (chunk) => {
        const chunkData = JSON.parse(chunk);
        const arrData = [chunkData];
        const realTimeData = arrData
          .map((val) => recpVal(homeFile, val))
          .join("");
        res.write(realTimeData);
        // console.log(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  }
});
server.listen(8000);
