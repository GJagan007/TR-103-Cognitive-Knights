import rasterio
import numpy as np
from PIL import Image
import os
import shutil

base_input = "pseudo_dataset/images"
base_output = "converted_dataset/images"
base_labels = "pseudo_dataset/labels"
output_labels = "converted_dataset/labels"

for split in ["train", "val"]:
    input_folder = os.path.join(base_input, split)
    output_folder = os.path.join(base_output, split)
    lbl_in = os.path.join(base_labels, split)
    lbl_out = os.path.join(output_labels, split)

    os.makedirs(output_folder, exist_ok=True)
    os.makedirs(lbl_out, exist_ok=True)

    for file in os.listdir(input_folder):
        if file.endswith((".tif", ".tiff")):
            path = os.path.join(input_folder, file)

            try:
                with rasterio.open(path) as src:
                    img = src.read()

                    # take first 3 bands (RGB)
                    if len(img.shape) == 3 and img.shape[0] >= 3:
                        img = img[:3]
                    else:
                        continue

                    img = np.transpose(img, (1, 2, 0))

                    # normalize safely
                    if img.max() > img.min():
                        img = (img - img.min()) / (img.max() - img.min())
                    img = (img * 255).astype(np.uint8)

                    jpg_name = file.replace(".tif", ".jpg").replace(".tiff", ".jpg")
                    Image.fromarray(img).save(os.path.join(output_folder, jpg_name))
                    
                    # copy the label file synchronously
                    txt_name = file.replace(".tif", ".txt").replace(".tiff", ".txt")
                    txt_src = os.path.join(lbl_in, txt_name)
                    txt_dst = os.path.join(lbl_out, txt_name)
                    if os.path.exists(txt_src):
                        shutil.copy(txt_src, txt_dst)
            except Exception as e:
                print(f"Skipping corrupt tile {file}: {e}")

print("Dataset safely converted into standard JPGs! Conversion done ✅")
