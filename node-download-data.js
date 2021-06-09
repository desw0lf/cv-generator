const fs = require("fs");
const https = require("https");

const DATA_JSON_URI = process.env.DATA_JSON_URI === "" ? undefined : process.env.DATA_JSON_URI;
const OUTPUT = "./src/_harp.json";

function downloadJSON(callback) {
  https.get(DATA_JSON_URI, (resp) => {
    let data = "";

    // A chunk of data has been received.
    resp.on("data", (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on("end", () => {
      if (typeof callback === "function") {
        callback(JSON.parse(data));
      }
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}

function saveFile(data, callback) {
  fs.writeFile(OUTPUT, JSON.stringify(data, null, 2), (err) => {
    if (err) throw err;
    if (typeof callback === "function") {
      callback();
    }
  });
}

function copyFile(src, out, callback) {
  fs.copyFile(src, out, (err) => {
    if (err) throw err;
    if (typeof callback === "function") {
      callback();
    }
  });
}

function init() {
  console.log("Downloading from: " + DATA_JSON_URI);
  downloadJSON((response) => {
    saveFile(response, () => {
      console.log(OUTPUT + " file saved.");
    });
  });
}

if (DATA_JSON_URI) {
  init();
} else {
  const src = "./src/_harp.SAMPLE.json";
  copyFile(src, OUTPUT, () => {
    console.log(src + " copied to " + OUTPUT);
  })
}