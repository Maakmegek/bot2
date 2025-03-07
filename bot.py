from aiogram import Bot, Dispatcher, F
from aiogram.filters import Command
from aiogram.types import Message, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from aiogram.utils.keyboard import InlineKeyboardBuilder
from datetime import datetime
import sqlite3
import pytz
import json
from apscheduler.schedulers.asyncio import AsyncIOScheduler

# Настройки
TOKEN = "ВАШ_ТОКЕН"  # Замените на ваш токен
MOSCOW_TZ = pytz.timezone('Europe/Moscow')

# Инициализация
bot = Bot(token=TOKEN)
dp = Dispatcher()

# База данных
conn = sqlite3.connect('fitness.db', check_same_thread=False)
cursor = conn.cursor()

# Создание таблиц
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY,
        current_streak INTEGER DEFAULT 0,
        max_streak INTEGER DEFAULT 0,
        last_workout_date TEXT
    )
''')
conn.commit()

# Утилиты
def get_user_stats(user_id):
    cursor.execute('SELECT current_streak, max_streak FROM users WHERE user_id = ?', (user_id,))
    streak, max_streak = cursor.fetchone() or (0, 0)
    return {"streak": streak, "max_streak": max_streak}

def update_workout(user_id):
    today = datetime.now(MOSCOW_TZ).date().isoformat()
    
    # Обновляем данные
    cursor.execute('''
        UPDATE users 
        SET current_streak = current_streak + 1,
            last_workout_date = ?
        WHERE user_id = ?
    ''', (today, user_id))
    
    # Обновляем рекорд
    cursor.execute('''
        UPDATE users 
        SET max_streak = MAX(max_streak, current_streak)
        WHERE user_id = ?
    ''', (user_id,))
    conn.commit()

# Команда /start
@dp.message(Command("start"))
async def start(message: Message):
    web_app = WebAppInfo(url="https://ваш-домен.com/app.html")  # Замените на ваш URL
    keyboard = InlineKeyboardBuilder()
    keyboard.add(InlineKeyboardButton(text="Открыть приложение", web_app=web_app))
    await message.answer("Добро пожаловать! Откройте Mini App:", reply_markup=keyboard.as_markup())

# Обработчик данных из Mini App
@dp.message(F.web_app_data)
async def handle_web_app(message: Message):
    user_id = message.from_user.id
    data = json.loads(message.web_app_data.data)
    
    if data['action'] == 'get_stats':
        stats = get_user_stats(user_id)
        await message.answer(web_app_data=json.dumps(stats))
        
    elif data['action'] == 'log_workout':
        update_workout(user_id)
        await message.answer(web_app_data=json.dumps({"status": "success"}))

# Запуск бота
if __name__ == '__main__':
    dp.run_polling(bot)