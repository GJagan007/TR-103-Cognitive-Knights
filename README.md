# 🌊 OCEANIC FLEET DISPATCH AI
**Marine Pollution Detection System | Version 2.5**  
**Team:** Cognitive Knights  

**Event:** Tensor Hackathon 2026  
**Status:** High-Reliability Multi-Scan Batch Edition
=====================================  

## 📖 PROJECT OVERVIEW

The Oceanic Fleet Dispatch AI is a professional-grade satellite imagery analysis platform designed to combat global marine pollution. Unlike standard single-image detectors, this system utilizes a "Master Fleet Dispatch Hub" architecture, allowing users to analyze multiple scanning sectors simultaneously.

By leveraging YOLOv8n and Parallel Asynchronous Processing, the system identifies plastics, foam, oil sheen, and seaweed in real-time, assigning a global threat priority rank to each sector to guide cleanup vessel deployment.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 🛰️ KEY FEATURES

- **Multi-Slot Satellite Feeds:** Dynamically add/remove scan targets. Each slot supports independent GPS coordinate overrides.
- **Parallel Inference Engine:** Uses JS Promise.all logic to hit the FastAPI backend simultaneously, reducing batch processing time by up to 70%.
- **Master Fleet Ranking:** Automatically ranks sectors based on debris density and toxicity. Rank #1 indicates the highest priority.
- **Unified Cloud Storage:**
  - Cloudinary: CDN-hosted imagery organized by Batch_ID
  - MongoDB Atlas: Persistent metadata storage for historical analysis
- **GIS Integration:** Export GeoJSON files for navigation systems.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 🛠️ TECH STACK

- **AI/Detection:** YOLOv8n (Ultralytics) + OpenCV  
- **Backend:** FastAPI (Python 3.11) + Uvicorn  
- **Frontend:** Vanilla JS + TailwindCSS  
- **Databases:** MongoDB Atlas + Cloudinary  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## ⚙️ INSTALLATION & AI SETUP

### 1. Clone & Environment Setup
```bash
git clone https://github.com/cognitive-knights/oceanic-fleet-ai.git
cd oceanic-fleet-ai
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install fastapi uvicorn python-multipart opencv-python ultralytics
pip install folium Pillow numpy pymongo cloudinary streamlit torch torchvision
```

### 3. AI Model Installation (Critical)
- Place `yolov8n.pt` in the root directory
- Supports CUDA if NVIDIA GPU is available
- Replace with custom `best.pt` if needed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 🚀 EXECUTION GUIDE

### Step 1: Start Backend
```bash
python main.py
# Runs on http://127.0.0.1:8008
```

### Step 2: Launch Frontend
- Open `index.html` in browser  
OR
```bash
streamlit run ocean_app.py
```

### Step 3: Workflow
- Add satellite feed slots  
- Upload images + coordinates  
- Run multi-sector scan  
- Analyze ranking  
- Export GeoJSON  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 📁 PROJECT STRUCTURE
```
Tensor Hackathon/
├── main.py
├── index.html
├── ocean_app.py
├── yolov8n.pt
├── ocean.mp4
├── static/
├── dataset/
└── README.txt
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 🛡️ CONTACT

**Lead Developer:** Diyanezwaran K  
**Organization:** Cognitive Knights  
**Project:** Marine AI Debris Scanner  
**Saving our oceans, one frame at a time 🌍**
