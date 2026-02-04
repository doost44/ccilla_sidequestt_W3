// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// This file only defines:
// 1) drawScene4() → what scene 4 looks like

let scene4Initialized = false;
let scene4FlashActive = false;
let scene4FlashAlpha = 0;
let scene4FlashState = "in";

function drawScene4() {
  // Initialize flash state on entry
  if (!scene4Initialized) {
    scene4FlashActive = true;
    scene4FlashAlpha = 0;
    scene4FlashState = "in";
    scene4Initialized = true;
  }

  // Start video playback only after interaction trigger
  if (
    section4ShouldPlay &&
    section4BackgroundVideo &&
    !(section4BackgroundVideo.time() > 0)
  ) {
    section4BackgroundVideo.volume(1);
    section4BackgroundVideo.play();
  }

  // Draw background video (fill frame)
  if (section4BackgroundVideo && section4BackgroundVideo.loadedmetadata) {
    push();
    imageMode(CORNER);
    // Calculate aspect ratio to fill the frame
    let videoAspect =
      section4BackgroundVideo.width / section4BackgroundVideo.height;
    let canvasAspect = width / height;
    let drawWidth, drawHeight, drawX, drawY;

    if (canvasAspect > videoAspect) {
      // Canvas is wider - fit to width
      drawWidth = width;
      drawHeight = width / videoAspect;
      drawX = -100; // Match scene3 offset
      drawY = (height - drawHeight) / 2;
    } else {
      // Canvas is taller - fit to height
      drawHeight = height;
      drawWidth = height * videoAspect;
      drawX = (width - drawWidth) / 2 - 100; // Match scene3 offset
      drawY = 0;
    }

    image(section4BackgroundVideo, drawX, drawY, drawWidth, drawHeight);
    pop();
  } else {
    background(100, 150, 200); // fallback background
  }

  // Flash overlay (quick fade in, slow fade out)
  if (scene4FlashActive) {
    if (scene4FlashState === "in") {
      scene4FlashAlpha = min(255, scene4FlashAlpha + 40);
      if (scene4FlashAlpha >= 255) {
        scene4FlashState = "out";
      }
    } else {
      scene4FlashAlpha = max(0, scene4FlashAlpha - 5);
      if (scene4FlashAlpha <= 0) {
        scene4FlashActive = false;
      }
    }

    push();
    noStroke();
    rectMode(CORNER);
    fill(255, 255, 255, scene4FlashAlpha);
    rect(0, 0, width, height);
    pop();
  }
}
