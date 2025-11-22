// public/premium.js
document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById("premium-submit");
    const msgEl = document.getElementById("premium-msg");
    const errEl = document.getElementById("premium-err");

    submitBtn.addEventListener("click", async () => {
        msgEl.style.display = "none";
        errEl.style.display = "none";

        // 입력값 수집
        const concern = document.getElementById("concern").value.trim();
        const nickname = document.getElementById("nickname").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const age = document.getElementById("age").value.trim();
        const gender = document.getElementById("gender").value;
        const height = document.getElementById("height").value.trim();
        const weight = document.getElementById("weight").value.trim();
        const injury = document.getElementById("injury").value.trim();
        const latest_record = document.getElementById("latest_record").value.trim();
        const recent_three = document.getElementById("recent_three").value.trim();
        const weekly_time = document.getElementById("weekly_time").value.trim();
        const goal = document.getElementById("goal").value.trim();

        // 필수 항목 검증
        if (!nickname || !email || !age || !gender || !height || !weight || !goal) {
            errEl.textContent = "필수 항목을 모두 입력해주세요.";
            errEl.style.display = "block";
            return;
        }

        try {
            const res = await fetch("/api/premium", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nickname,
                    email,
                    phone,
                    age,
                    gender,
                    height,
                    weight,
                    injury,
                    recent_record: latest_record,
                    record_3months: recent_three,
                    weekly_hours: weekly_time,
                    goal,
                    motivation: concern
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "저장 중 오류가 발생했습니다.");
            }

            // 성공
            msgEl.innerHTML = `
                🎉 프리미엄 등록이 완료되었습니다! <br>
                입력하신 이메일로 안내가 전송됩니다.
            `;
            msgEl.style.display = "block";

        } catch (err) {
            console.error(err);
            errEl.textContent = "서버와 연결할 수 없습니다. (Failed to fetch)";
            errEl.style.display = "block";
        }
    });
});
