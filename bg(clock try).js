const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

let width, height;
let hoverActive = false;
let time = 0;

let lastMoveTime = Date.now();
let hiddenDots = new Set();

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const spacing = 40;
const baseRadius = 1.5;

/* 마우스 움직임 감지 */
window.addEventListener("mousemove", () => {
  lastMoveTime = Date.now();
  hiddenDots.clear(); // 🔥 움직이면 복구
});

/* hover 감지 */
document.querySelectorAll(".box").forEach(box => {
  box.addEventListener("mouseenter", () => hoverActive = true);
  box.addEventListener("mouseleave", () => hoverActive = false);
});

/************************************************************** time clock */
const digitPatterns = {

"0":[
"111",
"101",
"101",
"101",
"111"
],

"1":[
"010",
"110",
"010",
"010",
"111"
],

"2":[
"111",
"001",
"111",
"100",
"111"
],

"3":[
"111",
"001",
"111",
"001",
"111"
],

"4":[
"101",
"101",
"111",
"001",
"001"
],

"5":[
"111",
"100",
"111",
"001",
"111"
],

"6":[
"111",
"100",
"111",
"101",
"111"
],

"7":[
"111",
"001",
"001",
"001",
"001"
],

"8":[
"111",
"101",
"111",
"101",
"111"
],

"9":[
"111",
"101",
"111",
"001",
"111"
]

};

/************************************************************function */

function getHourDots() {

  const now = new Date();

  // 정각~59초 동안만 표시
  //if (now.getMinutes() !== 0) return [];

  const hourText =
    now.getHours()
      .toString()
      .padStart(2, "0");

  const coords = [];

  const gridWidth = Math.floor(width / spacing);
  const gridHeight = Math.floor(height / spacing);

  const startX = Math.floor(gridWidth / 2) - 4;
  const startY = Math.floor(gridHeight / 2) - 2;

  const left = digitPatterns[hourText[0]];
  const right = digitPatterns[hourText[1]];

  left.forEach((row, y) => {

    row.split("").forEach((v, x) => {

      if (v === "1") {
        coords.push(`${startX + x},${startY + y}`);
      }

    });

  });

  right.forEach((row, y) => {

    row.split("").forEach((v, x) => {

      if (v === "1") {
        coords.push(`${startX + x + 5},${startY + y}`);
      }

    });

  });

  return coords;
}

/******************************************************************** draw */

function draw() {

const protectedDots = new Set(
  getHourDots()
);




  ctx.clearRect(0, 0, width, height);

  const groupSize = spacing * 2;
const now = Date.now();

// 🔥 마우스 멈춘 상태일 때만
if (now - lastMoveTime > 1000) {

  // 🔥 1초마다 1개씩
 if (now - lastRemoveTime > 1000) {
  lastRemoveTime = now;

  for (let i = 0; i < 2; i++) {
    const randX = Math.floor(Math.random() * (width / spacing));
    const randY = Math.floor(Math.random() * (height / spacing));
    


    const key = `${randX},${randY}`;

    if (!protectedDots.has(key)) {
    hiddenDots.add(key);
    }




  }
}
}

  for (let gx = 0; gx < width; gx += groupSize) {
    for (let gy = 0; gy < height; gy += groupSize) {

      const centerX = gx + spacing;
      const centerY = gy + spacing;

      let angle = 0;
      if (hoverActive) {
        angle = Math.sin(time * 3) * 0.5;
      }

      const dots = [
        [-spacing/2, -spacing/2],
        [ spacing/2, -spacing/2],
        [-spacing/2,  spacing/2],
        [ spacing/2,  spacing/2],
      ];

      dots.forEach(d => {

        const gridX = Math.round((centerX + d[0]) / spacing);
        const gridY = Math.round((centerY + d[1]) / spacing);



        const key = `${gridX},${gridY}`;

        if (
        hiddenDots.has(key) &&
        !protectedDots.has(key)
        ) {
        return;
        }


        const rx = d[0] * Math.cos(angle) - d[1] * Math.sin(angle);
        const ry = d[0] * Math.sin(angle) + d[1] * Math.cos(angle);

        /*ctx.beginPath();
        ctx.arc(centerX + rx, centerY + ry, baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(179, 251, 33, 0.9)";
        ctx.fill();*/
     
ctx.beginPath();
ctx.arc(centerX + rx, centerY + ry, baseRadius, 0, Math.PI * 2);

// 🔥 여기부터 색상 계산
const hour = new Date().getHours();
const dayProgress = hour / 24;

const baseHue = 80;
const hueShift = Math.sin(dayProgress * Math.PI * 2) * 20;
const finalHue = baseHue + hueShift;

ctx.fillStyle = `hsla(${finalHue}, 90%, 55%, 0.9)`;
// 🔥 여기까지

ctx.fill();

      });

    }
  }

  if (hoverActive) time += 0.05;

  requestAnimationFrame(draw);
}

let lastRemoveTime = Date.now();
draw();