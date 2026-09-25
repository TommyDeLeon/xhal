"""Build the filled td mark from the bundled Source Serif 4 variable font.

Run from the repository root: python brand/build-monogram.py
The output is the SVG path data used by components/monogram.tsx.
"""

from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont


BRAND = Path(__file__).resolve().parent
FONT = BRAND / "fonts/source-serif-4-latin.woff2"
OUTPUT = BRAND / "monogram.path.txt"
WEIGHT = 600
OPTICAL_SIZE = 20  # The smaller optical master keeps the hairlines and serifs sturdier at 16px.
VIEW_SIZE = 64
MARGIN = 4
D_OFFSET = 285  # Font units: the t crossbar runs into the d's left bowl.
WIDTH_FACTOR = 0.85  # Fit both real letterforms without sacrificing vertical detail.


def main():
    font = instantiateVariableFont(
        TTFont(FONT), {"wght": WEIGHT, "opsz": OPTICAL_SIZE}, inplace=False
    )
    glyphs = font.getGlyphSet()
    names = [font.getBestCmap()[ord(letter)] for letter in "td"]
    offsets = [0, D_OFFSET]
    bounds = []
    for name, offset in zip(names, offsets):
        pen = BoundsPen(glyphs)
        glyphs[name].draw(pen)
        left, bottom, right, top = pen.bounds
        bounds.append((left + offset, bottom, right + offset, top))

    left = min(box[0] for box in bounds)
    bottom = min(box[1] for box in bounds)
    right = max(box[2] for box in bounds)
    top = max(box[3] for box in bounds)
    scale = (VIEW_SIZE - 2 * MARGIN) / (top - bottom)
    x_scale = scale * WIDTH_FACTOR
    drawn_width = (right - left) * x_scale
    if drawn_width > VIEW_SIZE - 2 * MARGIN:
        raise ValueError("Monogram exceeds the horizontal margin")
    x_start = (VIEW_SIZE - drawn_width) / 2
    y_start = MARGIN + top * scale

    # Both glyphs share one baseline. SVG's y axis runs down, opposite the font's.
    # SVGPathPen collects both outlines in one path; their original serif contours remain.
    pen = SVGPathPen(glyphs, ntos=lambda number: f"{number:.2f}".rstrip("0").rstrip("."))
    for name, offset in zip(names, offsets):
        transform = (x_scale, 0, 0, -scale, x_start - left * x_scale + offset * x_scale, y_start)
        glyphs[name].draw(TransformPen(pen, transform))
    OUTPUT.write_text(pen.getCommands() + "\n", encoding="utf-8")
    print(f"Wrote {OUTPUT.relative_to(BRAND.parent)} at wght={WEIGHT}, opsz={OPTICAL_SIZE}")


if __name__ == "__main__":
    main()
