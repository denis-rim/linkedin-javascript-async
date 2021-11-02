/*
 * Based on "Making Image Filters with Canvas - HTML5 Rocks"
 * By Ilmari Heikkinen, Published May 25th, 2011
 * https://www.html5rocks.com/en/tutorials/canvas/imagefilters/
 * Code licensed under the Apache 2.0 license:
 * http://www.apache.org/licenses/LICENSE-2.0
 */

"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const image = document.querySelector("#original");
  const slider = document.querySelector("#slider");
  const range = document.querySelector("#level");
  const outputCanvas = document.querySelector("#output");
  const ctx = outputCanvas.getContext("2d");
  let selectedFilter = "";
  const worker = new Worker("_scripts/filter-worker.js");
  // worker.postMessage("Hello Worker");
  // console.log("Message send to worker");

  const getImageData = (image) => {
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = image.width;
    tempCanvas.height = image.height;
    tempCtx.drawImage(image, 0, 0, image.width, image.height);
    const imageDataObj = tempCtx.getImageData(0, 0, image.width, image.height);
    return imageDataObj;
  };

  // const delay = (ms) => {
  //   const startPoint = new Date().getTime();
  //   while (new Date().getTime() - startPoint <= ms) {
  //     /* wait */
  //   }
  // };
  //
  // const grayscaleImage = (pixels) => {
  //   var d = pixels.data;
  //   for (var i = 0; i < d.length; i += 4) {
  //     var r = d[i];
  //     var g = d[i + 1];
  //     var b = d[i + 2];
  //     // CIE luminance for the RGB
  //     // The human eye is bad at seeing red and blue, so we de-emphasize them.
  //     var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  //     d[i] = d[i + 1] = d[i + 2] = v;
  //   }
  //
  //   delay(1000);
  //   return pixels;
  // };
  //
  // const brightnessImage = (adjustment, pixels) => {
  //   var d = pixels.data;
  //   for (var i = 0; i < d.length; i += 4) {
  //     d[i] += adjustment;
  //     d[i + 1] += adjustment;
  //     d[i + 2] += adjustment;
  //   }
  //   delay(1000);
  //   return pixels;
  // };
  //
  // const thresholdImage = (level, pixelData) => {
  //   const thresholdLevel = level; // 0-255
  //   var d = pixelData.data;
  //   for (var i = 0; i < d.length; i += 4) {
  //     var r = d[i];
  //     var g = d[i + 1];
  //     var b = d[i + 2];
  //     var v = 0.2126 * r + 0.7152 * g + 0.0722 * b >= thresholdLevel ? 255 : 0;
  //     d[i] = d[i + 1] = d[i + 2] = v;
  //   }
  //   delay(1000);
  //   return pixelData;
  // };
  //
  // const applyFilter = (filter, level, image) => {
  //   const startTime = new Date().getTime();
  //   let results;
  //   if (filter === "brightness") {
  //     results = brightnessImage(level, image);
  //   } else if (filter === "threshold") {
  //     results = thresholdImage(level, image);
  //   } else if (filter === "grayscale") {
  //     results = grayscaleImage(image);
  //   }
  //   const totalTime = new Date().getTime() - startTime;
  //   console.log("Filtering: %d ms", totalTime);
  //   return results;
  // };

  const resetCanvas = () => {
    const imageDataObj = getImageData(image);
    displayFilteredImage(ctx, imageDataObj);
  };

  const displayFilteredImage = (ctx, newPixelData) => {
    ctx.putImageData(newPixelData, 0, 0);
  };

  document.querySelector("#grayscale").addEventListener("click", function () {
    selectedFilter = "grayscale";
    const imageDataObj = getImageData(image);
    const level = Number(range.value);
    // const results = applyFilter("grayscale", level, imageDataObj);
    worker.postMessage({
      filter: selectedFilter,
      level: level,
      image: imageDataObj,
    });
    // displayFilteredImage(ctx, results);
    slider.classList.add("hidden");
  });

  document.querySelector("#brightness").addEventListener("click", function () {
    selectedFilter = "brightness";
    const imageDataObj = getImageData(image);
    range.max = 100;
    range.value = 50;
    const level = Number(range.value);
    // const results = applyFilter("brightness", level, imageDataObj);
    worker.postMessage({
      filter: selectedFilter,
      level: level,
      image: imageDataObj,
    });
    // displayFilteredImage(ctx, results);
    slider.classList.remove("hidden");
  });

  document.querySelector("#threshold").addEventListener("click", function () {
    selectedFilter = "threshold";
    const imageDataObj = getImageData(image);
    range.max = 255;
    range.value = 127;
    const level = Number(range.value);
    // const results = applyFilter("threshold", level, imageDataObj);
    worker.postMessage({
      filter: selectedFilter,
      level: level,
      image: imageDataObj,
    });
    // displayFilteredImage(ctx, results);
    slider.classList.remove("hidden");
  });

  document.querySelector("#reset").addEventListener("click", function () {
    slider.classList.add("hidden");
    resetCanvas();
  });

  document.querySelector("#slider").addEventListener("input", function () {
    const imageDataObj = getImageData(image);
    const level = Number(range.value);
    const results = applyFilter(selectedFilter, level, imageDataObj);
    displayFilteredImage(ctx, results);
  });

  document.querySelectorAll("#thumbnails img").forEach((e) => {
    e.addEventListener("click", function () {
      image.src = String("_images/postcard/" + this.dataset.full);
      document.querySelector("#slider").classList.add("hidden");
    });
  });

  image.addEventListener("load", resetCanvas);

  worker.addEventListener("message", function (e) {
    console.log("Received data from worker:");
    console.log(e.data);
    displayFilteredImage(ctx, e.data);
  });
});
