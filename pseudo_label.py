from ultralytics import YOLO
import os

model = YOLO("yolov8n.pt")

image_folder = "pseudo_dataset/images"   # or "patches"
label_folder = "pseudo_dataset/labels"

os.makedirs(label_folder, exist_ok=True)

print("Checking images in folder:", image_folder)

files = os.listdir(image_folder)
print("Found files:", files[:10])  # show first 10 only

for img in files:
    if img.lower().endswith((".jpg", ".png", ".tif", ".tiff")):
        print("Processing:", img)

        img_path = os.path.join(image_folder, img)
        results = model(img_path)

        label_path = os.path.join(label_folder, img.rsplit(".",1)[0] + ".txt")

        with open(label_path, "w") as f:
            for r in results:
                for box in r.boxes:
                    cls = int(box.cls)
                    conf = float(box.conf)

                    if conf > 0.4:
                        x, y, w, h = box.xywh[0]

                        img_w, img_h = r.orig_shape[1], r.orig_shape[0]

                        x /= img_w
                        y /= img_h
                        w /= img_w
                        h /= img_h

                        f.write(f"{cls} {x} {y} {w} {h}\n")

print("Pseudo labeling completed ✅")