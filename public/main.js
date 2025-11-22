document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("submit-btn");
    const msg = document.getElementById("message");
    const err = document.getElementById("error");

    btn.addEventListener("click", async () => {
        msg.style.display = "none";
        err.style.display = "none";

        const data = {
            situation: document.getElementById("situation").value,
            current_time: document.getElementById("current_time").value,
            current_training: document.getElementById("current_training").value,
            premium_extra: document.getElementById("premium_extra").value,
            email: document.getElementById("email").value
        };

        // 필수 입력 체크
        if (!data.email || !data.situation || !data.current_time) {
            err.textContent = "필수 항목을 입력해주세요.";
            err.style.display = "block";
            return;
        }

        try {
            const res = await fetch("/api/survey", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const json = await res.json();

            if (!res.ok) throw new Error(json.message);

            // 성공 메시지
            msg.textContent = "제출이 완료되었습니다! 잠시 후 다음 페이지로 이동합니다.";
            msg.style.display = "block";

            // 🔥 thankyou.html 페이지로 이동
            setTimeout(() => {
                window.location.href = "thankyou.html";
            }, 1200);

        } catch (e) {
            err.textContent = "서버 오류: " + e.message;
            err.style.display = "block";
        }
    });
});
