const tg = window.Telegram.WebApp;

// Инициализация
tg.ready();

// Получение данных от бота
async function fetchData() {
    try {
        const response = await fetch(`https://api.telegram.org/bot8030183243:AAG8BoV-q8svAv8ZW0W3xleYI_FH_kZvfAw/getWebAppData`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ initData: tg.initData })
        });
        
        if (!response.ok) {
            throw new Error("Ошибка при получении данных");
        }

        const data = await response.json();
        document.getElementById('streak').innerText = data.streak || 0;
    } catch (error) {
        console.error("Ошибка:", error);
    }
}

// Кнопка тренировки
document.getElementById('workoutBtn').addEventListener('click', async () => {
    try {
        const response = await fetch(`https://api.telegram.org/bot8030183243:AAG8BoV-q8svAv8ZW0W3xleYI_FH_kZvfAw/sendWorkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ initData: tg.initData, action: 'log_workout' })
        });

        if (!response.ok) {
            throw new Error("Ошибка при отправке данных");
        }

        const result = await response.json();
        if (result.status === "success") {
            alert("Тренировка засчитана!");
            fetchData(); // Обновляем данные
        }
    } catch (error) {
        console.error("Ошибка:", error);
    }
});

// Загрузка данных при старте
fetchData();