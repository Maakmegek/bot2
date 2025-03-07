const tg = window.Telegram.WebApp;
tg.ready();

async function fetchData() {
    try {
        const response = await fetch('/api/getStreak', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ initData: tg.initData })
        });
        
        if (!response.ok) throw new Error("Ошибка при получении данных");
        const data = await response.json();
        document.getElementById('streak').innerText = data.streak || 0;
    } catch (error) {
        console.error("Ошибка:", error);
    }
}

document.getElementById('workoutBtn').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/logWorkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ initData: tg.initData })
        });

        if (!response.ok) throw new Error("Ошибка при отправке данных");
        
        const result = await response.json();
        if (result.status === "success") {
            alert("Тренировка засчитана!");
            fetchData(); // Обновляем данные
        } else if (result.status === "already_logged") {
            alert("Вы уже тренировались сегодня!");
        }
    } catch (error) {
        console.error("Ошибка:", error);
    }
});

fetchData();