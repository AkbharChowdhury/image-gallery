# Image Gallery

A responsive random image gallery web application powered by Picsum Photos. When the user clicks the button, a new image is added to the gallery with optional effects.

## Features
- Load random images into a responsive grid layout
- Toggle grayscale effect
- Blur control:
  - Slider value `0` = default blur strength
  - Values `1–10` = specific blur intensity
  - Toggle off to disable blur
- Bootstrap 6 responsive design — works on mobile, tablet and desktop
- Clean template-based rendering
- Async/await with proper error handling

## How to Use
1. Open `index.html` in a web browser
2. Use the controls to customise your image:
   - **Enable Blur** — turn blur on or off
   - **Blur Amount** — adjust strength from 0 (default) to 10
   - **Grayscale** — apply black-and-white filter
3. Click **Load New Image** to add it to the gallery

No build tools or installation needed — just open and use.

## Technology
- HTML5 with `<template>` elements
- Bootstrap 6 for styling and responsive layout
- Vanilla JavaScript (ES6+)
- Picsum Photos API — https://picsum.photos/

## Project Structure
- `index.html` — page layout, controls, template and script
- `README.md` — this file

## Key Functions
- `buildPicsumUrl()` — constructs the image URL with all selected options
- `getBlurSetting()` — reads blur controls and converts slider value `0` to default blur mode
- `cloneTemplate()` — creates a fresh gallery item from the HTML template
- `displayImage()` — fetches the image and appends it to the gallery

## Future Ideas
- Load multiple images automatically on page load
- Share or bookmark settings via the browser address bar
- Download button for individual images
- Infinite scroll loading
