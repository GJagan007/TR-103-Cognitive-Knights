import os
import shutil
import random

base_dir = r"d:\Tensor hackathon\pseudo_dataset"
images_dir = os.path.join(base_dir, "images")
labels_dir = os.path.join(base_dir, "labels")

# Create train/val structure
for folder in ["train", "val"]:
    os.makedirs(os.path.join(images_dir, folder), exist_ok=True)
    os.makedirs(os.path.join(labels_dir, folder), exist_ok=True)

# List all original files in images root
all_images = [f for f in os.listdir(images_dir) if f.endswith(('.tif', '.tiff', '.png', '.jpg'))]

# Distribute them if found
if all_images:
    print(f"Found {len(all_images)} images, splitting into train and val...")
    random.shuffle(all_images)
    
    # Take exactly 15 images for validation as recommended
    val_count = min(15, len(all_images) // 2)
    val_images = all_images[:val_count]
    train_images = all_images[val_count:]

    def move_pair(img_name, split):
        src_img = os.path.join(images_dir, img_name)
        dst_img = os.path.join(images_dir, split, img_name)
        if os.path.exists(src_img):
            shutil.move(src_img, dst_img)
        
        # Label matching exact image name
        lbl_name = img_name.rsplit('.', 1)[0] + '.txt'
        src_lbl = os.path.join(labels_dir, lbl_name)
        dst_lbl = os.path.join(labels_dir, split, lbl_name)
        if os.path.exists(src_lbl):
            shutil.move(src_lbl, dst_lbl)

    for img in val_images:
        move_pair(img, "val")
    for img in train_images:
        move_pair(img, "train")
        
    print(f"Moved {len(train_images)} files to train/, {len(val_images)} files to val/. Dataset successfully structured!")
else:
    print("Dataset already structured or images missing.")
