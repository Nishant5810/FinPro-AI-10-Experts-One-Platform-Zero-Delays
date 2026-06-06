# Setup Guide

## Prerequisites

- Python 3.10+
- Node.js 16+ (for frontend development)
- Git

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/finpro-ai.git
cd finpro-ai
```

### 2. Backend Setup

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Create .env file
cp .env.example backend/.env
# Edit backend/.env and add your OPENROUTER_API_KEY
```

### 3. Frontend Setup

The frontend is vanilla JavaScript and doesn't require npm installation. Simply open `frontend/index.html` in a browser or serve with a local server:

```bash
# Using Python
cd frontend
python -m http.server 3000

# Using Node.js http-server
npx http-server -p 3000
```

### 4. Start the Backend

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## Running with Docker

```bash
# Build and start services
docker-compose up --build

# Backend: http://localhost:8000
# Frontend: http://localhost:3000
```

## Testing

```bash
# Test OpenRouter API connection
python backend/test_openrouter.py

# Run pytest (after installing requirements-dev.txt)
pytest backend/
```

## Deployment

For production deployment, refer to the `project_overview.md` for detailed deployment instructions.
