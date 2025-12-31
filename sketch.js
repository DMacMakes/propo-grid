let img;
let zoom = 1;
let offsetX = 0, offsetY = 0;

let lastPinchDist = null;

function preload() {
  img = loadImage("your-image.png"); // put your image in the repo
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(230);

  push();
  translate(offsetX, offsetY);
  scale(zoom);

  image(img, 0, 0);

  // draw grid
  stroke(0, 80);
  let step = 50;
  for (let x = 0; x < img.width; x += step) line(x, 0, x, img.height);
  for (let y = 0; y < img.height; y += step) line(0, y, img.width, y);

  pop();
}

function mouseWheel(e) {
  zoom *= e.delta > 0 ? 0.9 : 1.1;
}

function touchMoved() {
  if (touches.length === 1) {
    // drag
    offsetX += movedX;
    offsetY += movedY;
  }
  return false;
}

function touchStarted() {
  if (touches.length === 2) {
    lastPinchDist = dist(
      touches[0].x, touches[0].y,
      touches[1].x, touches[1].y
    );
  }
}

function touchMoved() {
  if (touches.length === 2) {
    let d = dist(
      touches[0].x, touches[0].y,
      touches[1].x, touches[1].y
    );
    if (lastPinchDist) {
      zoom *= d / lastPinchDist;
    }
    lastPinchDist = d;
  } else if (touches.length === 1) {
    offsetX += movedX;
    offsetY += movedY;
  }
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
