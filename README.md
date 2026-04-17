=====================================
   🌊 OCEANIC FLEET DISPATCH AI — Marine Pollution Detection System
   Version: 2.5 (High-Reliability Multi-Scan Batch Edition)
   Team Name: Cognitive Knights
   Event: Tensor Hackathon 2026
=====================================


  PROJECT OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  An enterprise-grade satellite imagery analysis system that detects and 
  classifies marine debris (plastic, foam, oil sheen, seaweed) in real-time.
  The system supports parallel batch-processing of multiple satellite feeds,
  providing a centralized "Master Fleet Dispatch Hub" for global environmental
  monitoring and cleanup coordination.

🌐 Live Deployment: https://marine-debris-detection-1.vercel.app/

  "We store processed results in MongoDB Atlas and Cloudinary for scalable
   data persistence and advanced geospatial fleet analytics."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  KEY FEATURES (V2.5)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🛰️  Multi-Slot Satellite Feeds:
      - Add/Remove scan targets dynamically via the "Plus" slot system.
      - Independent GPS coordinate overrides for each scanning sector.

  ⚡  Parallel Asynchronous Processing:
      - Scan 10+ images simultaneously using JS Promise.all logic.
      - Shared Batch ID linking for comprehensive fleet-wide synchronization.

  🏆  Master Fleet Dispatch Ranking:
      - Automatic global ranking of all scan targets by threat severity.
      - Rank #1 priority assignment for CRITICAL environments.
      - Integrated "Fleet Deployment Table" with real-time GPS coordinates.

  📦  Unified Cloud Storage:
      - Cloudinary: Automatic folder-based organization by Batch ID.
      - MongoDB: Permanent metadata linkage for historical fleet tracking.

  📋  Sector-Wide GeoJSON Export:
      - One-click "Integrated Fleet GeoJSON" download for the entire batch.
      - Compatible with standard GIS tools for cleanup vessel guidance.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TECH STACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  AI / Detection:
    - YOLOv8n (Ultralytics) — Custom-tuned for marine targets.
    - OpenCV — High-precision bounding box rendering (Marine Taxonomy).
    - Robust Form Parsing — Prevents API 422 errors via permissive type-validation.

  Backend:
    - FastAPI — High-performance ASGI interface (Port 8008).
    - Uvicorn — Enterprise-ready orchestration.
    - Python 3.11

  Cloud Data Infrastructure:
    - Cloudinary — Folder-based CDN image hosting.
    - MongoDB Atlas — NoSQL data persistence with UTC timestamps.

  Frontend (Cinematic UI):
    - Glassmorphism Dashboard — Premium transparent workspace.
    - TailwindCSS + Vanilla JS — Responsive, high-performance interface.
    - Parallel Fetch Logic — Distributed request handling.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PROJECT STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Tensor hackathon/
  ├── main.py              ← FastAPI backend (core API server)
  ├── index.html           ← High-end Multi-Scan Frontend (primary entry)
  ├── ocean_app.py         ← Unified Streamlit Application
  ├── ocean.mp4            ← Cinematic background video
  ├── yolov8n.pt           ← YOLOv8 base model weights
  ├── static/              ← Local generated results cache (heatmaps/GeoJSON)
  ├── dataset/             ← Training data (Plastic, Debris classes)
  └── README.txt           ← System documentation (This file)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  INSTALLATION & QUICK-START
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. Install Core Dependencies:
     pip install fastapi uvicorn python-multipart opencv-python ultralytics
     pip install folium Pillow numpy pymongo cloudinary streamlit

  2. Ignite the Fleet API Server:
     python main.py
     → [INFO] API operational on http://127.0.0.1:8008

  3. Launch the Dispatch Dashboard:
     Open 'index.html' directly in your browser or use the Streamlit app:
     streamlit run ocean_app.py

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  OPERATIONAL GUIDELINES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. Click "+ Add Another Satellite Feed Slot" for batch analysis.
  2. Select satellite imagery and assign unique Latitude/Longitude.
  3. Click "Execute Multi-Sector Aerial Scan".
  4. View the "Master Fleet Dispatch Ranking" at the top to identify the 
     highest priority sectors (Rank #1 = CRITICAL).
  5. Use "Download Integrated Fleet GeoJSON" to export all coordinates for 
     fleet-wide deployment.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CONTACT & SUPPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Lead Developer : Diyanezwaran K
  Organization   : Cognitive Knights
  Project        : Marine AI Debris Scanner

=====================================
