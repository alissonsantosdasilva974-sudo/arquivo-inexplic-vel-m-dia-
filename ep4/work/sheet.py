# folha de prévias: python3 sheet.py saida.jpg f1.png f2.png ... (6 por linha)
import sys
from PIL import Image
out, fs = sys.argv[1], sys.argv[2:]
w, h = 270, 480; cols = 6; rows = (len(fs) + cols - 1) // cols
S = Image.new('RGB', (cols * w, rows * h), 'black')
for i, f in enumerate(fs): S.paste(Image.open(f).convert('RGB').resize((w, h)), ((i % cols) * w, (i // cols) * h))
S.save(out, quality=88)
