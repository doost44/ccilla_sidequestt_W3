// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// This file only defines:
// 1) drawScene3() → what scene 3 looks like
// 2) input handlers → what happens when the player clicks or presses keys

function drawScene3() {
  background(20);
  fill(255);
  textSize(26);
  textAlign(CENTER, CENTER);
  text("Scene 3 (placeholder)", width / 2, height / 2 - 20);
  textSize(16);
  text("Press B to go back", width / 2, height / 2 + 20);
}

function scene3KeyPressed() {
  if (key === "b" || key === "B") {
    startFade("scene2");
  }
}
