let img;
let zoom = 1;

let offsetX = 0, offsetY = 0;
let isDragging = false;
let lastMouseX = 0, lastMouseY = 0;


let lastPinchDist = null;
let gridStrokeWeight = 3;
let gridRows = 5;
let gridCols = 5;
let gridOpacity = 80; // 0-100 percent
let gridColor = [255, 0, 255]; // default magenta
let gridColorPicker;

// Margin variables (pixels)
let marginTop = 0;
let marginLeft = 0;
let marginRight = 0;
let marginBottom = 0;
let linkMargins = false;
  

function preload() {
  img = loadImage("haley_kick.jpg"); // put your image in the repo
}


function setup() {
  // Create a canvas that is larger than the window if needed
  const c = createCanvas(windowWidth, windowHeight);
  // Make canvas scrollable
 /* c.elt.style.display = 'block';
  c.elt.style.position = 'relative';
  c.elt.style.maxWidth = 'none';
  c.elt.style.maxHeight = 'none';
  c.elt.style.width = img ? img.width + 'px' : '100vw';
  c.elt.style.height = img ? img.height + 'px' : '100vh';
  c.elt.style.overflow = 'auto'; */

    // Setup image loader
  const imageLoader = document.getElementById('image-loader');
  if (imageLoader) {
    imageLoader.addEventListener('change', function(e) {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
        if (validTypes.includes(file.type)) {
          const reader = new FileReader();
          reader.onload = function(ev) {
            loadImage(ev.target.result, function(loadedImg) {
              img = loadedImg;
              // Optionally, reset zoom and offset to fit new image
              zoom = 1;
              offsetX = 0;
              offsetY = 0;
              // Optionally, resize canvas to fit new image
              resizeCanvas(windowWidth, windowHeight);
            });
          };
          reader.readAsDataURL(file);
        }
      }
    });
  }

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

  // Setup margin sliders
  const marginTopSlider = document.getElementById('margin-top-slider');
  const marginTopValue = document.getElementById('margin-top-value');
  const marginLeftSlider = document.getElementById('margin-left-slider');
  const marginLeftValue = document.getElementById('margin-left-value');
  const marginRightSlider = document.getElementById('margin-right-slider');
  const marginRightValue = document.getElementById('margin-right-value');
  const marginBottomSlider = document.getElementById('margin-bottom-slider');
  const marginBottomValue = document.getElementById('margin-bottom-value');
  const linkMarginsCheckbox = document.getElementById('link-margins-checkbox');

  function setAllMargins(val) {
    marginTop = marginLeft = marginRight = marginBottom = val;
    marginTopValue.textContent = val;
    marginLeftValue.textContent = val;
    marginRightValue.textContent = val;
    marginBottomValue.textContent = val;
    marginLeftSlider.value = val;
    marginRightSlider.value = val;
    marginBottomSlider.value = val;
  }

  if (linkMarginsCheckbox) {
    // Get parent containers for sliders
    const leftContainer = marginLeftSlider.parentElement;
    const rightContainer = marginRightSlider.parentElement;
    const bottomContainer = marginBottomSlider.parentElement;

    linkMarginsCheckbox.addEventListener('change', function() {
      linkMargins = this.checked;
      if (linkMargins) {
        setAllMargins(parseInt(marginTopSlider.value));
        leftContainer.style.display = 'none';
        rightContainer.style.display = 'none';
        bottomContainer.style.display = 'none';
      } else {
        leftContainer.style.display = '';
        rightContainer.style.display = '';
        bottomContainer.style.display = '';
      }
    });
    linkMargins = linkMarginsCheckbox.checked;
    if (linkMargins) {
      leftContainer.style.display = 'none';
      rightContainer.style.display = 'none';
      bottomContainer.style.display = 'none';
    }
  }

  if (marginTopSlider && marginTopValue) {
    marginTopSlider.addEventListener('input', function() {
      if (linkMarginsCheckbox && linkMarginsCheckbox.checked) {
        setAllMargins(parseInt(this.value));
      } else {
        marginTop = parseInt(this.value);
        marginTopValue.textContent = this.value;
      }
    });
    marginTopSlider.addEventListener('wheel', function(e) {
      e.preventDefault();
      let val = parseInt(this.value);
      if (e.deltaY > 0) {
        val = Math.min(500, val + 1);
      } else if (e.deltaY < 0) {
        val = Math.max(0, val - 1);
      }
      if (val !== parseInt(this.value)) {
        this.value = val;
        if (linkMarginsCheckbox && linkMarginsCheckbox.checked) {
          setAllMargins(val);
        } else {
          marginTop = val;
          marginTopValue.textContent = val;
        }
        this.dispatchEvent(new Event('input', {bubbles: true}));
      }
    });
    marginTop = parseInt(marginTopSlider.value);
    marginTopValue.textContent = marginTopSlider.value;
  }

  if (marginLeftSlider && marginLeftValue) {
    marginLeftSlider.addEventListener('input', function() {
      marginLeft = parseInt(this.value);
      marginLeftValue.textContent = this.value;
    });
    marginLeftSlider.addEventListener('wheel', function(e) {
      e.preventDefault();
      let val = parseInt(this.value);
      if (e.deltaY > 0) {
        val = Math.min(500, val + 1);
      } else if (e.deltaY < 0) {
        val = Math.max(0, val - 1);
      }
      if (val !== parseInt(this.value)) {
        this.value = val;
        marginLeft = val;
        marginLeftValue.textContent = val;
        this.dispatchEvent(new Event('input', {bubbles: true}));
      }
    });
    marginLeft = parseInt(marginLeftSlider.value);
    marginLeftValue.textContent = marginLeftSlider.value;
  }

  if (marginRightSlider && marginRightValue) {
    marginRightSlider.addEventListener('input', function() {
      marginRight = parseInt(this.value);
      marginRightValue.textContent = this.value;
    });
    marginRightSlider.addEventListener('wheel', function(e) {
      e.preventDefault();
      let val = parseInt(this.value);
      if (e.deltaY > 0) {
        val = Math.min(500, val + 1);
      } else if (e.deltaY < 0) {
        val = Math.max(0, val - 1);
      }
      if (val !== parseInt(this.value)) {
        this.value = val;
        marginRight = val;
        marginRightValue.textContent = val;
        this.dispatchEvent(new Event('input', {bubbles: true}));
      }
    });
    marginRight = parseInt(marginRightSlider.value);
    marginRightValue.textContent = marginRightSlider.value;
  }

  if (marginBottomSlider && marginBottomValue) {
    marginBottomSlider.addEventListener('input', function() {
      marginBottom = parseInt(this.value);
      marginBottomValue.textContent = this.value;
    });
    marginBottomSlider.addEventListener('wheel', function(e) {
      e.preventDefault();
      let val = parseInt(this.value);
      if (e.deltaY > 0) {
        val = Math.min(500, val + 1);
      } else if (e.deltaY < 0) {
        val = Math.max(0, val - 1);
      }
      if (val !== parseInt(this.value)) {
        this.value = val;
        marginBottom = val;
        marginBottomValue.textContent = val;
        this.dispatchEvent(new Event('input', {bubbles: true}));
      }
    });
    marginBottom = parseInt(marginBottomSlider.value);
    marginBottomValue.textContent = marginBottomSlider.value;
  }

  // Add a save button here that allows the user to save the loaded image plus its grid overlay as a new image file.
  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save Image with Grid';
  saveButton.style.display = 'block';
  saveButton.style.marginTop = '12px';
  saveButton.addEventListener('click', function() {
    // Create a graphics buffer to draw the image and grid
    let pg = createGraphics(img.width, img.height);
    pg.image(img, 0, 0);

    // Draw grid on the graphics buffer with margins
    let alpha = Math.round(gridOpacity * 2.55); // map 0-100 to 0-255
    let linecol = pg.color(gridColor[0], gridColor[1], gridColor[2], alpha);
    pg.stroke(linecol);
    pg.strokeWeight(gridStrokeWeight);
    let gridLeft = marginLeft;
    let gridTop = marginTop;
    let gridRight = img.width - marginRight;
    let gridBottom = img.height - marginBottom;
    let gridWidth = gridRight - gridLeft;
    let gridHeight = gridBottom - gridTop;
    let rowStep = gridHeight / gridRows;
    let colStep = gridWidth / gridCols;
    for (let x = gridLeft; x <= gridRight + 0.1; x += colStep) {
      pg.line(x, gridTop, x, gridBottom);
    }
    for (let y = gridTop; y <= gridBottom + 0.1; y += rowStep) {
      pg.line(gridLeft, y, gridRight, y);
    }

    // prompt the user for an image name
    let imageName = prompt("Enter image name:", "image_with_grid");
    // Save the graphics buffer as an image
    save(pg, imageName + '.png');
  });
  const dialogueBox = document.getElementById('dialogue-box');
  if (dialogueBox) {
    dialogueBox.appendChild(saveButton);
  }
}

function draw() {
  background(230);

  push();
  translate(offsetX, offsetY);
  scale(zoom);

  if (img) {
    image(img, 0, 0);

    // draw grid with margins
    let alpha = Math.round(gridOpacity * 2.55); // map 0-100 to 0-255
    let linecol = color(gridColor[0], gridColor[1], gridColor[2], alpha);
    stroke(linecol);
    strokeWeight(gridStrokeWeight);
    // Calculate grid area
    let gridLeft = marginLeft;
    let gridTop = marginTop;
    let gridRight = img.width - marginRight;
    let gridBottom = img.height - marginBottom;
    let gridWidth = gridRight - gridLeft;
    let gridHeight = gridBottom - gridTop;
    let rowStep = gridHeight / gridRows;
    let colStep = gridWidth / gridCols;
    // Draw vertical lines (columns)
    for (let x = gridLeft; x <= gridRight + 0.1; x += colStep) {
      line(x, gridTop, x, gridBottom);
    }
    // Draw horizontal lines (rows)
    for (let y = gridTop; y <= gridBottom + 0.1; y += rowStep) {
      line(gridLeft, y, gridRight, y);
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

