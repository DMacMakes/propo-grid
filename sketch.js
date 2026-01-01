let img;
let zoom = 1;

let offsetX = 0, offsetY = 0;
let isDragging = false;
let lastMouseX = 0, lastMouseY = 0;


let lastPinchDist = null;
let gridStrokeWeight = 3;
let gridRows = 5;
let gridCols = 5;
let gridOpacity = 32; // 0-100 percent
let gridColor = [255, 0, 255]; // default magenta
let gridColorPicker;


  

function preload() {
  img = loadImage("haley_kick.jpg"); // put your image in the repo
}


function setup() {
  // Create a canvas that is larger than the window if needed
  const c = createCanvas(windowWidth, windowHeight);
  // Make canvas scrollable
  c.elt.style.display = 'block';
  c.elt.style.position = 'relative';
  c.elt.style.maxWidth = 'none';
  c.elt.style.maxHeight = 'none';
  c.elt.style.width = img ? img.width + 'px' : '100vw';
  c.elt.style.height = img ? img.height + 'px' : '100vh';
  c.elt.style.overflow = 'auto';

  // Setup stroke weight slider
  const slider = document.getElementById('stroke-slider');
  const sliderValue = document.getElementById('slider-value');
  if (slider && sliderValue) {
    slider.addEventListener('input', function() {
      gridStrokeWeight = parseInt(this.value);
      sliderValue.textContent = this.value;
    });
    // Mousewheel support for slider
    slider.addEventListener('wheel', function(e) {
      e.preventDefault();
      let val = parseInt(this.value);
      if (e.deltaY > 0) {
        val = Math.min(6, val + 1);
      } else if (e.deltaY < 0) {
        val = Math.max(1, val - 1);
      }
      if (val !== parseInt(this.value)) {
        this.value = val;
        gridStrokeWeight = val;
        sliderValue.textContent = val;
        this.dispatchEvent(new Event('input', {bubbles: true}));
      }
    });
    gridStrokeWeight = parseInt(slider.value);
    sliderValue.textContent = slider.value;
  }

  // Setup rows slider
  const rowsSlider = document.getElementById('rows-slider');
  const rowsValue = document.getElementById('rows-value');
  if (rowsSlider && rowsValue) {
    rowsSlider.addEventListener('input', function() {
      gridRows = parseInt(this.value);
      rowsValue.textContent = this.value;
    });
    rowsSlider.addEventListener('wheel', function(e) {
      e.preventDefault();
      let val = parseInt(this.value);
      if (e.deltaY > 0) {
        val = Math.min(20, val + 1);
      } else if (e.deltaY < 0) {
        val = Math.max(1, val - 1);
      }
      if (val !== parseInt(this.value)) {
        this.value = val;
        
        gridRows = val;
        rowsValue.textContent = val;
        this.dispatchEvent(new Event('input', {bubbles: true}));
      }
    });
    gridRows = parseInt(rowsSlider.value);
    rowsValue.textContent = rowsSlider.value;
  }

  // Setup columns slider
  const colsSlider = document.getElementById('cols-slider');
  const colsValue = document.getElementById('cols-value');
  if (colsSlider && colsValue) {
    colsSlider.addEventListener('input', function() {
      gridCols = parseInt(this.value);
      colsValue.textContent = this.value;
    });
    colsSlider.addEventListener('wheel', function(e) {
      e.preventDefault();
      let val = parseInt(this.value);
      if (e.deltaY > 0) {
        val = Math.min(20, val + 1);
      } else if (e.deltaY < 0) {
        val = Math.max(1, val - 1);
      }
      if (val !== parseInt(this.value)) {
        this.value = val;
        gridCols = val;
        colsValue.textContent = val;
        this.dispatchEvent(new Event('input', {bubbles: true}));
      }
    });
    gridCols = parseInt(colsSlider.value);
    colsValue.textContent = colsSlider.value;

    // Create color picker and insert above opacity slider
    gridColorPicker = createColorPicker(color(gridColor[0], gridColor[1], gridColor[2]));
    gridColorPicker.parent('dialogue-box');
    // Move color picker above opacity slider
    const dialogueBox = document.getElementById('dialogue-box');
    const opacitySlider = document.getElementById('opacity-slider');
    if (dialogueBox && opacitySlider) {
      dialogueBox.insertBefore(gridColorPicker.elt, opacitySlider.previousSibling);
    }
    gridColorPicker.input(function() {
      const c = gridColorPicker.color();
      gridColor = [red(c), green(c), blue(c)];
    });

    // Setup opacity slider
    //const opacitySlider = document.getElementById('opacity-slider');
    const opacityValue = document.getElementById('opacity-value');
    if (opacitySlider && opacityValue) {
      opacitySlider.addEventListener('input', function() {
        gridOpacity = parseInt(this.value);
        opacityValue.textContent = this.value;
      });
      opacitySlider.addEventListener('wheel', function(e) {
        e.preventDefault();
        let val = parseInt(this.value);
        if (e.deltaY > 0) {
          val = Math.min(100, val + 1);
        } else if (e.deltaY < 0) {
          val = Math.max(0, val - 1);
        }
        if (val !== parseInt(this.value)) {
          this.value = val;
          gridOpacity = val;
          opacityValue.textContent = val;
          this.dispatchEvent(new Event('input', {bubbles: true}));
        }
      });
      gridOpacity = parseInt(opacitySlider.value);
      opacityValue.textContent = opacitySlider.value;
    }
  }
}

function draw() {
  background(230);

  push();
  translate(offsetX, offsetY);
  scale(zoom);

  if (img) {
    image(img, 0, 0);

    // draw grid
    let alpha = Math.round(gridOpacity * 2.55); // map 0-100 to 0-255
    let linecol = color(gridColor[0], gridColor[1], gridColor[2], alpha);
    stroke(linecol);
    strokeWeight(gridStrokeWeight);
    // Calculate step size for rows and columns
    let rowStep = img.height / gridRows;
    let colStep = img.width / gridCols;
    // Draw vertical lines (columns)
    for (let x = 0; x <= img.width; x += colStep) {
      line(x, 0, x, img.height);
    }
    // Draw horizontal lines (rows)
    for (let y = 0; y <= img.height; y += rowStep) {
      line(0, y, img.width, y);
    }
  }

  pop();
}


function mouseWheel(e) {
  // Prevent zoom if mouse is over the dialogue box
  const dialogue = document.getElementById('dialogue-box');
  if (dialogue) {
    const rect = dialogue.getBoundingClientRect();
    if (
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top && e.clientY <= rect.bottom
    ) {
      return;
    }
  }
  // Centered zooming around mouse position
  let zoomFactor = e.delta > 0 ? 0.9 : 1.1;
  // Mouse position relative to canvas
  let mx = e.clientX;
  let my = e.clientY;
  // Adjust for canvas position (in case of scrolling, etc.)
  const canvasBounds = document.querySelector('canvas').getBoundingClientRect();
  mx -= canvasBounds.left;
  my -= canvasBounds.top;
  // Convert to world coordinates
  let wx = (mx - offsetX) / zoom;
  let wy = (my - offsetY) / zoom;
  // Update zoom
  zoom *= zoomFactor;
  // Adjust offset so that (wx, wy) stays under the mouse
  offsetX = mx - wx * zoom;
  offsetY = my - wy * zoom;
}

/*function touchMoved() {
  if (touches.length === 1) {
    // drag
    offsetX += movedX;
    offsetY += movedY;
  }
  return false;
}*/

function touchStarted() {
  if (touches.length === 2) {
    lastPinchDist = dist(
      touches[0].x, touches[0].y,
      touches[1].x, touches[1].y
    );
  }
}

function touchMoved() {
  if (touches.length === 1) {
    // drag
    offsetX += movedX;
    offsetY += movedY;
  } else if (touches.length === 2) {
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


function mousePressed() {
  // Only start drag if mouse is over canvas and not over dialogue
  const dialogue = document.getElementById('dialogue-box');
  const canvasBounds = document.querySelector('canvas').getBoundingClientRect();
  if (
    mouseX >= 0 && mouseX <= width &&
    mouseY >= 0 && mouseY <= height &&
    !(dialogue &&
      mouseX + canvasBounds.left >= dialogue.getBoundingClientRect().left &&
      mouseX + canvasBounds.left <= dialogue.getBoundingClientRect().right &&
      mouseY + canvasBounds.top >= dialogue.getBoundingClientRect().top &&
      mouseY + canvasBounds.top <= dialogue.getBoundingClientRect().bottom)
  ) {
    isDragging = true;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

function mouseReleased() {
  isDragging = false;
}

function mouseDragged() {
  if (isDragging) {
    offsetX += mouseX - lastMouseX;
    offsetY += mouseY - lastMouseY;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

