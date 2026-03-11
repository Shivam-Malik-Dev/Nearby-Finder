# Nearby Finder - Location Based Place Recommendation System

Nearby Finder is a full-stack web application that helps users discover nearby places such as hospitals, restaurants, ATMs, and other services based on their current location.

The project uses geolocation APIs to fetch nearby places and displays them in a user-friendly interface.

## Tech Stack

### Backend
- FastAPI
- Python
- REST APIs
- Geolocation APIs

### Frontend
- React.js
- HTML
- CSS
- JavaScript

## Features

- Search nearby places
- Fetch location based data using APIs
- Display results dynamically
- Clean UI for better user experience
- Fast API based backend

## Project Structure

Nearby-Finder
│
├── backend
│ ├── app
│ └── requirements.txt
│
├── frontend
│ ├── src
│ ├── public
│ ├── package.json
│
└── README.md

## Installation

### Backend Setup


cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload


### Frontend Setup


cd frontend
npm install
npm start


## Future Improvements

- Add map visualization
- User authentication
- Save favorite locations
- Better UI and filtering

## Author

Shivam Malik
