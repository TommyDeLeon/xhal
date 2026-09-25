"""Build the lion mark as one filled SVG path on a 64-unit grid.

De Leon means "of the lion". The mark is a calm, watchful lion's head: a
broad face with a level brow, a wide nose and a split muzzle, inside a mane
of seven flat planes cut like a gem.

Run from the repository root (needs `pip install shapely`, a build-time tool
only; the site does not use it):

    python brand/build-mark.py

It writes brand/mark.path.txt. Copy that path into components/monogram.tsx,
then run `npm run icons` to regenerate every brand export and site icon.
"""

from pathlib import Path

from shapely.geometry import LineString, Polygon
from shapely.ops import unary_union

GAP = 2.3  # width of the cuts between planes, and around the face
MITRE = {"join_style": "mitre", "mitre_limit": 4}

# Mane: an irregular heptagon, wider at the cheeks, flat under the chin.
OUTER = [(32, 2), (55, 12.5), (62, 35), (47, 59), (17, 59), (2, 35), (9, 12.5)]
# The face opening the planes meet; each outer corner maps to a point on it.
FACE = [(19, 19), (45, 19), (50, 32), (41, 52), (23, 52), (14, 32)]
SPOKES = {
    (32, 2): (32, 19),
    (55, 12.5): (45, 19),
    (62, 35): (50, 32),
    (47, 59): (41, 52),
    (17, 59): (23, 52),
    (2, 35): (14, 32),
    (9, 12.5): (19, 19),
}
# Face points in the same clockwise order as OUTER, for slicing facets.
FACE_RING = [(32, 19), (45, 19), (50, 32), (41, 52), (23, 52), (14, 32), (19, 19)]


def face_between(a, b):
    """Face-outline points from spoke end a to spoke end b, clockwise."""
    i, j = FACE_RING.index(a), FACE_RING.index(b)
    if j < i:
        j += len(FACE_RING)
    return [FACE_RING[k % len(FACE_RING)] for k in range(i, j + 1)]


planes = []
for k, start in enumerate(OUTER):
    end = OUTER[(k + 1) % len(OUTER)]
    inner = face_between(SPOKES[start], SPOKES[end])
    plane = Polygon([start, end, *reversed(inner)])
    planes.append(plane.buffer(-GAP / 2, **MITRE))
mane = unary_union(planes)

face = Polygon(FACE).buffer(-2.2, **MITRE)
eyes = unary_union([
    LineString([(22.8, 29.6), (28.6, 29.6)]).buffer(1.35, cap_style="round"),
    LineString([(35.4, 29.6), (41.2, 29.6)]).buffer(1.35, cap_style="round"),
])
nose = Polygon([(27, 35.6), (37, 35.6), (34.2, 40.4), (29.8, 40.4)])
muzzle = unary_union([
    LineString([(32, 40), (32, 43.6), (28.6, 46.4)]).buffer(1.1, cap_style="round", join_style="round"),
    LineString([(32, 43.6), (35.4, 46.4)]).buffer(1.1, cap_style="round"),
])
face = face.difference(unary_union([eyes, nose, muzzle]))

mark = unary_union([mane, face])


def ring(coords):
    points = list(coords)[:-1]
    head, *rest = points
    return f"M{head[0]:.2f} {head[1]:.2f}" + "".join(f"L{x:.2f} {y:.2f}" for x, y in rest) + "Z"


def polygon_path(poly):
    return ring(poly.exterior.coords) + "".join(ring(hole.coords) for hole in poly.interiors)


parts = list(mark.geoms) if hasattr(mark, "geoms") else [mark]
path = "".join(polygon_path(p.simplify(0.02)) for p in parts)
Path("brand/mark.path.txt").write_text(path + "\n")
print(f"{len(parts)} shapes, {len(path)} characters -> brand/mark.path.txt")
