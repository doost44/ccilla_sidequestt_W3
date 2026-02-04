// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// This file only defines:
// 1) drawScene2() → what scene 2 looks like
// 2) input handlers → what happens when the player clicks or presses keys
// 3) helper functions specific to this screen

// Scene 2 variables (will be loaded from main.js)
let section2Background;

// Character state for scene 2
let character2 = {
  x: 50, // start at far left when entering new area
  y: 750,
  direction: 1, // facing right
  currentFrame: 0,
  frameCounter: 0,
  isWalking: false,
  animationState: "idle",
  speed: 0.5,
  scale: 0.05, // Much smaller for scene 2
  verticalStretch: 1.1,
};

let keysPressed2 = {};

// Prompt for going back to scene 1
let showBackPrompt = false;

// Interaction state for Walking Thing
let interactionAvailable = false;
let showInteractionOptions = false;

// Ending state for option 1
let endingActive = false;
let endingAlpha = 0;
let endingMessageTimer = 0;

// Main draw function for this screen
function drawScene2() {
  // Start video playback when first entering scene
  if (section2BackgroundVideo && !(section2BackgroundVideo.time() > 0)) {
    section2BackgroundVideo.volume(1);
    section2BackgroundVideo.play();
  }

  // Draw background video
  if (section2BackgroundVideo && section2BackgroundVideo.loadedmetadata) {
    image(section2BackgroundVideo, 0, 0, width, height);
  } else {
    background(100, 150, 200); // fallback background
  }

  // Update and draw character
  updateCharacter2();
  drawCharacter2();

  // Check if character reached left edge to show back prompt
  if (character2.x < 120) {
    showBackPrompt = true;
  } else {
    showBackPrompt = false;
  }

  // Check if character is near middle for interaction
  if (abs(character2.x - width / 2) < 80) {
    interactionAvailable = true;
  } else {
    interactionAvailable = false;
    showInteractionOptions = false;
  }

  // Draw foreground
  if (section2Foreground) {
    image(section2Foreground, 50, 0, width * 1.1, height * 1.075);
  }

  // Draw back prompt after foreground
  if (showBackPrompt) {
    drawBackPrompt();
  }

  // Draw interaction options if visible
  if (showInteractionOptions) {
    drawInteractionOptions();
  } else if (interactionAvailable) {
    drawInteractionHint();
  }

  // Ending fade overlay
  if (endingActive) {
    drawEndingFade();
  }

  // Instructions text (draw last so it stays on top)
  fill(255);
  stroke(0);
  strokeWeight(2);
  textSize(18);
  textAlign(CENTER, TOP);
  text("Scene 2 - Press A/D to walk", width / 2, 20);
  noStroke();

  cursor(ARROW);
}

// Back prompt helper
function drawBackPrompt() {
  const promptX = 110;
  const promptY = height / 2;
  const promptW = 200;
  const promptH = 60;

  rectMode(CENTER);
  fill(0, 0, 0, 150);
  rect(promptX, promptY, promptW, promptH, 10);

  stroke(255);
  strokeWeight(2);
  noFill();
  rect(promptX, promptY, promptW, promptH, 10);

  fill(255);
  textSize(18);
  textAlign(CENTER, CENTER);
  text("Go back (E)", promptX, promptY);
}

// Interaction hint
function drawInteractionHint() {
  const hintX = width / 2;
  const hintY = height / 2 - 120;
  rectMode(CENTER);
  fill(0, 0, 0, 140);
  rect(hintX, hintY, 240, 50, 10);
  fill(255);
  noStroke();
  textSize(18);
  textAlign(CENTER, CENTER);
  text("Click to interact", hintX, hintY);
}

// Interaction options
function drawInteractionOptions() {
  const option1 = getOption1Rect();
  const option2 = getOption2Rect();

  rectMode(CENTER);
  fill(0, 0, 0, 180);
  rect(width / 2, height / 2 - 40, 460, 180, 14);

  stroke(255);
  strokeWeight(2);
  noFill();
  rect(width / 2, height / 2 - 40, 460, 180, 14);

  // Option 1
  fill(20, 20, 20, 200);
  noStroke();
  rect(option1.x, option1.y, option1.w, option1.h, 10);
  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("Grab Their LEG", option1.x, option1.y);

  // Option 2
  fill(20, 20, 20, 200);
  rect(option2.x, option2.y, option2.w, option2.h, 10);
  fill(255);
  text("Will you be my mount, Walking Thing?", option2.x, option2.y);
}

function getOption1Rect() {
  return { x: width / 2, y: height / 2 - 70, w: 360, h: 45 };
}

function getOption2Rect() {
  return { x: width / 2, y: height / 2 + 10, w: 360, h: 45 };
}

// Ending fade helper
function drawEndingFade() {
  endingAlpha = min(255, endingAlpha + 5);
  push();
  noStroke();
  rectMode(CORNER);
  fill(0, 0, 0, endingAlpha);
  rect(0, 0, width, height);
  pop();

  if (endingAlpha > 200) {
    fill(255);
    textSize(22);
    textAlign(CENTER, CENTER);
    text("They didn't like that, you were SQUASHED", width / 2, height / 2);
    endingMessageTimer++;
    if (endingMessageTimer > 120) {
      endingActive = false;
      endingAlpha = 0;
      endingMessageTimer = 0;
      currentScreen = "start";
    }
  }
}

// Mouse input for this screen
function scene2MousePressed() {
  if (endingActive) return;

  if (showBackPrompt) {
    const backRect = { x: 110, y: height / 2, w: 200, h: 60 };
    if (isHover(backRect)) {
      startFade("game");
      return;
    }
  }

  if (interactionAvailable && !showInteractionOptions) {
    showInteractionOptions = true;
    return;
  }

  if (showInteractionOptions) {
    const option1 = getOption1Rect();
    const option2 = getOption2Rect();
    if (isHover(option1)) {
      endingActive = true;
      endingAlpha = 0;
      endingMessageTimer = 0;
      showInteractionOptions = false;
      return;
    }
    if (isHover(option2)) {
      showInteractionOptions = false;
      startFade("scene3");
    }
  }
}

// Keyboard input for this screen
function scene2KeyPressed() {
  // E key to go back to scene 1 when prompt is visible
  if ((key === "e" || key === "E") && showBackPrompt) {
    startFade("game");
    return;
  }

  // ENTER key
  if (keyCode === ENTER) {
    // Handle enter key
  }

  keysPressed2[key.toLowerCase()] = true;

  // Movement controls
  if (key === "a" || key === "A") {
    character2.direction = -1;
    character2.isWalking = true;
    character2.animationState = "transition_start";
  } else if (key === "d" || key === "D") {
    character2.direction = 1;
    character2.isWalking = true;
    character2.animationState = "transition_start";
  }
}

// Key release handler
function scene2KeyReleased() {
  keysPressed2[key.toLowerCase()] = false;

  if ((key === "a" || key === "A") && !keysPressed2["d"]) {
    character2.isWalking = false;
    character2.animationState = "transition_end";
  } else if ((key === "d" || key === "D") && !keysPressed2["a"]) {
    character2.isWalking = false;
    character2.animationState = "transition_end";
  }
}

// Update character position and animation
function updateCharacter2() {
  if (character2.animationState === "transition_start") {
    if (character2.currentFrame < 2) {
      character2.frameCounter++;
      if (character2.frameCounter > 5) {
        character2.currentFrame++;
        character2.frameCounter = 0;
      }
    } else {
      character2.animationState = "walking";
      character2.currentFrame = 3;
      character2.frameCounter = 0;
    }
  } else if (character2.animationState === "walking") {
    character2.frameCounter++;
    if (character2.frameCounter > 2) {
      character2.currentFrame++;
      if (character2.currentFrame > 18) {
        character2.currentFrame = 3;
      }
      character2.frameCounter = 0;
    }

    character2.x += character2.speed * character2.direction;
    if (character2.x < 50) character2.x = 50;
    if (character2.x > width - 50) character2.x = width - 50;
  } else if (character2.animationState === "transition_end") {
    if (character2.currentFrame > 0) {
      character2.frameCounter++;
      if (character2.frameCounter > 5) {
        character2.currentFrame--;
        character2.frameCounter = 0;
      }
    } else {
      character2.animationState = "idle";
    }
  } else if (character2.animationState === "idle") {
    character2.currentFrame = 0;
    character2.frameCounter = 0;
  }
}

// Draw the character
function drawCharacter2() {
  push();
  translate(character2.x, character2.y);

  if (character2.direction === 1) {
    scale(-1, 1);
  }

  // Use processed frames with increased saturation for scene 2
  const framesToDraw = processedCharacterFramesScene2;

  if (framesToDraw[character2.currentFrame]) {
    let img = framesToDraw[character2.currentFrame];
    imageMode(CENTER);
    image(
      img,
      0,
      0,
      img.width * character2.scale,
      img.height * character2.scale * character2.verticalStretch,
    );
  }

  pop();
}
