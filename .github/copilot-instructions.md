# Copilot Instructions for propo-grid

## Project Overview
- **Purpose:** Interactive image viewer with a customizable grid overlay for analyzing proportions, built using [p5.js](libraries/p5.js).
- **Main Entry:** [sketch.js](sketch.js) contains all core logic (image loading, grid rendering, UI controls).
- **UI:** Relies on HTML elements (sliders, color pickers, buttons) referenced by ID in [index.html](index.html). No framework is used beyond p5.js.

## Architecture & Data Flow
- **Single-file logic:** All drawing and UI code is currently in [sketch.js](sketch.js).
- **Image loading:** Uses p5's `loadImage()` and a custom file input (`image-loader` in HTML) for user images.
- **Grid overlay:** Grid parameters (rows, columns, stroke, color, opacity) are controlled via sliders and color picker, then rendered over the image in a dialogue box.
- **Zoom & Pan:** Mouse/touch events allow zooming and panning the image and grid together.
- **Save Functionality:** A button lets users export the current image+grid as a PNG using p5's `createGraphics()` and `save()`.

## Developer Workflow
- **Run/Debug:** Open [index.html](index.html) in a browser. No build step required. Opening it in a live server from vscode is a handy option.
- **Edit:** Change [sketch.js](sketch.js) for logic, [index.html](index.html) for UI, [style.css](style.css) for styles.
- **Dependencies:** Only [p5.js](libraries/p5.js) and [p5.sound.min.js](libraries/p5.sound.min.js) (sound not currently used).
- **No tests/builds:** No automated tests or build tools are present.

## Project-Specific Conventions
- **Control in setup function:** All controls so far have been created and configured in the `setup()` function of [sketch.js](sketch.js).
- **UI element IDs:** All controls are referenced by their HTML `id` (e.g., `stroke-slider`, `rows-slider`, `dialogue-box`).
- **Grid color:** Uses RGB array, updated via p5 color picker.
- **Opacity:** Grid opacity is set as 0-100, mapped to 0-255 for rendering.
- **Image:** Default image is `haley_kick.jpg` (must be present in repo or replaced by user upload).
- **No module system:** All code is global-scope JavaScript.

## Integration Points
- **p5.js:** All drawing/UI logic uses p5.js functions and event hooks.
- **HTML:** UI controls must exist in [index.html](index.html) with correct IDs for features to work.
- **Image files:** User can upload images via file input; default image must be present or replaced.

## Examples
- To add a new grid feature, update [sketch.js](sketch.js) and add corresponding UI in [index.html](index.html).
- To change default grid color, edit `gridColor` in [sketch.js](sketch.js).
- To support more image formats, update the file type check in the image loader section of [sketch.js](sketch.js).

## Key Files
- [sketch.js](sketch.js): Main logic
- [index.html](index.html): UI structure
- [style.css](style.css): Styles
- [libraries/p5.js](libraries/p5.js): p5.js library

---
For questions about project structure or conventions, see [README.md](README.md) or review [sketch.js](sketch.js) for implementation details.
