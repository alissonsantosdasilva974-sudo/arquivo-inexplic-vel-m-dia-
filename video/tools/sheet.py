import sys, os
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 4
files = sorted(f for f in os.listdir(d) if f.endswith('.png'))
tw, th = 480, 270
rows = (len(files) + cols - 1) // cols
sheet = Image.new('RGB', (cols * tw, rows * (th + 22)), (20, 18, 24))
dr = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(os.path.join(d, f)).convert('RGB').resize((tw, th), Image.LANCZOS)
    x, y = (i % cols) * tw, (i // cols) * (th + 22)
    sheet.paste(im, (x, y + 22))
    fr = int(f[1:6]); dr.text((x + 6, y + 4), f"{f[1:6]}  t={fr/30:.2f}s", fill=(230, 220, 200))
sheet.save(out, quality=88)
print(out, sheet.size)
