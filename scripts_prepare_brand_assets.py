from pathlib import Path
from PIL import Image

ROOT = Path('/home/ubuntu/BolsonierStore')
UPLOAD = Path('/home/ubuntu/upload')
OUT = ROOT / 'client' / 'public' / 'brand'
OUT.mkdir(parents=True, exist_ok=True)

ASSET_LOGO = UPLOAD / 'ChatGPTImage9dejun.de2026,06_42_20(1).png'
ASSET_MONOGRAM = UPLOAD / 'ChatGPTImage9dejun.de2026,06_42_20(2).png'
ASSET_STAMP = UPLOAD / 'ChatGPTImage9dejun.de2026,06_42_20(3).png'


def crop_resize(src: Path, box: tuple[int, int, int, int], dest: Path, width: int | None = None, transparent_white: bool = False) -> None:
    img = Image.open(src).convert('RGBA')
    crop = img.crop(box)
    if width is not None:
        ratio = width / crop.width
        crop = crop.resize((width, round(crop.height * ratio)), Image.Resampling.LANCZOS)
    if transparent_white:
        px = crop.getdata()
        new = []
        for r, g, b, a in px:
            if r > 242 and g > 242 and b > 242:
                new.append((255, 255, 255, 0))
            else:
                new.append((r, g, b, a))
        crop.putdata(new)
    crop.save(dest, optimize=True)

# Recortes estimados para remover pranchas/documentação e preservar somente elementos úteis.
crop_resize(ASSET_LOGO, (285, 175, 1395, 835), OUT / 'bolsonier-logo-wide.png', width=1400, transparent_white=True)
crop_resize(ASSET_LOGO, (300, 185, 1375, 700), OUT / 'bolsonier-logo-compact.png', width=1100, transparent_white=True)
crop_resize(ASSET_MONOGRAM, (150, 325, 810, 1330), OUT / 'bolsonier-monogram-b.png', width=900, transparent_white=True)
crop_resize(ASSET_STAMP, (135, 355, 805, 1110), OUT / 'pix-stamp.png', width=850, transparent_white=True)

for path in [
    OUT / 'bolsonier-logo-wide.png',
    OUT / 'bolsonier-logo-compact.png',
    OUT / 'bolsonier-monogram-b.png',
    OUT / 'pix-stamp.png',
]:
    im = Image.open(path)
    print(path.relative_to(ROOT), im.size)
