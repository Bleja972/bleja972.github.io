from pathlib import Path
from urllib.parse import quote
from PIL import Image
import subprocess
import re

root = Path(__file__).resolve().parents[1]
folder = root / "assets/catalogue-v2/captures"
old = folder / "Capture d'écran 2026-11-21 142814.png"
new = folder / "mission-fractions-ce1.webp"
with Image.open(old) as im:
    im = im.convert("RGB")
    im.save(new, format="WEBP", quality=92, method=6)
    size = im.size
with Image.open(new) as im:
    im.load()
    assert im.format == "WEBP" and im.size == size
old_name = old.name
encoded = quote(old_name)
# Match existing URL encodings, including HTML-escaped apostrophes.
variants = {old_name, encoded, encoded.replace("%27", "'"),
            encoded.replace("%27", "&#x27;"), encoded.replace("%27", "&amp;#x27;"),
            encoded.replace("%27", "&#39;"), encoded.replace("%27", "&apos;")}
files = subprocess.check_output(["git","ls-files","-z"],cwd=root).decode().split("\0")
count = 0
for name in files:
    if not name or Path(name).suffix.lower() not in {".html",".json",".xml",".js",".css"}:
        continue
    path = root / name
    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeError:
        continue
    updated = text
    for v in sorted(variants,key=len,reverse=True):
        updated = updated.replace(v,new.name)
    if updated != text:
        path.write_text(updated,encoding="utf-8")
        count += 1
print(f"PNG: {old.stat().st_size} bytes; WebP: {new.stat().st_size} bytes; {count} files updated.")
# Preserve original PNG for backward compatibility.
