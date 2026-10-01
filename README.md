# Spotter ELD: Hours of Service (HOS) Logbook Platform

An Electronic Logging Device (ELD) web platform designed to track commercial motor vehicle (CMV) driver duty statuses and enforce US Department of Transportation (DOT) and FMCSA compliance.

## Overview
Commercial truck drivers are strictly regulated by Title 49 CFR Part 395 to prevent fatigue-related accidents. This application provides a full-stack digital logbook that records duty status transitions, visualizes a driver's day on a standard 24-hour stepped grid, and mathematically validates compliance against federal safety limits.

## Core Features
* **Duty Status Tracking:** Records precise intervals for Off Duty (OFF), Sleeper Berth (SB), Driving (D), and On Duty (ON).
* **FMCSA Compliance Engine:** Automatically detects and flags violations for:
  * **11-Hour Driving Limit**
  * **14-Hour Shift Window**
  * **30-Minute Rest Break Requirement**
* **24-Hour Stepped Grid:** Dynamically renders the standardized DOT daily log chart using SVG.
* **Decoupled Architecture:** Clean separation of concerns using a Django REST Framework backend and a React frontend.

## Tech Stack
* **Backend:** Python, Django, Django REST Framework
* **Frontend:** React, Vite, Axios, TailwindCSS (or raw CSS)
* **Authentication:** JSON Web Tokens (SimpleJWT)
* **Database:** SQLite (Development) -> PostgreSQL (Production)

## Local Development Setup

This project uses a decoupled architecture. You will need two terminal windows to run the backend and frontend simultaneously.

### 1. Backend (Django) Setup
Navigate to the backend directory and set up the Python environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver