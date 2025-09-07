# 🌱 SMART FARMING SYSTEM

A comprehensive IoT-based smart farming web application developed using **Python Flask** and **SQLite**. This system provides real-time soil monitoring, crop management, and agricultural insights for farmers.


Check out the demo video here: [Watch Video](https://youtu.be/_4jg1taWC8E)


---

## 🚀 Features

### 🔐 User Management
- **User Authentication**: Secure login/signup system with session management
- **Role-based Access**: Admin and regular user roles with different permissions
- **Session Management**: Secure user sessions with automatic logout

### 📊 Real-time Monitoring Dashboard
- **Soil Moisture Monitoring**: Real-time moisture percentage with alerts
- **Temperature Tracking**: Continuous temperature monitoring
- **pH Level Analysis**: Soil pH monitoring for optimal crop growth
- **Weather Conditions**: Current weather status display
- **Interactive Charts**: Plotly.js powered trend graphs for all sensor data
- **Auto-watering System**: Automatic pump control based on moisture levels

### 🌾 Agricultural Knowledge Base
- **Soil Types Guide**: Comprehensive information about 6 different soil types
  - Alluvial, Black, Red, Laterite, Mountain, and Desert soils
  - Detailed descriptions and suitable crops for each type
- **Rice Growth Stages**: Complete 8-stage rice cultivation guide
  - Germination to Harvest stages with detailed timelines
  - Visual representations and care instructions
- **District-wise Information**: Andhra Pradesh district agricultural data
  - Soil types, suitable crops, and watering requirements
  - Real-time soil data fetching for selected districts

### 📈 Data Management
- **Sensor Data Storage**: SQLite database for historical data
- **CSV Export**: Download sensor data for analysis
- **Real-time Updates**: Live sensor data simulation and updates
- **Data Visualization**: Interactive charts and graphs

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Toggle between themes
- **Background Video**: Immersive farming background
- **Interactive Cards**: Hover effects and smooth animations
- **Bootstrap Integration**: Modern UI components

---

## 🛠️ Technologies Used

### Backend
- **Python 3.x**: Core programming language
- **Flask**: Web framework for routing and server logic
- **SQLite**: Lightweight database for data storage
- **CSV**: Data export functionality

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Advanced styling with CSS variables and animations
- **JavaScript (ES6+)**: Interactive functionality and AJAX calls
- **Bootstrap 5**: Responsive UI components
- **Plotly.js**: Interactive data visualization
- **Google Fonts**: Typography (Poppins)

### Data & Assets
- **Sensor Simulation**: Realistic IoT sensor data generation
- **Image Assets**: Soil type and rice stage images
- **Video Background**: Immersive farming background video

---

## 📂 Project Structure

```
smart-farming-main/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── users.db              # SQLite user database
├── sensor_data.csv       # Exported sensor data
├── README.md             # Project documentation
├── static/               # Static assets
│   ├── css/
│   │   └── style.css     # Main stylesheet
│   ├── js/
│   │   └── script.js     # Frontend JavaScript
│   ├── images/
│   │   ├── soils/        # Soil type images
│   │   └── stages/       # Rice growth stage images
│   └── videos/
│       └── farm-bg.mp4   # Background video
└── templates/            # HTML templates
    ├── dashboard.html    # Main dashboard
    ├── login.html        # Authentication page
    ├── soil_types.html   # Soil information
    ├── rice_stages.html  # Rice growth guide
    ├── district_info.html # District data
    └── signup.html       # User registration
```

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.7 or higher
- pip (Python package manager)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-farming-main
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python app.py
   ```

4. **Access the application**
   - Open your browser and go to `[http://localhost:5000](http://127.0.0.1:5000/dashboard)`
   - Default admin credentials: `admin` / `admin123`

---

## 📱 Usage Guide

### Getting Started
1. **Login/Register**: Create an account or use admin credentials
2. **Dashboard**: View real-time sensor data and system status
3. **Navigate**: Use the navigation bar to access different features

### Key Features Usage

#### 📊 Dashboard
- **Real-time Monitoring**: View live soil moisture, temperature, and pH
- **Auto-watering**: System automatically controls irrigation based on moisture
- **Charts**: Interactive trend graphs for historical data analysis
- **Export Data**: Download sensor data as CSV for external analysis

#### 🌾 Soil Types
- **Browse Soils**: Click on soil type cards to view details
- **Crop Information**: Learn about suitable crops for each soil type
- **Visual Guide**: High-quality images for soil identification

#### 🌱 Rice Stages
- **Growth Timeline**: Navigate through 8 rice growth stages
- **Care Instructions**: Detailed care requirements for each stage
- **Visual Learning**: Images showing each growth phase

#### 🏞️ District Information
- **Select District**: Choose from Andhra Pradesh districts
- **Soil Data**: Fetch real-time soil conditions for selected district
- **Crop Recommendations**: View suitable crops and watering needs
  
#### 💧 Soil Moisture Monitoring
- **Dry Soil (<30%)**
- Message: "Soil too dry. Auto-watering triggered!"
- Action: Turns ON the water pump.
- Alert style: alert-dry

- **Wet Soil (>70%)**
- Message: "Soil too moist. Consider pausing irrigation."
- Action: Turns OFF the water pump.
- Alert style: alert-wet

- **Optimal Soil (30–70%)**
- Message: "Soil moisture is optimal."
- Action: No pump activity.
- Alert style: alert-normal

---

## 🔧 Configuration

### Database Setup
The application automatically creates the SQLite database with:
- User authentication tables
- Sensor data storage
- Default admin user

### Sensor Simulation
The system simulates realistic IoT sensor data including:
- Moisture levels (20-80%)
- Temperature readings (15-40°C)
- pH values (5.0-9.0)
- Weather conditions
- Automatic Irrigation Alerts


### Customization
- **Theme Colors**: Modify CSS variables in `style.css`
- **Sensor Ranges**: Adjust simulation parameters in `app.py`
- **District Data**: Add more districts in the district_info route

---

## 🔒 Security Features

- **Session Management**: Secure user sessions
- **Password Protection**: Basic authentication system
- **Role-based Access**: Different permissions for admin and users
- **Input Validation**: Form validation and sanitization

---

## 📊 Data Export

The system provides CSV export functionality:
- **Sensor Data**: Download historical sensor readings
- **Format**: CSV with timestamp, moisture, temperature, pH, and weather
- **Usage**: Click "Export CSV" in the navigation bar

---

## 🎯 Future Enhancements

- **Real IoT Integration**: Connect actual soil sensors
- **Mobile App**: Native mobile application
- **Machine Learning**: Predictive analytics for crop yield
- **Weather API**: Real weather data integration
- **Multi-language Support**: Regional language support
- **Advanced Analytics**: Detailed crop performance metrics

---

## 🤝 Contributing

Contributions are always welcome! If you spot a bug, have an idea for improvement, or want to add a new feature, feel free to open an issue or submit a pull request. Suggestions for documentation updates, translations, or performance enhancements are also appreciated. Every contribution, big or small, helps improve the project for everyone.

---

**Built with ❤️ for Smart Agriculture**




