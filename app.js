const tg = window.Telegram.WebApp;

// Инициализация
tg.ready();

// Получение данных от бота
async function fetchData() {
    const response = await fetch(`https://api.telegram.org/bot<ВАШ_ТОКЕН>/getWebAppData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData: tg.initData })
    });
    
    const data = await response.json();
    document.getElementById('streak').innerText = data.streak;
    // Обновление календаря и достижений аналогично
}

// Кнопка тренировки
document.getElementById('workoutBtn').addEventListener('click', async () => {
    await fetch(`https://api.telegram.org/bot<ВАШ_ТОКЕН>/sendWorkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData: tg.initData, action: 'log_workout' })
    });
    
    fetchData(); // Обновляем данные
});

// Загрузка данных при старте
fetchData();