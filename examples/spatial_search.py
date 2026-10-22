"""Spatial-search teaching examples for DSA Concepts Topic 12.

Run: python spatial_search.py
Python standard library only; original point/PR/R-tree examples, with existing
k-d-tree insert/range definitions reused from the book. The R-tree is a given
small tree, not a general insertion or bulk-loading implementation.
"""

class KDNode:
    def __init__(self, point):
        self.point = point
        self.left = None
        self.right = None

def kd_insert(node, point, depth=0):
    if node is None:
        return KDNode(point)
    if point == node.point:
        return node
    axis = depth % 2
    if point[axis] < node.point[axis]:
        node.left = kd_insert(node.left, point, depth + 1)
    else:
        node.right = kd_insert(node.right, point, depth + 1)
    return node

def kd_range(root, low, high):
    if any(low[i] > high[i] for i in range(2)):
        raise ValueError("lower bounds must not exceed upper bounds")
    out = []

    def visit(node, depth):
        if node is None:
            return
        p = node.point
        if all(low[i] <= p[i] <= high[i] for i in range(2)):
            out.append(p)
        axis = depth % 2
        if low[axis] < p[axis]:
            visit(node.left, depth + 1)
        if high[axis] >= p[axis]:
            visit(node.right, depth + 1)

    visit(root, 0)
    return out

from math import isfinite

shared_points = [(5, 4), (2, 7), (8, 1), (1, 3),
                 (3, 6), (7, 5), (9, 2)]
shared_query = (1, 2, 4, 7)

def checked_rect(rect):
    if len(rect) != 4 or not all(isfinite(v) for v in rect):
        raise ValueError("rectangle needs four finite numeric coordinates")
    xmin, ymin, xmax, ymax = rect
    if xmin > xmax or ymin > ymax:
        raise ValueError("rectangle bounds are reversed")
    return tuple(rect)

def in_closed_rect(point, rect):
    x, y = point
    xmin, ymin, xmax, ymax = rect
    return xmin <= x <= xmax and ymin <= y <= ymax

def scan_range(points, rect):
    rect = checked_rect(rect)
    return [p for p in points if in_closed_rect(p, rect)]

def point_quadrant(point, pivot):
    return int(point[0] >= pivot[0]) + 2 * int(point[1] >= pivot[1])

class PointQuadNode:
    def __init__(self, point):
        self.point = point
        self.children = [None] * 4

def point_quad_insert(root, point):
    if root is None:
        return PointQuadNode(point)
    node = root
    while True:
        if point == node.point:
            return root
        quadrant = point_quadrant(point, node.point)
        child = node.children[quadrant]
        if child is None:
            node.children[quadrant] = PointQuadNode(point)
            return root
        node = child

def point_quad_contains(root, point):
    node = root
    while node is not None:
        if point == node.point:
            return True
        node = node.children[point_quadrant(point, node.point)]
    return False

point_root = None
for point in shared_points:
    point_root = point_quad_insert(point_root, point)

def point_quad_range(root, rect):
    rect = checked_rect(rect)
    xmin, ymin, xmax, ymax = rect
    out, stack = [], []
    if root is not None:
        stack.append(root)
    while stack:
        node = stack.pop()
        x, y = node.point
        if in_closed_rect(node.point, rect):
            out.append(node.point)
        west, east = xmin < x, xmax >= x
        south, north = ymin < y, ymax >= y
        possible = (west and south, east and south,
                    west and north, east and north)
        for i in range(3, -1, -1):
            if possible[i] and node.children[i] is not None:
                stack.append(node.children[i])
    return out

def in_half_open_cell(point, cell):
    x, y = point
    xmin, ymin, xmax, ymax = cell
    return xmin <= x < xmax and ymin <= y < ymax

def cell_query_overlap(cell, query):
    xmin, ymin, xmax, ymax = cell
    qxmin, qymin, qxmax, qymax = query
    return (qxmax >= xmin and qxmin < xmax
            and qymax >= ymin and qymin < ymax)

def midpoint_cells(cell):
    xmin, ymin, xmax, ymax = cell
    mx, my = xmin / 2 + xmax / 2, ymin / 2 + ymax / 2
    if not (xmin < mx < xmax and ymin < my < ymax):
        return None
    return ((xmin, ymin, mx, my), (mx, ymin, xmax, my),
            (xmin, my, mx, ymax), (mx, my, xmax, ymax))

class PRNode:
    def __init__(self, bounds):
        self.bounds = bounds
        self.points = []
        self.children = None

class PRQuadTree:
    def __init__(self, bounds, capacity=1, max_depth=16):
        bounds = checked_rect(bounds)
        if bounds[0] == bounds[2] or bounds[1] == bounds[3]:
            raise ValueError("root extent must have positive width and height")
        if type(capacity) is not int or capacity < 1:
            raise ValueError("capacity must be a positive integer")
        if type(max_depth) is not int or max_depth < 0:
            raise ValueError("max_depth must be a nonnegative integer")
        self.root = PRNode(bounds)
        self.capacity = capacity
        self.max_depth = max_depth
        self.members = set()

    def insert(self, point):
        if not in_half_open_cell(point, self.root.bounds):
            raise ValueError("point lies outside the configured extent")
        if point in self.members:
            return False
        pending = [(self.root, point, 0)]
        while pending:
            node, p, depth = pending.pop()
            if node.children is not None:
                cells = node.children
                pivot = (cells[0].bounds[2], cells[0].bounds[3])
                index = point_quadrant(p, pivot)
                pending.append((cells[index], p, depth + 1))
                continue
            subdivisions = midpoint_cells(node.bounds)
            if (len(node.points) < self.capacity
                    or depth >= self.max_depth or subdivisions is None):
                node.points.append(p)
                continue
            records = node.points + [p]
            node.points = []
            node.children = [PRNode(cell) for cell in subdivisions]
            pivot = (subdivisions[0][2], subdivisions[0][3])
            for old in records:
                index = point_quadrant(old, pivot)
                pending.append((node.children[index], old, depth + 1))
        self.members.add(point)
        return True

    def contains(self, point):
        if not in_half_open_cell(point, self.root.bounds):
            return False
        node = self.root
        while node.children is not None:
            pivot = (node.children[0].bounds[2], node.children[0].bounds[3])
            node = node.children[point_quadrant(point, pivot)]
        return point in node.points

    def range_query(self, rect):
        rect = checked_rect(rect)
        out, stack = [], [self.root]
        while stack:
            node = stack.pop()
            if not cell_query_overlap(node.bounds, rect):
                continue
            if node.children is None:
                out.extend(p for p in node.points if in_closed_rect(p, rect))
            else:
                stack.extend(reversed(node.children))
        return out

pr_tree = PRQuadTree((0, 0, 12, 12), capacity=1)
for point in shared_points:
    pr_tree.insert(point)

segments = {
    "L1": ((0, 0), (10, 10)),
    "L2": ((0, 7), (6, 7)),
    "L3": ((8, 0), (10, 2)),
    "L4": ((3, 5), (3, 9)),
    "L5": ((5, 6), (9, 8)),
}
line_query = (2, 6, 4, 8)

def segment_bounds(segment):
    a, b = segment
    return (min(a[0], b[0]), min(a[1], b[1]),
            max(a[0], b[0]), max(a[1], b[1]))

def enclosing_bounds(boxes):
    boxes = list(boxes)  # requires a nonempty collection
    return (min(b[0] for b in boxes), min(b[1] for b in boxes),
            max(b[2] for b in boxes), max(b[3] for b in boxes))

class RNode:
    def __init__(self, entries, leaf):
        self.entries = list(entries)  # (enclosing_box, child_or_id)
        self.leaf = leaf

line_boxes = {key: segment_bounds(value) for key, value in segments.items()}
group_u = RNode([(line_boxes[key], key) for key in ["L1", "L2"]], True)
group_v = RNode([(line_boxes[key], key) for key in ["L3", "L4", "L5"]], True)
r_root = RNode([
    (enclosing_bounds(box for box, _ in group_u.entries), group_u),
    (enclosing_bounds(box for box, _ in group_v.entries), group_v),
], False)

def closed_boxes_overlap(a, b):
    return (a[0] <= b[2] and b[0] <= a[2]
            and a[1] <= b[3] and b[1] <= a[3])

def rtree_candidates(root, rect):
    rect = checked_rect(rect)
    out, stack = [], [root]
    while stack:
        node = stack.pop()
        for box, item in node.entries:
            if not closed_boxes_overlap(box, rect):
                continue
            if node.leaf:
                out.append(item)
            else:
                stack.append(item)
    return out

def orientation(a, b, c):
    return ((b[0] - a[0]) * (c[1] - a[1])
            - (b[1] - a[1]) * (c[0] - a[0]))

def on_segment(a, b, p):
    return orientation(a, b, p) == 0 and in_closed_rect(
        p, segment_bounds((a, b)))

def segments_intersect(a, b, c, d):
    ab_c, ab_d = orientation(a, b, c), orientation(a, b, d)
    cd_a, cd_b = orientation(c, d, a), orientation(c, d, b)
    if (((ab_c < 0 < ab_d) or (ab_d < 0 < ab_c))
            and ((cd_a < 0 < cd_b) or (cd_b < 0 < cd_a))):
        return True
    return ((ab_c == 0 and on_segment(a, b, c))
            or (ab_d == 0 and on_segment(a, b, d))
            or (cd_a == 0 and on_segment(c, d, a))
            or (cd_b == 0 and on_segment(c, d, b)))

def segment_intersects_rect(segment, rect):
    rect = checked_rect(rect)
    a, b = segment
    if in_closed_rect(a, rect) or in_closed_rect(b, rect):
        return True
    xmin, ymin, xmax, ymax = rect
    corners = [(xmin, ymin), (xmax, ymin),
               (xmax, ymax), (xmin, ymax)]
    return any(segments_intersect(a, b, corners[i], corners[(i + 1) % 4])
               for i in range(4))

candidates = rtree_candidates(r_root, line_query)
line_matches = [key for key in candidates
                if segment_intersects_rect(segments[key], line_query)]

if __name__ == "__main__":
    kd_root = None
    for p in shared_points:
        kd_root = kd_insert(kd_root, p)
    print("Reference scan:", scan_range(shared_points, shared_query))
    print("K-d tree:", kd_range(kd_root, shared_query[:2], shared_query[2:]))
    print("Point quadtree:", point_quad_range(point_root, shared_query))
    print("PR quadtree:", pr_tree.range_query(shared_query))
    print("Line box candidates:", candidates)
    print("Exact line matches:", line_matches)
