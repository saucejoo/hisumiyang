// ===============================
// Floating Banner Animation
// ===============================

const banner = document.querySelector(".bottom-banner");

if (banner) {

    let x = -banner.offsetWidth;

    const speed = 2;

    // 🔥 마우스 호버 시 정지 상태
    let paused = false;

    // 자동차 몸통에 마우스 올리면 멈추고, 벗어나면 다시 이동
    const carBody = banner.querySelector(".banner-body");

    if (carBody) {
        carBody.addEventListener("mouseenter", () => paused = true);
        carBody.addEventListener("mouseleave", () => paused = false);
    }

    // 이메일 클릭 시 복사
    const emailEl = banner.querySelector(".banner-email");

    if (emailEl) {

        emailEl.addEventListener("click", (e) => {

            e.stopPropagation();

            const email = emailEl.dataset.email || emailEl.textContent.trim();

            const showCopied = () => {

                // 이미 떠있는 안내가 있으면 제거
                const old = banner.querySelector(".banner-copied");
                if (old) old.remove();

                const tip = document.createElement("div");
                tip.className = "banner-copied";
                tip.textContent = "복사됨!";
                emailEl.style.position = "relative";
                emailEl.appendChild(tip);

                // 표시
                requestAnimationFrame(() => tip.classList.add("show"));

                setTimeout(() => {
                    tip.classList.remove("show");
                    setTimeout(() => tip.remove(), 300);
                }, 1200);
            };

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(showCopied).catch(fallbackCopy);
            } else {
                fallbackCopy();
            }

            function fallbackCopy() {
                const ta = document.createElement("textarea");
                ta.value = email;
                ta.style.position = "fixed";
                ta.style.opacity = "0";
                document.body.appendChild(ta);
                ta.select();
                try { document.execCommand("copy"); } catch (err) {}
                document.body.removeChild(ta);
                showCopied();
            }

        });
    }

    function animateBanner() {

        // 🔥 호버 중이면 이동 정지 (그 자리에 멈춤)
        if (paused) {
            requestAnimationFrame(animateBanner);
            return;
        }

        // 오른쪽으로 이동
        x += speed;

        // 화면 밖으로 나가면 다시 왼쪽
        if (x > window.innerWidth) {
            x = -banner.offsetWidth;
        }

        // 위아래로 떠다니기
        const floatY = Math.sin(performance.now() * 0.0105) * 4;

        // 왼쪽에서 서서히 나타나기
        let opacity = 1;

        if (x < 120) {
            opacity = Math.max(0, x / 120);
        }

        banner.style.opacity = opacity;

        banner.style.transform =
            `translate(${x}px, ${floatY}px)`;

        requestAnimationFrame(animateBanner);

    }

    // 창 크기 변경 시 자연스럽게 이어가기
    window.addEventListener("resize", () => {

        if (x > window.innerWidth) {
            x = -banner.offsetWidth;
        }

    });

    animateBanner();

}