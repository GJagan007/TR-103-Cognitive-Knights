from ultralytics import YOLO

print("Starting training...")

# Load model
model = YOLO("yolov8n.pt")

# Train model
model.train(
    data="data.yaml",
    epochs=15,
    imgsz=640
)