"use strict";

const delay = (ms) => {
  const startPoint = new Date().getTime();
  while (new Date().getTime() - startPoint <= ms) {
    /* wait */
  }
};

const grayscaleImage = (pixels) => {
  var d = pixels.data;
  for (var i = 0; i < d.length; i += 4) {
    var r = d[i];
    var g = d[i + 1];
    var b = d[i + 2];
    // CIE luminance for the RGB
    // The human eye is bad at seeing red and blue, so we de-emphasize them.
    var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    d[i] = d[i + 1] = d[i + 2] = v;
  }
  delay(1000);
  return pixels;
};

const brightnessImage = (adjustment, pixels) => {
  var d = pixels.data;
  for (var i = 0; i < d.length; i += 4) {
    d[i] += adjustment;
    d[i + 1] += adjustment;
    d[i + 2] += adjustment;
  }
  delay(1000);
  return pixels;
};

const thresholdImage = (level, pixelData) => {
  const thresholdLevel = level; // 0-255
  var d = pixelData.data;
  for (var i = 0; i < d.length; i += 4) {
    var r = d[i];
    var g = d[i + 1];
    var b = d[i + 2];
    var v = 0.2126 * r + 0.7152 * g + 0.0722 * b >= thresholdLevel ? 255 : 0;
    d[i] = d[i + 1] = d[i + 2] = v;
  }
  delay(1000);
  return pixelData;
};

const applyFilter = (filter, level, image) => {
  const startTime = new Date().getTime();
  let results;
  if (filter === "brightness") {
    results = brightnessImage(level, image);
  } else if (filter === "threshold") {
    results = thresholdImage(level, image);
  } else if (filter === "grayscale") {
    results = grayscaleImage(image);
  }
  const totalTime = new Date().getTime() - startTime;
  console.log("Filtering: %d ms", totalTime);
  return results;
};

this.addEventListener("message", function (e) {
  // console.log("Message received from main script");
  // console.log(e.data);
  const workerResult = applyFilter(e.data.filter, e.data.level, e.data.image);
  // console.log(workerResult);
  this.postMessage(workerResult);
});
