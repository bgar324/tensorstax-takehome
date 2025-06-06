# Real-Time WebSocket Dashboard 🚀

[![Next.js](https://img.shields.io/badge/Next.js-13%2B-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

A real-time dashboard application showcasing WebSocket integration between a Next.js frontend and FastAPI backend.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 13+
- **Language**: TypeScript
- **Styling**: Tailwind CSS

### Backend
- **Framework**: FastAPI
- **Protocol**: WebSockets
- **Server**: Uvicorn

## 📦 Dependencies

### Backend Setup
```bash
pip install fastapi uvicorn python-multipart pytz
```

### Frontend Setup
```bash
# Using npm
npm install

# Or using yarn
yarn install
```

## 🏗️ Project Structure

```
backend/
└── main.py           # WebSocket server using FastAPI

frontend/
└── src/
    ├── lib/
    │   └── useWebSocket.ts    # Custom WebSocket hook
    └── app/
        └── page.tsx          # Main UI components
```

## 🚀 Getting Started

### Backend
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
source venv/Scripts/activate

# Mac/Linux
source venv/bin/activate

# Start the server
uvicorn main:app --reload
```

### Frontend
```bash
# Navigate to frontend directory
cd frontend

# Start development server
npm run dev
# or
yarn dev
```

## 💪 Resilience Features

The application includes several reliability features:

- **🛡️ Guardrails**: Cooldown mechanism prevents rapid WebSocket toggles
- **🧹 Clean Cleanup**: Safe WebSocket connection closure and reinitialization
- **📝 Error Logging**: Comprehensive logging for debugging and monitoring

> **Development Philosophy**: Break it on purpose, then make it bulletproof.