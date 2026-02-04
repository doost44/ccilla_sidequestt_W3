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
  x: 750, // start at far left when entering new area
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

// Button data for scene 2
const scene2Btn = {
  x: 400,
  y: 700,
  w: 260,
  h: 90,
  label: "SCENE 2 BUTTON",
};

// Prompt for entering next area
let showScene2EnterPrompt = false;

// Main draw function for this screen
function drawScene2() {
  // Start video playback when first entering scene
  if (section2BackgroundVideo && !section2BackgroundVideo.time() > 0) {
    section2BackgroundVideo.play();
  }

  // Draw background video
  if (section2BackgroundVideo && section2BackgroundVideo.loadedmetadata) {
    image(section2BackgroundVideo, 0, 0, width, height);
  } else {
    background(100, 150, 200); // fallback background
  }

  // Instructions text
  fill(255);
  stroke(0);
  strokeWeight(2);
  textSize(18);
  textAlign(CENTER, TOP);
  text("Scene 2 - Press A/D to walk", width / 2, 20);
  noStroke();

  // Update and draw character
  updateCharacter2();
  drawCharacter2();

  // Check if character reached right edge to show enter prompt
  if (character2.x > width - 120) {
    showScene2EnterPrompt = true;
  } else {
    showScene2EnterPrompt = false;
  }

  // Draw enter prompt if visible
  if (showScene2EnterPrompt) {
    drawScene2EnterPrompt();
  }

  // Draw foreground
  if (section2Foreground) {
    image(section2Foreground, 50, 0, width * 1.1, height * 1.075);
  }

  cursor(ARROW);
}

// Draw enter prompt helper
function drawScene2EnterPrompt() {
  const promptX = 700;
  const promptY = height / 2;
  const promptW = 180;
  const promptH = 60;

  rectMode(CENTER);
  fill(0, 0, 0, 150);
  rect(promptX, promptY, promptW, promptH, 10);

  stroke(255);
  strokeWeight(2);
  noFill();
  rect(promptX, promptY, promptW, promptH, 10);

  fill(255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("Press E to Continue", promptX, promptY);
}

// Mouse input for this screen
function scene2MousePressed() {
  if (isHover(scene2Btn)) {
    // Handle button click
  }
}

// Keyboard input for this screen
function scene2KeyPressed() {
  // E key to continue to next area
  if ((key === "e" || key === "E") && showScene2EnterPrompt) {
    currentScreen = "win"; // For now, go to win screen
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

  // Use unprocessed frames (no filters) in scene 2
  const framesToDraw = characterFrames;

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
