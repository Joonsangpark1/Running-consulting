// public/main.js
document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById("submit-btn");
    const msgEl = document.getElementById("message");
    const errEl = document.getElementById("error");

    submitBtn.addEventListener("click", async () => {
        msgEl.style.display = "none";
        errEl.style.display = "none";

        // 입력값 수집
        const situation = document.getElementById("situation").value;
        const current_time = document.getElementById("current_time").value;
        const needed_factor = document.getElementById("needed_factor").value.trim();
        const current_training = document.getElementById("current_training").value.trim();
        const price_range = document.getElementById("price_range").value;
        const premium_extra = document.getElementById("premium_extra").value.trim();
        const email = document.getElementById("email").value.trim();

        // 검증
        if (!email) {
            errEl.textContent = "이메일은 필수 입력 항목입니다.";
            errEl.style.display = "block";
            return;
        }

        try {
            const res = await fetch("/api/survey", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    situation,
                    current_time,
                    needed_factor,
                    current_training,
                    price_range,
                    premium_extra,
                    email
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "저장 중 오류가 발생했습니다.");
            }

            // 성공 메시지
            msgEl.textContent = "설문이 성공적으로 제출되었습니다!";
            msgEl.style.display = "block";

            // 입력 초기화
            document.getElementById("situation").value = "";
            document.getElementById("current_time").value = "";
            document.getElementById("needed_factor").value = "";
            document.getElementById("current_training").value = "";
            document.getElementById("price_range").value = "";
            document.getElementById("premium_extra").value = "";
            document.getElementById("email").value = "";

            // thankyou 페이지로 이동
            setTimeout(() => {
                window.location.href = "/thankyou.html";
            }, 1200);

        } catch (err) {
            console.error(err);
            errEl.textContent = "서버와 연결할 수 없습니다. (Failed to fetch)";
            errEl.style.display = "block";
        }
    });
});
