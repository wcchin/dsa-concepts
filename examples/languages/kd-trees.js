// Generated from the published Markdown; run scripts/build_language_examples.py to refresh.
// Independent examples may reuse top-level names. Python remains the explanation language.

// Small standard-library-only support for the translated teaching listings.
// Fixed-size linked nodes give O(1) deque endpoints; no array-front shifts.
class DequeBuffer {
    constructor(values = []) {
        this.head = null; this.tail = null; this.n = 0;
        for (const item of values) this.add_last(item);
    }
    size() { return this.n; }
    is_empty() { return this.n === 0; }
    add_first(item) {
        const node = {item, prev: null, next: this.head};
        if (this.head) this.head.prev = node; else this.tail = node;
        this.head = node; this.n++;
    }
    add_last(item) {
        const node = {item, prev: this.tail, next: null};
        if (this.tail) this.tail.next = node; else this.head = node;
        this.tail = node; this.n++;
    }
    peek_first() { if (!this.n) throw new RangeError('empty deque'); return this.head.item; }
    peek_last() { if (!this.n) throw new RangeError('empty deque'); return this.tail.item; }
    remove_first() {
        const item = this.peek_first(); this.head = this.head.next; this.n--;
        if (this.head) this.head.prev = null; else this.tail = null;
        return item;
    }
    remove_last() {
        const item = this.peek_last(); this.tail = this.tail.prev; this.n--;
        if (this.tail) this.tail.next = null; else this.head = null;
        return item;
    }
    *[Symbol.iterator]() { for (let p = this.head; p; p = p.next) yield p.item; }
}
class MinHeap {
    constructor(less = (a, b) => a < b) { this.data = []; this.less = less; }
    size() { return this.data.length; }
    peek() { if (!this.size()) throw new RangeError('empty heap'); return this.data[0]; }
    push(item) {
        const a = this.data; a.push(item); let i = a.length - 1;
        while (i > 0) {
            const p = Math.floor((i - 1) / 2);
            if (!this.less(a[i], a[p])) break;
            [a[i], a[p]] = [a[p], a[i]]; i = p;
        }
    }
    pop() {
        const result = this.peek(), a = this.data, last = a.pop();
        if (a.length) {
            a[0] = last; let i = 0;
            while (2 * i + 1 < a.length) {
                let c = 2 * i + 1;
                if (c + 1 < a.length && this.less(a[c + 1], a[c])) c++;
                if (!this.less(a[c], a[i])) break;
                [a[c], a[i]] = [a[i], a[c]]; i = c;
            }
        }
        return result;
    }
}
const entry_less = (a, b) => a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]);
function hash_index(key, m) {
    // Shared h(k)=k traces use integer keys. Strings use a simple teaching hash.
    let h = key;
    if (typeof key === 'string') {
        h = 0; for (const c of key) h = (31 * h + c.codePointAt(0)) % m;
    } else if (!Number.isSafeInteger(key)) throw new TypeError('integer or string key required');
    return ((h % m) + m) % m;
}
class KeyError extends Error {}

// topics/kd-trees/spatial-queries.md
var shared_points = [[5,4],[2,7],[8,1],[1,3],[3,6],[7,5],[9,2]], shared_query = [1,2,4,7];
function same_point(a,b) { return a[0] === b[0] && a[1] === b[1]; }
function checked_rect(rect) {
    if (rect.length !== 4 || !rect.every(Number.isFinite)) throw new RangeError("four finite coordinates required");
    if (rect[0]>rect[2] || rect[1]>rect[3]) throw new RangeError("reversed bounds");
    return [...rect];
}
function in_closed_rect([x,y],[xmin,ymin,xmax,ymax]) { return xmin<=x && x<=xmax && ymin<=y && y<=ymax; }
function scan_range(points,rect) { rect=checked_rect(rect); return points.filter(p=>in_closed_rect(p,rect)); }

// topics/kd-trees/kd-construction.md
class KDNode {
    constructor(point) { this.point=point; this.left=null; this.right=null; }
}
function kd_insert(node,point,depth=0) {
    if (node===null) return new KDNode(point);
    if (same_point(point,node.point)) return node;
    const axis=depth%2;
    if (point[axis]<node.point[axis]) node.left=kd_insert(node.left,point,depth+1);
    else node.right=kd_insert(node.right,point,depth+1);
    return node;
}
var points=[[5,4],[2,7],[8,1],[1,3],[3,6],[7,5],[9,2]], root=null;
for (const point of points) root=kd_insert(root,point);

// topics/kd-trees/kd-exact-search.md
function kd_search(node,point,depth=0) {
    while (node!==null) {
        if (same_point(point,node.point)) return node;
        const axis=depth%2;
        node=point[axis]<node.point[axis] ? node.left : node.right;
        depth++;
    }
    return null;
}

// topics/kd-trees/kd-range-search.md
function kd_range(root,low,high) {
    if (low.some((x,i)=>x>high[i])) throw new RangeError("reversed bounds");
    const out=[];
    function visit(node,depth) {
        if (node===null) return;
        const p=node.point, axis=depth%2;
        if (p.every((x,i)=>low[i]<=x && x<=high[i])) out.push(p);
        if (low[axis]<p[axis]) visit(node.left,depth+1);
        if (high[axis]>=p[axis]) visit(node.right,depth+1);
    }
    visit(root,0); return out;
}

// topics/kd-trees/kd-nearest.md
function kd_nearest(root,query) {
    let best_point=null, best_d2=Infinity;
    function visit(node,depth) {
        if (node===null) return;
        const p=node.point, d2=(p[0]-query[0])**2+(p[1]-query[1])**2;
        if (best_point===null || d2<best_d2) { best_point=p; best_d2=d2; }
        const delta=query[depth%2]-p[depth%2];
        const near=delta<0 ? node.left : node.right, far=delta<0 ? node.right : node.left;
        visit(near,depth+1);
        if (delta*delta<=best_d2) visit(far,depth+1);
    }
    visit(root,0); return best_point;
}

// topics/kd-trees/kd-updates-costs.md
function kd_axis_min(node,axis,depth) {
    if (node===null) return null;
    if (depth%2===axis) return node.left===null ? node.point : kd_axis_min(node.left,axis,depth+1);
    const candidates=[node.point];
    for (const child of [node.left,node.right]) {
        const p=kd_axis_min(child,axis,depth+1); if (p!==null) candidates.push(p);
    }
    return candidates.reduce((a,b)=>b[axis]<a[axis] ? b : a);
}
function kd_delete(node,point,depth=0) {
    if (node===null) return null;
    const axis=depth%2;
    if (same_point(point,node.point)) {
        if (node.right!==null) {
            const replacement=kd_axis_min(node.right,axis,depth+1);
            node.point=replacement; node.right=kd_delete(node.right,replacement,depth+1);
        } else if (node.left!==null) {
            const replacement=kd_axis_min(node.left,axis,depth+1);
            node.point=replacement; node.right=kd_delete(node.left,replacement,depth+1); node.left=null;
        } else return null;
    } else if (point[axis]<node.point[axis]) node.left=kd_delete(node.left,point,depth+1);
    else node.right=kd_delete(node.right,point,depth+1);
    return node;
}

// topics/kd-trees/point-quadtrees.md
function point_quadrant(point,pivot) { return Number(point[0]>=pivot[0])+2*Number(point[1]>=pivot[1]); }
class PointQuadNode {
    constructor(point) { this.point=point; this.children=Array(4).fill(null); }
}
function point_quad_insert(root,point) {
    if (root===null) return new PointQuadNode(point);
    let node=root;
    while (true) {
        if (same_point(point,node.point)) return root;
        const q=point_quadrant(point,node.point), child=node.children[q];
        if (child===null) { node.children[q]=new PointQuadNode(point); return root; }
        node=child;
    }
}
function point_quad_contains(root,point) {
    let node=root;
    while (node!==null) {
        if (same_point(point,node.point)) return true;
        node=node.children[point_quadrant(point,node.point)];
    }
    return false;
}
var point_root=null;
for (const point of shared_points) point_root=point_quad_insert(point_root,point);

// topics/kd-trees/point-quadtrees.md
function point_quad_range(root,rect) {
    rect=checked_rect(rect); const [xmin,ymin,xmax,ymax]=rect, out=[], stack=root===null ? [] : [root];
    while (stack.length) {
        const node=stack.pop(), [x,y]=node.point;
        if (in_closed_rect(node.point,rect)) out.push(node.point);
        const west=xmin<x, east=xmax>=x, south=ymin<y, north=ymax>=y;
        const possible=[west&&south,east&&south,west&&north,east&&north];
        for (let i=3;i>=0;i--) if (possible[i] && node.children[i]!==null) stack.push(node.children[i]);
    }
    return out;
}

// topics/kd-trees/point-quadtree-updates.md
function box_distance2(query,[xmin,ymin,xmax,ymax]) {
    const dx=Math.max(xmin-query[0],0,query[0]-xmax), dy=Math.max(ymin-query[1],0,query[1]-ymax);
    return dx*dx+dy*dy;
}
function point_quad_cells([xmin,ymin,xmax,ymax],[x,y]) {
    return [[xmin,ymin,x,y],[x,ymin,xmax,y],[xmin,y,x,ymax],[x,y,xmax,ymax]];
}

// topics/kd-trees/point-quadtree-updates.md
function point_quad_nearest(root,query) {
    let best=null,best_d2=Infinity;
    const stack=root===null ? [] : [[root,[-Infinity,-Infinity,Infinity,Infinity]]];
    while (stack.length) {
        const [node,bounds]=stack.pop(); if (box_distance2(query,bounds)>best_d2) continue;
        const d2=(node.point[0]-query[0])**2+(node.point[1]-query[1])**2;
        if (best===null || d2<best_d2) { best=node.point; best_d2=d2; }
        const cells=point_quad_cells(bounds,node.point), children=[];
        node.children.forEach((child,i)=>{if(child!==null)children.push([child,cells[i]])});
        children.sort((a,b)=>box_distance2(query,b[1])-box_distance2(query,a[1]));
        stack.push(...children);
    }
    return best;
}

// topics/kd-trees/point-quadtree-updates.md
function point_quad_delete(root,point) {
    let parent=null,branch=null,node=root;
    while (node!==null && !same_point(node.point,point)) {
        parent=node; branch=point_quadrant(point,node.point); node=node.children[branch];
    }
    if (node===null) return root;
    const survivors=[],stack=[node];
    while (stack.length) {
        const current=stack.pop(); if (!same_point(current.point,point)) survivors.push(current.point);
        for (const child of current.children.slice().reverse()) if (child!==null) stack.push(child);
    }
    let replacement=null;
    for (const survivor of survivors) replacement=point_quad_insert(replacement,survivor);
    if (parent===null) return replacement;
    parent.children[branch]=replacement; return root;
}

// topics/kd-trees/pr-quadtree-operations.md
function in_half_open_cell([x,y],[xmin,ymin,xmax,ymax]) { return xmin<=x && x<xmax && ymin<=y && y<ymax; }
function cell_query_overlap([xmin,ymin,xmax,ymax],[a,b,c,d]) { return c>=xmin && a<xmax && d>=ymin && b<ymax; }
function midpoint_cells([xmin,ymin,xmax,ymax]) {
    const mx=xmin/2+xmax/2, my=ymin/2+ymax/2;
    if (!(xmin<mx && mx<xmax && ymin<my && my<ymax)) return null;
    return [[xmin,ymin,mx,my],[mx,ymin,xmax,my],[xmin,my,mx,ymax],[mx,my,xmax,ymax]];
}
class PRNode {
    constructor(bounds) { this.bounds=bounds; this.points=[]; this.children=null; }
}

// topics/kd-trees/pr-quadtree-operations.md
class PRQuadTree {
    constructor(bounds,capacity=1,max_depth=16) {
        bounds=checked_rect(bounds);
        if (bounds[0]===bounds[2] || bounds[1]===bounds[3]) throw new RangeError("positive extent required");
        if (!Number.isSafeInteger(capacity)||capacity<1||!Number.isSafeInteger(max_depth)||max_depth<0)
            throw new RangeError("invalid capacity/depth");
        this.root=new PRNode(bounds); this.capacity=capacity; this.max_depth=max_depth; this.members=new Set();
    }
    insert(point) {
        if (!in_half_open_cell(point,this.root.bounds)) throw new RangeError("point outside extent");
        const key=JSON.stringify(point); if (this.members.has(key)) return false;
        const pending=[[this.root,point,0]];
        while (pending.length) {
            const [node,p,depth]=pending.pop();
            if (node.children!==null) {
                const pivot=[node.children[0].bounds[2],node.children[0].bounds[3]];
                pending.push([node.children[point_quadrant(p,pivot)],p,depth+1]); continue;
            }
            const subdivisions=midpoint_cells(node.bounds);
            if (node.points.length<this.capacity || depth>=this.max_depth || subdivisions===null) { node.points.push(p); continue; }
            const records=[...node.points,p]; node.points=[]; node.children=subdivisions.map(c=>new PRNode(c));
            const pivot=[subdivisions[0][2],subdivisions[0][3]];
            for (const old of records) pending.push([node.children[point_quadrant(old,pivot)],old,depth+1]);
        }
        this.members.add(key); return true;
    }
    contains(point) {
        if (!in_half_open_cell(point,this.root.bounds)) return false;
        let node=this.root;
        while (node.children!==null) {
            const pivot=[node.children[0].bounds[2],node.children[0].bounds[3]];
            node=node.children[point_quadrant(point,pivot)];
        }
        return node.points.some(p=>same_point(p,point));
    }
    range_query(rect) {
        rect=checked_rect(rect); const out=[],stack=[this.root];
        while (stack.length) {
            const node=stack.pop(); if (!cell_query_overlap(node.bounds,rect)) continue;
            if (node.children===null) for (const p of node.points) { if(in_closed_rect(p,rect))out.push(p); }
            else stack.push(...node.children.slice().reverse());
        }
        return out;
    }
}
var pr_tree=new PRQuadTree([0,0,12,12],1);
for (const point of shared_points) pr_tree.insert(point);

// topics/kd-trees/pr-quadtree-updates.md
function pr_nearest(tree,query) {
    let best=null,best_d2=Infinity; const stack=[tree.root];
    while (stack.length) {
        const node=stack.pop(); if (box_distance2(query,node.bounds)>best_d2) continue;
        if (node.children===null) {
            for (const point of node.points) {
                const d2=(point[0]-query[0])**2+(point[1]-query[1])**2;
                if (best===null || d2<best_d2) { best=point; best_d2=d2; }
            }
        } else stack.push(...node.children.slice().sort((a,b)=>box_distance2(query,b.bounds)-box_distance2(query,a.bounds)));
    }
    return best;
}

// topics/kd-trees/pr-quadtree-updates.md
function pr_delete(tree,point) {
    const key=JSON.stringify(point); if (!tree.members.has(key)) return false;
    let node=tree.root; const path=[];
    while (node.children!==null) {
        path.push(node); const pivot=[node.children[0].bounds[2],node.children[0].bounds[3]];
        node=node.children[point_quadrant(point,pivot)];
    }
    node.points.splice(node.points.findIndex(p=>same_point(p,point)),1); tree.members.delete(key);
    for (const parent of path.reverse()) {
        const children=parent.children;
        if (children.some(c=>c.children!==null) || children.reduce((s,c)=>s+c.points.length,0)>tree.capacity) break;
        parent.points=children.flatMap(c=>c.points); parent.children=null;
    }
    return true;
}

// topics/kd-trees/r-tree-representation.md
var segments=new Map([["L1",[[0,0],[10,10]]],["L2",[[0,7],[6,7]]],["L3",[[8,0],[10,2]]],
    ["L4",[[3,5],[3,9]]],["L5",[[5,6],[9,8]]]]), line_query=[2,6,4,8];
function segment_bounds([a,b]) { return [Math.min(a[0],b[0]),Math.min(a[1],b[1]),Math.max(a[0],b[0]),Math.max(a[1],b[1])]; }
function enclosing_bounds(boxes) {
    boxes=[...boxes]; if(!boxes.length)throw new RangeError("nonempty boxes required");
    return boxes.reduce((a,b)=>[Math.min(a[0],b[0]),Math.min(a[1],b[1]),Math.max(a[2],b[2]),Math.max(a[3],b[3])]);
}
class RNode { constructor(entries,leaf) { this.entries=[...entries]; this.leaf=leaf; } }
var line_boxes=new Map([...segments].map(([key,value])=>[key,segment_bounds(value)]));
var group_u=new RNode(["L1","L2"].map(k=>[line_boxes.get(k),k]),true);
var group_v=new RNode(["L3","L4","L5"].map(k=>[line_boxes.get(k),k]),true);
var r_root=new RNode([[enclosing_bounds(group_u.entries.map(e=>e[0])),group_u],
    [enclosing_bounds(group_v.entries.map(e=>e[0])),group_v]],false);

// topics/kd-trees/r-tree-queries.md
function closed_boxes_overlap(a,b) { return a[0]<=b[2] && b[0]<=a[2] && a[1]<=b[3] && b[1]<=a[3]; }
function rtree_candidates(root,rect) {
    rect=checked_rect(rect); const out=[],stack=[root];
    while (stack.length) {
        const node=stack.pop();
        for (const [box,item] of node.entries) {
            if (!closed_boxes_overlap(box,rect)) continue;
            if (node.leaf) out.push(item); else stack.push(item);
        }
    }
    return out;
}

// topics/kd-trees/r-tree-queries.md
// Exact determinant arithmetic for the integer-coordinate line examples.
function orientation(a,b,c) {
    const [ax,ay]=a.map(BigInt),[bx,by]=b.map(BigInt),[cx,cy]=c.map(BigInt);
    return (bx-ax)*(cy-ay)-(by-ay)*(cx-ax);
}
function on_segment(a,b,p) { return orientation(a,b,p)===0n && in_closed_rect(p,segment_bounds([a,b])); }
function segments_intersect(a,b,c,d) {
    const x=orientation(a,b,c),y=orientation(a,b,d),z=orientation(c,d,a),w=orientation(c,d,b);
    if (((x<0n&&y>0n)||(y<0n&&x>0n)) && ((z<0n&&w>0n)||(w<0n&&z>0n))) return true;
    return (x===0n&&on_segment(a,b,c))||(y===0n&&on_segment(a,b,d))||(z===0n&&on_segment(c,d,a))||(w===0n&&on_segment(c,d,b));
}
function segment_intersects_rect([a,b],rect) {
    rect=checked_rect(rect); if(in_closed_rect(a,rect)||in_closed_rect(b,rect))return true;
    const [xmin,ymin,xmax,ymax]=rect,corners=[[xmin,ymin],[xmax,ymin],[xmax,ymax],[xmin,ymax]];
    return corners.some((c,i)=>segments_intersect(a,b,c,corners[(i+1)%4]));
}
var candidates=rtree_candidates(r_root,line_query);
var line_matches=candidates.filter(key=>segment_intersects_rect(segments.get(key),line_query));

// topics/kd-trees/r-tree-operations.md
function rtree_exact_segment(root,query_segment,records) {
    const candidates=rtree_candidates(root,segment_bounds(query_segment)),[a,b]=query_segment;
    return candidates.filter(key=>{
        const [c,d]=records.get(key);
        return (same_point(c,a)&&same_point(d,b))||(same_point(c,b)&&same_point(d,a));
    });
}

// topics/kd-trees/r-tree-operations.md
function point_segment_distance2(query,[a,b]) {
    const dx=b[0]-a[0],dy=b[1]-a[1],length2=dx*dx+dy*dy;
    const t=length2===0 ? 0 : Math.max(0,Math.min(1,((query[0]-a[0])*dx+(query[1]-a[1])*dy)/length2));
    return (query[0]-(a[0]+t*dx))**2+(query[1]-(a[1]+t*dy))**2;
}
function rtree_nearest(root,query,records) {
    let serial=0,best=null,best_d2=Infinity; const pending=new MinHeap(entry_less);
    function enqueue(node) {
        for (const [box,item] of node.entries) {
            const bound=box_distance2(query,box);
            if (bound<=best_d2) pending.push([bound,serial++,node.leaf,item]);
        }
    }
    enqueue(root);
    while (pending.size()) {
        const [bound,sequence,is_record,item]=pending.pop(); if (bound>best_d2) break;
        if (is_record) {
            const d2=point_segment_distance2(query,records.get(item));
            if(best===null||d2<best_d2){best=item;best_d2=d2;}
        } else enqueue(item);
    }
    return best;
}
