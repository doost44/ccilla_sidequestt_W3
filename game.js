// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// This file only defines:
// 1) drawGame() → what the game screen looks like
// 2) input handlers → what happens when the player clicks or presses keys
// 3) helper functions specific to this screen

// ------------------------------
// Character state
// ------------------------------
// Tracks position, animation, and movement of the character
let character = {
  x: 750, // x position on canvas (far right)
  y: 575, // y position on canvas (100 pixels lower)
  direction: 1, // 1 = facing right, -1 = facing left
  currentFrame: 0, // which frame to display (0=idle 1.png, 1=idle 2.png, 2=transition, 3+=walk)
  frameCounter: 0, // counter to control animation speed
  isWalking: false, // whether character is currently moving
  animationState: "idle", // 'idle', 'transition_start', 'walking', 'transition_end'
  speed: 1, // movement speed in pixels (reduced)
  scale: 0.3, // scale factor for the character sprite
  verticalStretch: 1.1, // vertical stretch factor for the character
};

// Keys being held down
let keysPressed = {};

// ------------------------------
// Button data
// ------------------------------
// This object stores all the information needed to draw
// and interact with the button on the game screen.
// Keeping this in one object makes it easier to move,
// resize, or restyle the button later.
const gameBtn = {
  x: 400, // x position (centre of the button)
  y: 700, // y position (centre of the button) - moved down to make room for character
  w: 260, // width
  h: 90, // height
  label: "PRESS HERE", // text shown on the button
};

// Prompt for entering next area
let showEnterPrompt = false;

// ------------------------------
// Main draw function for this screen
// ------------------------------
// drawGame() is called from main.js *only*
// when currentScreen === "game"
function drawGame() {
  // Draw background image
  if (section1Background) {
    image(section1Background, 0, 0, width, height);
  } else {
    background(200, 220, 240);
  }

  // ---- Update and draw character ----
  updateCharacter();
  drawCharacter();

  // ---- Check if character reached left edge to show enter prompt ----
  if (character.x < 120) {
    showEnterPrompt = true;
  } else {
    showEnterPrompt = false;
  }

  // ---- Draw foreground (in front of character and prompt) ----
  if (section1Foreground) {
    image(section1Foreground, 50, 0, width * 1.1, height * 1.075);
  }

  // ---- Draw enter prompt if visible (on top of foreground) ----
  if (showEnterPrompt) {
    drawEnterPrompt();
  }

  // ---- Instructions text (draw last so it stays on top) ----
  fill(255); // white text for visibility on background
  stroke(0);
  strokeWeight(2);
  textSize(18);
  textAlign(CENTER, TOP);
  text("Press A to walk left, D to walk right", width / 2, 20);
  noStroke(); // Reset stroke

  cursor(ARROW);

  // ---- Cursor feedback ----
  // If the mouse is over the button, show a hand cursor
  // Otherwise, show the normal arrow cursor
  cursor(isHover(gameBtn) ? HAND : ARROW);
}

// ------------------------------
// Button drawing helper
// ------------------------------
// This function is responsible *only* for drawing the button.
// It does NOT handle clicks or game logic.
function drawGameButton({ x, y, w, h, label }) {
  rectMode(CENTER);

  // Check if the mouse is hovering over the button
  // isHover() is defined in main.js so it can be shared
  const hover = isHover({ x, y, w, h });

  noStroke();

  // Change button colour when hovered
  // This gives visual feedback to the player
  fill(
    hover
      ? color(180, 220, 255, 220) // lighter blue on hover
      : color(200, 220, 255, 190), // normal state
  );

  // Draw the button rectangle
  rect(x, y, w, h, 14); // last value = rounded corners

  // Draw the button text
  fill(0);
  textSize(28);
  textAlign(CENTER, CENTER);
  text(label, x, y);
}

// ------------------------------
// Draw enter prompt helper
// ------------------------------
function drawEnterPrompt() {
  const promptX = 100;
  const promptY = height / 2;
  const promptW = 180;
  const promptH = 60;

  rectMode(CENTER);

  // Semi-transparent background
  fill(0, 0, 0, 150);
  rect(promptX, promptY, promptW, promptH, 10);

  // Border
  stroke(255);
  strokeWeight(2);
  noFill();
  rect(promptX, promptY, promptW, promptH, 10);

  // Text
  fill(255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("Press E to Enter", promptX, promptY);
}

// ------------------------------
// Mouse input for this screen
// ------------------------------
// This function is called from main.js
// only when currentScreen === "game"
function gameMousePressed() {
  // Only trigger the outcome if the button is clicked
  if (isHover(gameBtn)) {
    triggerRandomOutcome();
  }
}

// ------------------------------
// Keyboard input for this screen
// ------------------------------
// Allows keyboard-only interaction (accessibility + design)
function gameKeyPressed() {
  // E key enters the next area if prompt is visible
  if ((key === "e" || key === "E") && showEnterPrompt) {
    startFade("scene2");
    return;
  }

  // ENTER key triggers the same behaviour as clicking the button
  if (keyCode === ENTER) {
    triggerRandomOutcome();
  }

  // Track which keys are pressed
  keysPressed[key.toLowerCase()] = true;

  // Movement controls
  if (key === "a" || key === "A") {
    character.direction = -1; // face left
    character.isWalking = true;
    character.animationState = "transition_start";
  } else if (key === "d" || key === "D") {
    character.direction = 1; // face right
    character.isWalking = true;
    character.animationState = "transition_start";
  }
}

// ------------------------------
// Key release handler
// ------------------------------
// Stop walking when keys are released
function gameKeyReleased() {
  keysPressed[key.toLowerCase()] = false;

  // Stop walking if A or D is released
  if ((key === "a" || key === "A") && !keysPressed["d"]) {
    character.isWalking = false;
    character.animationState = "transition_end";
  } else if ((key === "d" || key === "D") && !keysPressed["a"]) {
    character.isWalking = false;
    character.animationState = "transition_end";
  }
}

// ------------------------------
// Game logic: win or lose
// ------------------------------
// This function decides what happens next in the game.
// It does NOT draw anything.
function triggerRandomOutcome() {
  // random() returns a value between 0 and 1
  // Here we use a 50/50 chance:
  // - less than 0.5 → win
  // - 0.5 or greater → lose
  //
  // You can bias this later, for example:
  // random() < 0.7 → 70% chance to win
  if (random() < 0.5) {
    currentScreen = "win";
  } else {
    currentScreen = "lose";
  }
}

// ------------------------------
// Update character position and animation
// ------------------------------
function updateCharacter() {
  // Handle animation state transitions
  if (character.animationState === "transition_start") {
    // Play transition frames (0, 1, 2) then move to walking
    if (character.currentFrame < 2) {
      character.frameCounter++;
      if (character.frameCounter > 5) {
        character.currentFrame++;
        character.frameCounter = 0;
      }
    } else {
      character.animationState = "walking";
      character.currentFrame = 3; // Start at first walk frame
      character.frameCounter = 0;
    }
  } else if (character.animationState === "walking") {
    // Walk animation: cycle through frames 3-18
    character.frameCounter++;
    if (character.frameCounter > 6) {
      character.currentFrame++;
      if (character.currentFrame > 18) {
        // Last frame in the sequence
        character.currentFrame = 3; // Loop back to first walk frame
      }
      character.frameCounter = 0;
    }

    // Move character
    character.x += character.speed * character.direction;
    if (character.x < 50) character.x = 50;
    if (character.x > width - 50) character.x = width - 50;
  } else if (character.animationState === "transition_end") {
    // Play transition frames in reverse (2, 1, 0) then go to idle
    if (character.currentFrame > 0) {
      character.frameCounter++;
      if (character.frameCounter > 5) {
        character.currentFrame--;
        character.frameCounter = 0;
      }
    } else {
      character.animationState = "idle";
    }
  } else if (character.animationState === "idle") {
    // Idle: show frame 0
    character.currentFrame = 0;
    character.frameCounter = 0;
  }
}

// ------------------------------
// Draw the character with current animation
// ------------------------------
function drawCharacter() {
  push(); // Save current drawing state

  // Move to character position
  translate(character.x, character.y);

  // Flip horizontally if facing right
  if (character.direction === 1) {
    scale(-1, 1);
  }

  // Draw the current frame (use processed frames if available)
  const framesToDraw =
    processedCharacterFrames && processedCharacterFrames.length
      ? processedCharacterFrames
      : characterFrames;

  if (framesToDraw[character.currentFrame]) {
    let img = framesToDraw[character.currentFrame];
    imageMode(CENTER);
    image(
      img,
      0,
      0,
      img.width * character.scale,
      img.height * character.scale * character.verticalStretch,
    );
  }

  pop(); // Restore drawing state

  // Debug info (optional - remove later)
  fill(0);
  textSize(14);
  textAlign(LEFT);
  text(
    `Position: ${round(character.x)}, ${round(character.y)}`,
    10,
    height - 60,
  );
  text(
    `Frame: ${character.currentFrame}/${characterFrames.length - 1} | State: ${character.animationState}`,
    10,
    height - 40,
  );
  text(
    `Direction: ${character.direction === 1 ? "Right" : "Left"}`,
    10,
    height - 20,
  );
}
