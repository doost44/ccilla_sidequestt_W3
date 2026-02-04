// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// This file only defines:
// 1) drawScene3() → what scene 3 looks like
// 2) input handlers → what happens when the player clicks or presses keys

// Character state for scene 3
let character3 = {
  x: 750, // start at far right when entering scene
  y: 600,
  direction: -1, // facing left
  currentFrame: 0,
  frameCounter: 0,
  isWalking: false,
  animationState: "idle",
  speed: 0.5,
  scale: 0.1,
  verticalStretch: 1.1,
};

let keysPressed3 = {};

// Interaction states
let showPetPrompt = false;
let showPetMessage = false;
let petMessageTimer = 0;
let petCompleted = false;
let showNextScenePrompt = false;

function drawScene3() {
  // Start video playback when first entering scene
  if (section3BackgroundVideo && !(section3BackgroundVideo.time() > 0)) {
    section3BackgroundVideo.volume(1);
    section3BackgroundVideo.play();
  }

  // Draw background video (fill frame)
  if (section3BackgroundVideo && section3BackgroundVideo.loadedmetadata) {
    push();
    imageMode(CORNER);
    // Calculate aspect ratio to fill the frame
    let videoAspect =
      section3BackgroundVideo.width / section3BackgroundVideo.height;
    let canvasAspect = width / height;
    let drawWidth, drawHeight, drawX, drawY;

    if (canvasAspect > videoAspect) {
      // Canvas is wider - fit to width
      drawWidth = width;
      drawHeight = width / videoAspect;
      drawX = -100; // Shift left
      drawY = (height - drawHeight) / 2;
    } else {
      // Canvas is taller - fit to height
      drawHeight = height;
      drawWidth = height * videoAspect;
      drawX = (width - drawWidth) / 2 - 100; // Shift left
      drawY = 0;
    }

    image(section3BackgroundVideo, drawX, drawY, drawWidth, drawHeight);
    pop();
  } else {
    background(100, 150, 200); // fallback background
  }

  // Update and draw character
  updateCharacter3();
  drawCharacter3();

  // Check if character moved forward enough for pet prompt
  if (!petCompleted && character3.x < width - 200 && character3.x > 300) {
    showPetPrompt = true;
  } else {
    showPetPrompt = false;
  }

  // Check if character is near left edge for next scene prompt
  if (character3.x < 100) {
    showNextScenePrompt = true;
  } else {
    showNextScenePrompt = false;
  }

  // Draw pet prompt
  if (showPetPrompt && !showPetMessage) {
    drawPetPrompt();
  }

  // Draw pet message
  if (showPetMessage) {
    drawPetMessage();
  }

  // Draw next scene prompt
  if (showNextScenePrompt) {
    drawNextScenePrompt();
  }

  // Instructions text (draw last so it stays on top)
  fill(255);
  stroke(0);
  strokeWeight(2);
  textSize(18);
  textAlign(CENTER, TOP);
  text("Scene 3", width / 2, 20);
  noStroke();

  cursor(ARROW);
}

// Pet prompt helper
function drawPetPrompt() {
  const promptX = width / 2;
  const promptY = height / 2 - 100;
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
  noStroke();
  textSize(18);
  textAlign(CENTER, CENTER);
  text("Click to Pet", promptX, promptY);
}

// Pet message helper
function drawPetMessage() {
  petMessageTimer++;
  if (petMessageTimer > 120) {
    showPetMessage = false;
    petMessageTimer = 0;
    return;
  }

  const promptX = width / 2;
  const promptY = height / 2 - 100;
  const promptW = 240;
  const promptH = 60;

  rectMode(CENTER);
  fill(0, 0, 0, 180);
  rect(promptX, promptY, promptW, promptH, 10);

  fill(255);
  noStroke();
  textSize(18);
  textAlign(CENTER, CENTER);
  text("They liked that", promptX, promptY);
}

// Next scene prompt helper
function drawNextScenePrompt() {
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
  noStroke();
  textSize(18);
  textAlign(CENTER, CENTER);
  text("Enter (E)", promptX, promptY);
}

// Mouse input for this screen
function scene3MousePressed() {
  // Click to pet
  if (showPetPrompt && !showPetMessage) {
    const petRect = { x: width / 2, y: height / 2 - 100, w: 200, h: 60 };
    if (isHover(petRect)) {
      showPetMessage = true;
      petCompleted = true;
      petMessageTimer = 0;
      return;
    }
  }

  // Click to enter next scene
  if (showNextScenePrompt) {
    const nextRect = { x: 110, y: height / 2, w: 200, h: 60 };
    if (isHover(nextRect)) {
      section4ShouldPlay = true;
      startFade("scene4");
      return;
    }
  }
}

function scene3KeyPressed() {
  // E key to enter next scene when prompt is visible
  if ((key === "e" || key === "E") && showNextScenePrompt) {
    section4ShouldPlay = true;
    startFade("scene4");
    return;
  }

  keysPressed3[key.toLowerCase()] = true;

  // Movement controls
  if (key === "a" || key === "A") {
    character3.direction = -1;
    character3.isWalking = true;
    character3.animationState = "transition_start";
  } else if (key === "d" || key === "D") {
    character3.direction = 1;
    character3.isWalking = true;
    character3.animationState = "transition_start";
  }
}

// Key release handler
function scene3KeyReleased() {
  keysPressed3[key.toLowerCase()] = false;

  if ((key === "a" || key === "A") && !keysPressed3["d"]) {
    character3.isWalking = false;
    character3.animationState = "transition_end";
  } else if ((key === "d" || key === "D") && !keysPressed3["a"]) {
    character3.isWalking = false;
    character3.animationState = "transition_end";
  }
}

// Update character position and animation
function updateCharacter3() {
  if (character3.animationState === "transition_start") {
    if (character3.currentFrame < 2) {
      character3.frameCounter++;
      if (character3.frameCounter > 5) {
        character3.currentFrame++;
        character3.frameCounter = 0;
      }
    } else {
      character3.animationState = "walking";
      character3.currentFrame = 3;
      character3.frameCounter = 0;
    }
  } else if (character3.animationState === "walking") {
    character3.frameCounter++;
    if (character3.frameCounter > 2) {
      character3.currentFrame++;
      if (character3.currentFrame > 18) {
        character3.currentFrame = 3;
      }
      character3.frameCounter = 0;
    }

    character3.x += character3.speed * character3.direction;
    if (character3.x < 50) character3.x = 50;
    if (character3.x > width - 50) character3.x = width - 50;
  } else if (character3.animationState === "transition_end") {
    if (character3.currentFrame > 0) {
      character3.frameCounter++;
      if (character3.frameCounter > 5) {
        character3.currentFrame--;
        character3.frameCounter = 0;
      }
    } else {
      character3.animationState = "idle";
    }
  } else if (character3.animationState === "idle") {
    character3.currentFrame = 0;
    character3.frameCounter = 0;
  }
}

// Draw the character
function drawCharacter3() {
  push();
  translate(character3.x, character3.y);

  if (character3.direction === 1) {
    scale(-1, 1);
  }

  // Use processed frames with reduced saturation for scene 3
  const framesToDraw = processedCharacterFramesScene3;

  if (framesToDraw[character3.currentFrame]) {
    let img = framesToDraw[character3.currentFrame];
    imageMode(CENTER);
    image(
      img,
      0,
      0,
      img.width * character3.scale,
      img.height * character3.scale * character3.verticalStretch,
    );
  }

  pop();
}
