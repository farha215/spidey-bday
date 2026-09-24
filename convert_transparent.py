from PIL import Image
import sys

img = Image.open('public/assets/spider-drop.png').convert("RGBA")
datas = img.getdata()

new_data = []
for item in datas:
    # change all white (also shades of whites)
    if item[0] > 200 and item[1] > 200 and item[2] > 200:
        new_data.append((255, 255, 255, 0))
    else:
        new_data.append(item)

img.putdata(new_data)
img.save('public/assets/spider-drop-transparent.png', "PNG")
