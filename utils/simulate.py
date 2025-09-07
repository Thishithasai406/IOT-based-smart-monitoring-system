# utils/simulate.py
import random
from datetime import datetime

def get_sensor_data():
    moisture = round(random.uniform(30, 90), 2)  # 30-90% range
    temperature = round(random.uniform(20, 40), 2)  # 20-40°C range
    ph = round(random.uniform(6, 8), 2)  # 6-8 pH range
    weather_options = ['Clear', 'Rain', 'Cloudy']
    weather = random.choice(weather_options)
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    return {
        'moisture': moisture,
        'temperature': temperature,
        'ph': ph,
        'weather': weather,
        'timestamp': timestamp
    }