import pandas as pd
import random
import time
from datetime import datetime
import os

DATA_FILE = "sensor_data.csv"

def generate_random_readings(weather_condition):
    # Adjust moisture based on weather
    if weather_condition == "Rain":
        moisture = random.uniform(60, 90)
    else:
        moisture = random.uniform(30, 60)

    return {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "moisture": round(moisture, 2),
        "temperature": round(random.uniform(20, 35), 2),
        "ph": round(random.uniform(5.5, 7.5), 2),
        "weather": weather_condition
    }

def simulate_weather_effect():
    while True:
        # Simulate weather
        weather = random.choice(["Rain", "Clear"])
        reading = generate_random_readings(weather)

        # Append new reading to CSV
        df_new = pd.DataFrame([reading])

        if os.path.exists(DATA_FILE):
            df_existing = pd.read_csv(DATA_FILE)
            df_combined = pd.concat([df_existing, df_new], ignore_index=True)
        else:
            df_combined = df_new

        df_combined.to_csv(DATA_FILE, index=False)
        print(f"Weather: {weather}, Moisture: {reading['moisture']}")

        time.sleep(30)

if __name__ == "__main__":
    simulate_weather_effect()
