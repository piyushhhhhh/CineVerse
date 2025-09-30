# CineVerse Backend API

This project provides the backend API for the CineVerse, built with FastAPI.

## How to run?

# Step 1: Create a virtual environment.
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```
# Step 2: Install the necessary dependencies.
    ```bash
    pip install -r requirements.txt
    ```

In case of error, run
```bash
    pip install --upgrade pip setuptools wheel
    pip install -r requirements.txt
```
# Step 3: Download required dateset to preload and train model
    1. movies_metadata.csv -> https://drive.google.com/file/d/19Y2-sm9r7A7Fbc9r73DQn__RNJnN6Fd6/view?usp=drive_link
    2. ratings.csv -> https://drive.google.com/file/d/1_MIC5Mni57JmapFjA19Jy8xsu6fYIn24/view?usp=drive_link
    Save above file to **CineVerse-Backend/data/**
# Step 4: Start the development server with auto-reloading.
    ```bash
    uvicorn app.main:app --reload --port 5000
    ```

Now you can access the API at `http://localhost:5000/api`, & you can check all API at `http://localhost:5000/docs`