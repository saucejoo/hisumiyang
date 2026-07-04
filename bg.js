const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");


/******************************************************** 2번 영역 ****/
const accordions = document.querySelectorAll(".accordion");

accordions.forEach(item => {

  const header = item.querySelector(".accordion-header");
  const symbol = item.querySelector("span");

  header.addEventListener("click", () => {

    item.classList.toggle("active");

    symbol.textContent =
      item.classList.contains("active")
      ? "−"
      : "+";

  });

});

const experienceItems = document.querySelectorAll(".experience-item");

experienceItems.forEach(item => {

  const header = item.querySelector(".experience-header");
  const detail = item.querySelector(".experience-detail");
  const arrow = item.querySelector(".arrow");

  header.addEventListener("click", () => {

    item.classList.toggle("open");

    if (item.classList.contains("open")) {
      detail.style.display = "block";
      arrow.textContent = "▼";
    } else {
      detail.style.display = "none";
      arrow.textContent = "▶";
    }

  });

});


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

function draw() {

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
    hiddenDots.add(`${randX},${randY}`);
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

        if (hiddenDots.has(`${gridX},${gridY}`)) return;

        const rx = d[0] * Math.cos(angle) - d[1] * Math.sin(angle);
        const ry = d[0] * Math.sin(angle) + d[1] * Math.cos(angle);

        /*ctx.beginPath();
        ctx.arc(centerX + rx, centerY + ry, baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(179, 251, 33, 0.9)";
        ctx.fill();*/
     
ctx.beginPath();
ctx.arc(centerX + rx, centerY + ry, baseRadius, 0, Math.PI * 2);

//////////////////////////////////////////////////////////////////  여기부터 색상 계산
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


//////////////////////////////////////////////////////////////////  여기부터 방명록

const guestForm = document.getElementById("guestbookForm");
const guestList = document.getElementById("guestbookList");

guestForm.addEventListener("submit",(e)=>{

    e.preventDefault();

    const name =
        document.getElementById("guestName").value.trim();

    const message =
        document.getElementById("guestMessage").value.trim();

    if(!name || !message) return;

    const date =
        new Date().toLocaleDateString();

    const item = document.createElement("div");

    item.className="guest-item";

    item.innerHTML=`
        <div class="guest-name">${name}</div>
        <div>${message}</div>
        <div class="guest-date">${date}</div>
    `;

    guestList.prepend(item);

    guestForm.reset();

});
