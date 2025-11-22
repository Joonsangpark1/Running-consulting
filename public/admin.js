// public/admin.js
document.addEventListener("DOMContentLoaded", () => {
    const table = document.getElementById("survey-table");
    const tbody = document.getElementById("survey-body");
    const loading = document.getElementById("loading");
    const empty = document.getElementById("empty");

    fetch("/api/survey")
        .then(res => res.json())
        .then(data => {
            // 로딩 메시지 숨기기
            loading.style.display = "none";

            // 데이터 없음
            if (!data || data.length === 0) {
                empty.style.display = "block";
                return;
            }

            // 데이터 존재 → 테이블 표시
            table.style.display = "table";

            data.forEach(item => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.current_time || "-"}</td>
                    <td>${item.needed_factor || "-"}</td>
                    <td>${item.current_training || "-"}</td>
                    <td>${item.price_range || "-"}</td>
                    <td>${item.premium_extra || "-"}</td>
                    <td>${item.feature_request || "-"}</td>
                    <td>${item.email || "-"}</td>
                    <td>${item.created_at}</td>
                `;

                tbody.appendChild(row);
            });
        })
        .catch(err => {
            console.error(err);
            loading.innerHTML = "❌ 데이터를 불러오는 중 오류가 발생했습니다.";
        });
});
