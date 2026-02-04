// ------------------------------------------------------------
// main.js = the “router” (traffic controller) for the whole game
// ------------------------------------------------------------
//
// Idea: this project has multiple screens (start, instructions, game, win, lose).
// Instead of putting everything in one giant file, each screen lives in its own
// file and defines two main things:
//   1) drawX()         → how that screen looks
//   2) XMousePressed() / XKeyPressed() → how that screen handles input
//
// This main.js file does 3 important jobs:
//   A) stores the current screen in a single shared variable
//   B) calls the correct draw function each frame
//   C) sends mouse/keyboard input to the correct screen handler

// ------------------------------
// Global game state
// ------------------------------
// This variable is shared across all files because all files run in the same
// global JavaScript scope when loaded in index.html.
//
// We store the “name” of the current screen as a string.
// Only one screen should be active at a time.
let currentScreen = "start"; // "start" | "instr" | "game" | "win" | "lose"

// ------------------------------
// Character animation frames
// ------------------------------
// Array to store the combined animation sequence
let characterFrames = [];
// Array to store processed frames with visual adjustments
let processedCharacterFrames = [];

// Video and image assets
let titleVideo;
let section1Background;
let section1Foreground;
let section2BackgroundVideo;
let section2Foreground;
let videoPlaying = false;
let videoStartTime = 0;

// Fade transition variables
let fadeAlpha = 0;
let isFading = false;
let fadingTo = "";
let fadeSpeed = 5;

// ------------------------------
// preload() runs BEFORE setup()
// ------------------------------
// Use this to load all images, sounds, fonts, etc.
function preload() {
  // Load idle frames (1.png - 2.png)
  characterFrames.push(loadImage("assets/images/1.png"));
  characterFrames.push(loadImage("assets/images/2.png"));

  // Load transition frame (2turn1.png)
  characterFrames.push(loadImage("assets/images/2turn1.png"));

  // Load walk frames (turn2 frames: 2, 3, 4, 6-18)
  const turn2Frames = [2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  for (let i of turn2Frames) {
    characterFrames.push(loadImage(`assets/images/${i}turn2.png`));
  }

  // Load background image for section 1
  section1Background = loadImage("assets/images/Background Section 1.jpg");

  // Load foreground image for section 1
  section1Foreground = loadImage("assets/images/fore.png");
}

// ------------------------------
// setup() runs ONCE at the beginning
// ------------------------------
// This is where you usually set canvas size and initial settings.
function setup() {
  createCanvas(800, 800);

  // Sets a default font for all text() calls
  // (This can be changed later per-screen if you want.)
  textFont("sans-serif");

  // Apply contrast and saturation to all character frames (now that they're fully loaded)
  processedCharacterFrames = [];
  characterFrames.forEach((frame) => {
    const processed = frame.get();
    applyContrastAndSaturation(processed, 1.8, 0.57, 0.9, 0.45); // contrast, saturation, brightness, blackness
    processedCharacterFrames.push(processed);
  });

  // Load video (must be done in setup, not preload)
  titleVideo = createVideo("assets/images/Goatman Title Screen.mp4");
  titleVideo.hide(); // Hide the DOM element, we'll draw it on canvas
  titleVideo.pause(); // Start paused
  titleVideo.onended(() => {
    // When video ends, go to game screen
    currentScreen = "game";
    videoPlaying = false;
    videoStartTime = 0;
  });

  // Load section 2 background video
  section2BackgroundVideo = createVideo("assets/images/GROUND.mp4", () => {
    console.log("Section 2 video loaded successfully");
    section2BackgroundVideo.loop();
    section2BackgroundVideo.volume(1);
  });
  section2BackgroundVideo.hide();
}

// ------------------------------
// draw() runs every frame (many times per second)
// ------------------------------
// This is the core “router” for visuals.
// Depending on currentScreen, we call the correct draw function.
function draw() {
  // Each screen file defines its own draw function:
  //   start.js         → drawStart()
  //   instructions.js  → drawInstr()
  //   game.js          → drawGame()
  //   scene2.js        → drawScene2()
  //   scene3.js        → drawScene3()
  //   win.js           → drawWin()
  //   lose.js          → drawLose()

  if (currentScreen === "start") drawStart();
  else if (currentScreen === "instr") drawInstr();
  else if (currentScreen === "game") drawGame();
  else if (currentScreen === "scene2") drawScene2();
  else if (currentScreen === "scene3") drawScene3();
  else if (currentScreen === "win") drawWin();
  else if (currentScreen === "lose") drawLose();

  // Handle fade transition
  if (isFading) {
    updateFade();
  } else if (currentScreen === "instr") drawInstr();
  else if (currentScreen === "game") drawGame();
  else if (currentScreen === "win") drawWin();
  else if (currentScreen === "lose") drawLose();

  // (Optional teaching note)
  // This “if/else chain” is a very common early approach.
  // Later in the course you might replace it with:
  // - a switch statement, or
  // - an object/map of screens
}

// ------------------------------
// mousePressed() runs once each time the mouse is clicked
// ------------------------------
// This routes mouse input to the correct screen handler.
function mousePressed() {
  // Each screen *may* define a mouse handler:
  // start.js         → startMousePressed()
  // instructions.js  → instrMousePressed()
  // game.js          → gameMousePressed()
  // scene2.js        → scene2MousePressed()
  // scene3.js        → scene3MousePressed()
  // win.js           → winMousePressed()
  // lose.js          → loseMousePressed()

  if (currentScreen === "start") startMousePressed();
  else if (currentScreen === "instr") instrMousePressed();
  else if (currentScreen === "game") gameMousePressed();
  else if (currentScreen === "scene2") scene2MousePressed?.();
  else if (currentScreen === "scene3") scene3MousePressed?.();
  // The ?.() means “call this function only if it exists”
  // This prevents errors if a screen doesn’t implement a handler.
  else if (currentScreen === "win") winMousePressed?.();
  else if (currentScreen === "lose") loseMousePressed?.();
}

// ------------------------------
// keyPressed() runs once each time a key is pressed
// ------------------------------
// This routes keyboard input to the correct screen handler.
function keyPressed() {
  // Each screen *may* define a key handler:
  // start.js         → startKeyPressed()
  // instructions.js  → instrKeyPressed()
  // game.js          → gameKeyPressed()
  // scene2.js        → scene2KeyPressed()
  // scene3.js        → scene3KeyPressed()
  // win.js           → winKeyPressed()
  // lose.js          → loseKeyPressed()

  if (currentScreen === "start") startKeyPressed();
  else if (currentScreen === "instr") instrKeyPressed();
  else if (currentScreen === "game") gameKeyPressed?.();
  else if (currentScreen === "scene2") scene2KeyPressed?.();
  else if (currentScreen === "scene3") scene3KeyPressed?.();
  else if (currentScreen === "win") winKeyPressed?.();
  else if (currentScreen === "lose") loseKeyPressed?.();
}

// ------------------------------
// keyReleased() runs once each time a key is released
// ------------------------------
// This routes keyboard release events to the correct screen handler.
function keyReleased() {
  // Each screen *may* define a key release handler:
  // game.js → gameKeyReleased()
  // scene2.js → scene2KeyReleased()
  // scene3.js → scene3KeyReleased()

  if (currentScreen === "game") gameKeyReleased?.();
  else if (currentScreen === "scene2") scene2KeyReleased?.();
  else if (currentScreen === "scene3") scene3KeyReleased?.();
}

// ------------------------------------------------------------
// Shared helper function: isHover()
// ------------------------------------------------------------
//
// Many screens have buttons.
// This helper checks whether the mouse is inside a rectangle.
//
// Important: our buttons are drawn using rectMode(CENTER),
// meaning x,y is the CENTRE of the rectangle.
// So we check mouseX and mouseY against half-width/half-height bounds.
//
// Input:  an object with { x, y, w, h }
// Output: true if mouse is over the rectangle, otherwise false
function isHover({ x, y, w, h }) {
  return (
    mouseX > x - w / 2 && // mouse is right of left edge
    mouseX < x + w / 2 && // mouse is left of right edge
    mouseY > y - h / 2 && // mouse is below top edge
    mouseY < y + h / 2 // mouse is above bottom edge
  );
}

// ------------------------------
// Image processing helper
// ------------------------------
// Applies contrast and saturation adjustments to an image by manipulating pixels
function applyContrastAndSaturation(
  img,
  contrast,
  saturation,
  brightness = 1.0,
  blackness = 0.0,
) {
  img.loadPixels();

  let modifiedCount = 0;
  for (let i = 0; i < img.pixels.length; i += 4) {
    let r = img.pixels[i];
    let g = img.pixels[i + 1];
    let b = img.pixels[i + 2];
    // a = img.pixels[i + 3]; // alpha channel (unchanged)

    // Apply contrast using a simpler formula: move values away from middle gray
    r = constrain((r - 128) * contrast + 128, 0, 255);
    g = constrain((g - 128) * contrast + 128, 0, 255);
    b = constrain((b - 128) * contrast + 128, 0, 255);

    // Apply saturation by calculating distance from grayscale
    let gray = (r + g + b) / 3;
    r = constrain(gray + (r - gray) * saturation, 0, 255);
    g = constrain(gray + (g - gray) * saturation, 0, 255);
    b = constrain(gray + (b - gray) * saturation, 0, 255);

    // Apply brightness
    r = constrain(r * brightness, 0, 255);
    g = constrain(g * brightness, 0, 255);
    b = constrain(b * brightness, 0, 255);

    // Apply blackness (subtract a fixed amount from all channels)
    const blackOffset = blackness * 255;
    r = constrain(r - blackOffset, 0, 255);
    g = constrain(g - blackOffset, 0, 255);
    b = constrain(b - blackOffset, 0, 255);

    // Write adjusted values back
    img.pixels[i] = r;
    img.pixels[i + 1] = g;
    img.pixels[i + 2] = b;

    if (i < 20) modifiedCount++;
  }

  img.updatePixels();
  void modifiedCount;
}

// ------------------------------
// Fade transition functions
// ------------------------------
function startFade(targetScreen) {
  isFading = true;
  fadingTo = targetScreen;
  fadeAlpha = 0;
}

function updateFade() {
  // Fade to black
  if (fadeAlpha < 255) {
    fadeAlpha += fadeSpeed;
    push();
    noStroke();
    fill(0, 0, 0, fadeAlpha);
    rectMode(CORNER);
    rect(0, 0, width, height);
    pop();

    // Switch screen at halfway point
    if (fadeAlpha >= 127 && currentScreen !== fadingTo) {
      currentScreen = fadingTo;
    }
  } else {
    // Fade complete
    isFading = false;
    fadeAlpha = 0;
  }
}
