// public/premium.js
document.addEventListener("DOMContentLoaded", () => {
    const submit = document.getElementById("premium-submit");
    const msg = document.getElementById("premium-msg");
    const err = document.getElementById("premium-err");

    submit.addEventListener("click", async () => {
        msg.style.display = "none";
        err.style.display = "none";

        const data = {
            nickname: document.getElementById("nickname").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            age: document.getElementById("age").value,
            gender: document.getElementById("gender").value,
            goal: document.getElementById("goal").value,
            motivation: document.getElementById("motivation").value
        };

        if (!data.nickname || !data.email || !data.age || !data.gender || !data.goal) {
            err.textContent = "필수 항목을 모두 입력해주세요.";
            err.style.display = "block";
            return;
        }

        try {
            const res = await fetch("/api/premium", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.message);

            msg.innerHTML =
                "🎉 프리미엄 등록이 완료되었습니다!<br>" +
                "정식 출시 시 이메일로 가장 먼저 안내드릴게요.";
            msg.style.display = "block";

        } catch (e) {
            err.textContent = "서버 오류: " + e.message;
            err.style.display = "block";
        }
    });
});
