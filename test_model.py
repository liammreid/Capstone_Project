from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from tensorflow.keras.models import load_model
import requests
import json
import schedule
import time
from tensorflow.keras.layers import Input, Dense, Dropout, BatchNormalization, Activation, add
from tensorflow.keras.models import Model
from sklearn.model_selection import train_test_split



# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load the trained model (Make sure to provide the correct path)
model = load_model('/Users/liamreid/Desktop/SPRING_2024_Classes/DATA_6900/best_model_complex.keras')

# Function to get the forecast gridpoint URL
def get_forecast_gridpoint(latitude, longitude):
    url = f"https://api.weather.gov/points/{latitude},{longitude}"
    response = requests.get(url)
    if response.status_code == 200:
        grid_data = response.json()
        forecast_url = grid_data["properties"]["forecast"]
        return forecast_url
    else:
        print("Error fetching forecast data", response.status_code)
        return None

# Function to get and save the 7-day weather forecast data to a JSON file
def get_and_save_weather_forecast(forecast_url, json_file_path):
    response = requests.get(forecast_url)
    if response.status_code == 200:
        forecast_data = response.json()
        with open(json_file_path, 'w') as json_file:
            json.dump(forecast_data, json_file, indent=4)
        print(f"Weather forecast saved to {json_file_path}")
    else:
        print("Error fetching the weather forecast:", response.status_code)

# Process weather forecast function
def process_weather_forecast(json_data):
    processed_data = []

    for i in range(0, len(json_data['properties']['periods']), 2):
        day_forecast = json_data['properties']['periods'][i]
        night_forecast = json_data['properties']['periods'][i + 1] if i + 1 < len(json_data['properties']['periods']) else day_forecast

        # Extracting temperatures
        max_temp = day_forecast['temperature']
        min_temp = night_forecast['temperature']

        # Processing wind speeds
        avg_wind_speed = calculate_average_wind_speed(day_forecast['windSpeed'], night_forecast['windSpeed'])

        # Checking for haze and thunderstorms
        haze = 1 if "blowing dust" in day_forecast['detailedForecast'].lower() else 0
        thunderstorm = 1 if "precipitation" in day_forecast['detailedForecast'].lower() or "chance" in day_forecast['detailedForecast'].lower() else 0

        processed_data.append({
            'date': day_forecast['startTime'].split('T')[0],
            'max_temp': max_temp,
            'min_temp': min_temp,
            'avg_wind_speed': avg_wind_speed,
            'haze': haze,
            'thunderstorm': thunderstorm
        })

    return processed_data

def calculate_average_wind_speed(day_wind, night_wind):
    day_wind_speed = extract_wind_speed(day_wind)
    night_wind_speed = extract_wind_speed(night_wind)
    return (day_wind_speed + night_wind_speed) / 2

def extract_wind_speed(wind_speed_str):
    speeds = [int(s) for s in wind_speed_str.split() if s.isdigit()]
    return sum(speeds) / len(speeds) if speeds else 0

# Example usage
with open('lake_powell_weather_forecast.json', 'r') as file:
    json_data = json.load(file)

processed_forecast = process_weather_forecast(json_data)
print(json.dumps(processed_forecast, indent=4))

# Predict endpoint
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    processed_data = process_weather_forecast(data)
    predictions = model.predict(processed_data)
    return jsonify(predictions.tolist())

# Daily weather fetch and predict function
def daily_weather_fetch_and_predict():
    latitude = 36.9147
    longitude = -111.4558
    forecast_url = get_forecast_gridpoint(latitude, longitude)
    if forecast_url:
        json_file_path = 'lake_powell_weather_forecast.json'
        get_and_save_weather_forecast(forecast_url, json_file_path)
        with open(json_file_path, 'r') as file:
            json_data = json.load(file)
        processed_forecast = process_weather_forecast(json_data)
        predictions = model.predict(processed_forecast)
        # Additional logic to save or process predictions

# Schedule the daily task
schedule.every().day.at("08:00").do(daily_weather_fetch_and_predict)

# Scheduler function
def run_scheduler():
    while True:
        schedule.run_pending()
        time.sleep(60)


