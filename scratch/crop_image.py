import sys
try:
    from PIL import Image
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image
import os

img_path = os.path.join('public', 'images', 'kimcuong2.png')

if not os.path.exists(img_path):
    print("Image not found:", img_path)
    sys.exit(1)

# Open image
img = Image.open(img_path).convert("RGBA")

# Get bounding box of non-transparent pixels
bbox = img.getbbox()

if bbox:
    # Crop the image to the bounding box
    img_cropped = img.crop(bbox)
    
    # Optional: make it a perfect square
    width, height = img_cropped.size
    max_dim = max(width, height)
    
    # Create a new square image with transparent background
    square_img = Image.new('RGBA', (max_dim, max_dim), (0, 0, 0, 0))
    
    # Paste the cropped image in the center
    offset_x = (max_dim - width) // 2
    offset_y = (max_dim - height) // 2
    square_img.paste(img_cropped, (offset_x, offset_y))
    
    # Save it back
    square_img.save(img_path)
    print("Cropped and squared successfully!")
else:
    print("Image is completely transparent or empty.")
