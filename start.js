// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// This file only defines:
// 1) drawStart() → what the start/menu screen looks like
// 2) input handlers → what happens on click / key press on this screen
// 3) a helper function to draw menu buttons

// ------------------------------------------------------------
// Start screen visuals
// ------------------------------------------------------------
// drawStart() is called from main.js only when:
// currentScreen === "start"
function drawStart() {
  // Black background
  background(0);

  // Draw video if it exists
  if (titleVideo) {
    // Show first frame of video
    if (!videoPlaying) {
      titleVideo.time(0); // Set to first frame
    }
    image(titleVideo, 0, 0, width, height);
  }

  // Skip button (fades in during video)
  if (videoPlaying) {
    let fadeAlpha = 0;
    let timeSinceStart = millis() - videoStartTime;

    // Fade in over 2 seconds
    if (timeSinceStart > 1000) {
      fadeAlpha = map(timeSinceStart, 1000, 3000, 0, 255);
      fadeAlpha = constrain(fadeAlpha, 0, 255);

      const skipBtn = {
        x: width - 120,
        y: height - 60,
        w: 100,
        h: 40,
        label: "SKIP",
      };

      drawSkipButton(skipBtn, fadeAlpha);

      const over = isHover(skipBtn);
      cursor(over ? HAND : ARROW);
    }
  }

  // ---- Start Button (only if video not playing) ----
  if (!videoPlaying) {
    const startBtn = {
      x: 200, // Left side of screen
      y: height / 2,
      w: 240,
      h: 80,
      label: "START",
    };

    // Draw start button
    drawButton(startBtn);

    // ---- Cursor feedback ----
    const over = isHover(startBtn);
    cursor(over ? HAND : ARROW);
  }
}

// ------------------------------------------------------------
// Mouse input for the start screen
// ------------------------------------------------------------
// Called from main.js only when currentScreen === "start"
function startMousePressed() {
  if (!videoPlaying) {
    const startBtn = { x: 200, y: height / 2, w: 240, h: 80 };

    // If START is clicked, play the video
    if (isHover(startBtn)) {
      titleVideo.play();
      videoPlaying = true;
      videoStartTime = millis();
    }
  } else {
    // Check if skip button is clicked
    let timeSinceStart = millis() - videoStartTime;
    if (timeSinceStart > 1000) {
      const skipBtn = { x: width - 120, y: height - 60, w: 100, h: 40 };
      if (isHover(skipBtn)) {
        titleVideo.pause();
        currentScreen = "game";
        videoPlaying = false;
        videoStartTime = 0;
      }
    }
  }
}

// ------------------------------------------------------------
// Keyboard input for the start screen
// ------------------------------------------------------------
// Provides keyboard shortcuts:
// - ENTER starts the video
// - ESC skips the video
function startKeyPressed() {
  if (keyCode === ENTER && !videoPlaying) {
    titleVideo.play();
    videoPlaying = true;
    videoStartTime = millis();
  } else if (keyCode === ESCAPE && videoPlaying) {
    // ESC key to skip video
    titleVideo.pause();
    currentScreen = "game";
    videoPlaying = false;
    videoStartTime = 0;
  }
}

// ------------------------------------------------------------
// Helper: drawButton()
// ------------------------------------------------------------
// This function draws a button and changes its appearance on hover.
// It does NOT decide what happens when you click the button.
// That logic lives in startMousePressed() above.
//
// Keeping drawing separate from input/logic makes code easier to read.
function drawButton({ x, y, w, h, label }) {
  rectMode(CENTER);

  // Check if the mouse is over the button rectangle
  const hover = isHover({ x, y, w, h });

  noStroke();

  // ---- Visual feedback (hover vs not hover) ----
  // This is a common UI idea:
  // - normal state is calmer
  // - hover state is brighter + more “active”
  //
  // We also add a shadow using drawingContext (p5 lets you access the
  // underlying canvas context for effects like shadows).
  if (hover) {
    fill(255, 200, 150, 220); // warm coral on hover

    // Shadow settings (only when hovered)
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = color(255, 180, 120);
  } else {
    fill(255, 240, 210, 210); // soft cream base

    // Softer shadow when not hovered
    drawingContext.shadowBlur = 8;
    drawingContext.shadowColor = color(220, 220, 220);
  }

  // Draw the rounded rectangle button
  rect(x, y, w, h, 14);

  // Important: reset shadow so it does not affect other drawings
  drawingContext.shadowBlur = 0;

  // Draw the label text on top of the button
  fill(40, 60, 70);
  textSize(28);
  textAlign(CENTER, CENTER);
  text(label, x, y);
}

// ------------------------------------------------------------
// Helper: drawSkipButton()
// ------------------------------------------------------------
function drawSkipButton({ x, y, w, h, label }, fadeAlpha) {
  rectMode(CENTER);
  const hover = isHover({ x, y, w, h });

  noStroke();

  if (hover) {
    fill(255, 100, 100, fadeAlpha * 0.9);
  } else {
    fill(50, 50, 50, fadeAlpha * 0.7);
  }

  rect(x, y, w, h, 8);

  fill(255, 255, 255, fadeAlpha);
  textSize(16);
  textAlign(CENTER, CENTER);
  text(label, x, y);
}
