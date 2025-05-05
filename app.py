from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import sqlite3
import os
from utils.simulate import get_sensor_data
from datetime import datetime
import csv
import random

app = Flask(__name__)
app.secret_key = 'smartfarming_secret'
DB_PATH = 'data/sensor_data.db'

# Ensure DB exists and recreate tables
def init_db():
    os.makedirs('data', exist_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.cursor()
        # Drop existing tables to avoid schema mismatch
        cur.execute("DROP TABLE IF EXISTS sensor_data")
        cur.execute("DROP TABLE IF EXISTS users")
        cur.execute('''CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )''')
        cur.execute('''CREATE TABLE IF NOT EXISTS sensor_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            moisture REAL,
            temperature REAL,
            ph REAL,
            weather TEXT,
            timestamp TEXT
        )''')
        cur.execute("SELECT * FROM users WHERE username = 'admin'")
        if not cur.fetchone():
            cur.execute("INSERT INTO users (username, password) VALUES (?, ?)", ('admin', 'admin123'))
        conn.commit()

# Simulate daily district soil data
def get_district_soil_data(district):
    return {
        'moisture': round(random.uniform(20, 80), 1),
        'temperature': round(random.uniform(15, 40), 1),
        'ph': round(random.uniform(5.0, 9.0), 1),
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }

# Save sensor data to database with debug
def save_sensor_data():
    data = get_sensor_data()
    print(f"Data before insert: {data}")  # Debug: Print data to console
    # Ensure timestamp is valid
    if not data.get('timestamp') or not isinstance(data['timestamp'], str):
        data['timestamp'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.cursor()
        cur.execute("INSERT INTO sensor_data (moisture, temperature, ph, weather, timestamp) VALUES (?, ?, ?, ?, ?)",
                    (data['moisture'], data['temperature'], data['ph'], data['weather'], data['timestamp']))
        conn.commit()
    return data

@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        with sqlite3.connect(DB_PATH) as conn:
            cur = conn.cursor()
            cur.execute("SELECT * FROM users WHERE username=? AND password=?", (username, password))
            user = cur.fetchone()
            if user:
                session['user'] = username
                return redirect(url_for('dashboard'))
            else:
                return render_template('login.html', error="Invalid credentials")
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        with sqlite3.connect(DB_PATH) as conn:
            cur = conn.cursor()
            cur.execute("SELECT * FROM users WHERE username=?", (username,))
            if cur.fetchone():
                return render_template('login.html', error="Username already exists")
            cur.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
            conn.commit()
        return redirect(url_for('login'))
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect(url_for('login'))
    led_status = session.get('led_status', 'OFF')
    # Save new sensor data on dashboard load
    save_sensor_data()
    return render_template("dashboard.html", led_status=led_status)

@app.route('/sensor-data')
def sensor_data():
    data = save_sensor_data()  # Save and return latest data
    return jsonify(data)

@app.route('/soil-types')
def soil_types():
    soil_types_data = [
        {"name": "Alluvial Soil", "image": "soils/alluvial.jpg", "description": "Fertile and found in river basins. Great for rice, wheat, and sugarcane."},
        {"name": "Black Soil", "image": "soils/black.jpg", "description": "Rich in clay and moisture. Ideal for cotton and soybeans."},
        {"name": "Red Soil", "image": "soils/red.jpg", "description": "High in iron and dry areas. Needs fertilizers for productivity."},
        {"name": "Laterite Soil", "image": "soils/laterite.jpg", "description": "Found in heavy rainfall areas. Suitable for tea, coffee, and cashews."},
        {"name": "Mountain Soil", "image": "soils/mountain.jpg", "description": "Found in hilly terrains. Good for fruits and plantation crops."},
        {"name": "Desert Soil", "image": "soils/desert.jpg", "description": "Sandy and low fertility but usable with irrigation and fertilization."}
    ]
    return render_template('soil_types.html', soil_types=soil_types_data)

@app.route('/rice-stages')
def rice_stages():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('rice_stages.html')

@app.route('/district-info', methods=['GET', 'POST'])
def district_info():
    if 'user' not in session:
        return redirect(url_for('login'))
    district_data = {
        "Visakhapatnam": {"soil": "Red Soil", "crops": "Rice, Sugarcane", "water": "Moderate (twice weekly)", "lat": 17.6868, "lon": 83.2185},
        "Guntur": {"soil": "Black Soil", "crops": "Cotton, Chillies", "water": "High (daily)", "lat": 16.3067, "lon": 80.4365},
        "Krishna": {"soil": "Alluvial Soil", "crops": "Paddy, Mango", "water": "Moderate (twice weekly)", "lat": 16.6090, "lon": 81.1487},
        "Chittoor": {"soil": "Sandy Loam", "crops": "Groundnut, Tomato", "water": "Low (weekly)", "lat": 13.2172, "lon": 79.1003},
        "East Godavari": {"soil": "Deltaic Soil", "crops": "Rice, Coconut", "water": "High (daily)", "lat": 16.9470, "lon": 82.2370}
    }
    selected_district = request.form.get('district', 'Visakhapatnam')
    soil_data = get_district_soil_data(selected_district) if request.method == 'POST' and request.form.get('fetch_soil') else None
    return render_template('district_info.html', districts=district_data, selected_district=selected_district, soil_data=soil_data)

@app.route('/toggle-led', methods=['POST'])
def toggle_led():
    if 'user' not in session:
        return redirect(url_for('login'))
    led_status = session.get('led_status', 'OFF')
    new_status = 'ON' if led_status == 'OFF' else 'OFF'
    session['led_status'] = new_status
    return jsonify({'led_status': new_status})

@app.route('/logout')
def logout():
    session.pop('user', None)
    session.pop('led_status', None)
    return redirect(url_for('login'))

@app.route('/export')
def export():
    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM sensor_data")
        rows = cur.fetchall()
        print(f"Exported rows: {rows}")  # Debug
    with open('sensor_data.csv', 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['ID', 'Moisture', 'Temperature', 'pH', 'Weather', 'Timestamp'])
        for row in rows:
            # Ensure timestamp is written as a string
            writer.writerow([row[0], row[1], row[2], row[3], row[4], str(row[5])])
    from flask import send_file
    return send_file('sensor_data.csv', as_attachment=True, download_name='sensor_data_export.csv')

if __name__ == '__main__':
    init_db()
    app.run(debug=True)