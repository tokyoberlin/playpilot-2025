let dataPoints1 = []; // For the first line (Cello)
let dataPoints2 = []; // For the second line (Viola)
let dataPoints3 = []; // For the third line (Violin)
let shiftedDataPoints1 = []; // Shifted data points for the first line (Cello)
let shiftedDataPoints2 = []; // Shifted data points for the second line (Viola)
let shiftedDataPoints3 = []; // Shifted data points for the third line (Violin)
let currentDataPointIndex1 = 0;
let currentDataPointIndex2 = 0;
let currentDataPointIndex3 = 0;
let oldDataPointIndex1 = 0;
let oldDataPointIndex2 = 0;
let oldDataPointIndex3 = 0;
let frameRateValue = 25;
let continueAnimation = true;
let canvasWidth;
let canvasHeight;
let xOffset = -600; // Adjust this value to move the entire visualization to the right

let drawCelloLine = true;
let drawViolaLine = false;
let drawViolinLine = false;

// blue from the buttons
function preload() {
  loadTable("MATTEO1 CORRECT.csv", "csv", "header", function(table) {
    dataPoints1 = table.getRows().map(row => ({
      xPos: parseFloat(row.get("X Position")),
      yPos: parseFloat(row.get("Y Position"))
    }));
  });

  // darkest blue
  loadTable("MATT-MEDIUM.csv", "csv", "header", function(table) {
    dataPoints2 = table.getRows().map(row => ({
      xPos: parseFloat(row.get("X Position")),
      yPos: parseFloat(row.get("Y Position"))
    }));
  });

  // saturated blue
  loadTable("MATTEO LAYER 1.csv", "csv", "header", function(table) {
    dataPoints3 = table.getRows().map(row => ({
      xPos: parseFloat(row.get("X Position")),
      yPos: parseFloat(row.get("Y Position"))
    }));
  });
}

function setup() {
  canvasWidth = window.innerWidth; // Set canvas width to the window width
  canvasHeight = window.innerHeight; // Set canvas height to the window height
  createCanvas(canvasWidth, canvasHeight);
  frameRate(frameRateValue);

  // Function definition for windowResized needs to be outside setup or globally
  window.windowResized = function() {
    resizeCanvas(windowWidth, windowHeight);
  }

  // Set up canvas position and z-index properly
  let c = createCanvas(windowWidth, windowHeight);
  c.position(0, 0);
  c.style('z-index', '-1'); // push canvas behind UI

  // Initialize shifted data points
  shiftedDataPoints1 = dataPoints1.map(point => ({xPos: point.xPos, yPos: point.yPos}));
  shiftedDataPoints2 = dataPoints2.map(point => ({xPos: point.xPos, yPos: point.yPos}));
  shiftedDataPoints3 = dataPoints3.map(point => ({xPos: point.xPos, yPos: point.yPos}));
}

function draw() {
  background(255);
  translate(-100, -150);

  // The lines below that drew the X and Y positions have been removed:
  /*
  fill(2);
  textSize(16);
  text("Attempt I - X Position: " + dataPoints1[currentDataPointIndex1].xPos.toFixed(2), 20, height - 180);
  text("Attempt I - Y Position: " + dataPoints1[currentDataPointIndex1].yPos.toFixed(2), 20, height - 160);
  text("Attempt II - X Position: " + dataPoints2[currentDataPointIndex2].xPos.toFixed(2), 20, height - 120);
  text("Attempt II - Y Position: " + dataPoints2[currentDataPointIndex2].yPos.toFixed(2), 20, height - 100);
  text("Teacher Version - X Position: " + dataPoints3[currentDataPointIndex3].xPos.toFixed(2), 20, height - 60);
  text("Teacher Version - Y Position: " + dataPoints3[currentDataPointIndex3].yPos.toFixed(2), 20, height - 40);
  */


  // Move all points to the left for all lines
  const sec = 213 / frameRateValue; // Use frameRateValue for calculation
  for (let i = 0; i < currentDataPointIndex1; i++) {
    dataPoints1[i].xPos -= sec * 0.45;
    dataPoints2[i].xPos -= sec * 0.45;
    dataPoints3[i].xPos -= sec * 0.45;

    // Update shifted data points
    shiftedDataPoints1[i] = {xPos: dataPoints1[i].xPos, yPos: dataPoints1[i].yPos};
    shiftedDataPoints2[i] = {xPos: dataPoints2[i].xPos, yPos: dataPoints2[i].yPos};
    shiftedDataPoints3[i] = {xPos: dataPoints3[i].xPos, yPos: dataPoints3[i].yPos};
  }

  // Draw the lines for Cello, Viola, and Violin
  if (drawCelloLine) {
    drawLine(shiftedDataPoints1, color(119, 141, 169)); // Cello line with blue color
  }
  if (drawViolaLine) {
    drawLine(shiftedDataPoints2, color(27, 38, 59)); // Viola line with dark blue color
  }
  if (drawViolinLine) {
    drawLine(shiftedDataPoints3, color(86, 207, 225)); // Violin line with bright blue color
  }

  // The second redundant block of text display code has also been removed.

  // Increment the index for the next data points for each line independently
  currentDataPointIndex1++;
  currentDataPointIndex2++;
  currentDataPointIndex3++;

  // Stop the animation if continueAnimation is false
  if (!continueAnimation) {
    noLoop();
  }
}

// Function to draw a line based on dataPoints and color
function drawLine(dataPoints, lineColor) {
  stroke(lineColor);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 1; i <= currentDataPointIndex1; i++) {
    // Note: The loop condition here might cause issues if currentDataPointIndex1 is not the max.
    // However, keeping it as is based on the provided code structure.
    vertex(dataPoints[i].xPos - xOffset, dataPoints[i].yPos);
  }
  endShape();
}

// Toggle functions for lines
function toggleCelloLine() {
  drawCelloLine = !drawCelloLine;
  // If the animation was paused, ensure it continues when a line is toggled
  if (continueAnimation) loop();
}

function toggleViolaLine() {
  drawViolaLine = !drawViolaLine;
  if (continueAnimation) loop();
}

function toggleViolinLine() {
  drawViolinLine = !drawViolinLine;
  if (continueAnimation) loop();
}

// Toggle function for play/pause - assumed to be called from the HTML button
function togglePlayPause() {
    continueAnimation = !continueAnimation;
    if (continueAnimation) {
        loop(); // Resume animation
        // Assuming a function exists in the main script to update the UI
        if (typeof updatePlayUI === 'function') updatePlayUI(true);
    } else {
        noLoop(); // Pause animation
        if (typeof updatePlayUI === 'function') updatePlayUI(false);
    }
}

// Set initial play state
// This function needs to be defined in your main script to update the button text
window.updatePlayUI(continueAnimation);
