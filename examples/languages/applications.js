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

// topics/graphs/graph-representations.md
var graph = new Map([
    ["A", ["B", "C"]], ["B", ["A", "D", "E"]], ["C", ["A", "F"]],
    ["D", ["B", "E"]], ["E", ["B", "D", "F"]], ["F", ["C", "E", "G"]],
    ["G", ["F"]], ["H", []]
]);

// topics/graphs/graph-representations.md
var vertices = [...graph.keys()], index = new Map(vertices.map((v, i) => [v, i]));
var matrix = Array.from({length: vertices.length}, () => Array(vertices.length).fill(0));
for (const u of vertices) for (const v of graph.get(u)) matrix[index.get(u)][index.get(v)] = 1;

// topics/graphs/graph-operations.md
function add_vertex(graph, v) {
    if (v === null) throw new TypeError("null is reserved for missing parents");
    if (!graph.has(v)) graph.set(v, []);
}
function require_endpoints(graph, u, v) {
    if (!graph.has(u)) throw new KeyError(String(u));
    if (!graph.has(v)) throw new KeyError(String(v));
}
function add_edge(graph, u, v, directed = false) {
    require_endpoints(graph, u, v);
    if (u === v) throw new RangeError("no self-loops");
    if (!graph.get(u).includes(v)) graph.get(u).push(v);
    if (!directed && !graph.get(v).includes(u)) graph.get(v).push(u);
}
function has_edge(graph, u, v) { require_endpoints(graph, u, v); return graph.get(u).includes(v); }
function neighbours(graph, u) {
    if (!graph.has(u)) throw new KeyError(String(u)); return graph.get(u).slice();
}
function remove_edge(graph, u, v, directed = false) {
    require_endpoints(graph, u, v);
    const i = graph.get(u).indexOf(v);
    if (i < 0) throw new KeyError("missing edge");
    graph.get(u).splice(i, 1);
    if (!directed) graph.get(v).splice(graph.get(v).indexOf(u), 1);
}
function remove_vertex(graph, v) {
    if (!graph.has(v)) throw new KeyError(String(v));
    for (const [u, adjacent] of graph) {
        const i = adjacent.indexOf(v); if (u !== v && i >= 0) adjacent.splice(i, 1);
    }
    graph.delete(v);
}
function vertex_count(graph) { return graph.size; }
function edge_count(graph, directed = false) {
    let entries = 0; for (const a of graph.values()) entries += a.length;
    return directed ? entries : entries / 2;
}
function build_graph(vertices, edges, directed = false) {
    const graph = new Map();
    for (const v of vertices) add_vertex(graph, v);
    for (const [u, v] of edges) add_edge(graph, u, v, directed);
    return graph;
}

// topics/graphs/breadth-first-search.md
function bfs(graph, start) {
    if (!graph.has(start)) throw new KeyError(String(start));
    const distance = new Map([[start, 0]]), parent = new Map([[start, null]]), order = [];
    const queue = new DequeBuffer([start]);
    while (!queue.is_empty()) {
        const u = queue.remove_first(); order.push(u);
        for (const v of graph.get(u)) if (!distance.has(v)) {
            distance.set(v, distance.get(u) + 1); parent.set(v, u); queue.add_last(v);
        }
    }
    return [order, parent, distance];
}

// topics/graphs/breadth-first-search.md
function path_to(parent, target) {
    if (!parent.has(target)) return null;
    const path = []; let current = target;
    while (current !== null) { path.push(current); current = parent.get(current); }
    return path.reverse();
}

// topics/graphs/depth-first-search.md
function dfs(graph, start) {
    if (!graph.has(start)) throw new KeyError(String(start));
    const seen = new Set(), parent = new Map([[start, null]]), discovery = [], finish = [];
    function visit(u) {
        seen.add(u); discovery.push(u);
        for (const v of graph.get(u)) if (!seen.has(v)) { parent.set(v, u); visit(v); }
        finish.push(u);
    }
    visit(start); return [discovery, finish, parent];
}

// topics/graphs/graph-components.md
function connected_components(graph) {
    const seen = new Set(), groups = [];
    for (const start of graph.keys()) {
        if (seen.has(start)) continue;
        seen.add(start); const queue = new DequeBuffer([start]), group = [];
        while (!queue.is_empty()) {
            const u = queue.remove_first(); group.push(u);
            for (const v of graph.get(u)) if (!seen.has(v)) { seen.add(v); queue.add_last(v); }
        }
        groups.push(group);
    }
    return groups;
}

// topics/union-find/parent-forests.md
function find_root(parent, x) {
    while (parent[x] !== x) x = parent[x];
    return x;
}

// topics/union-find/union-compression.md
class DisjointSet {
    constructor(n) {
        if (!Number.isSafeInteger(n) || n < 0) throw new RangeError("nonnegative integer size required");
        this.parent = Array.from({length:n}, (_, i) => i);
        this.sizes = Array(n).fill(1); this.components = n;
    }
    _check(x) {
        if (!Number.isInteger(x) || x < 0 || x >= this.parent.length) throw new RangeError("member index out of range");
    }
    find(x) {
        this._check(x); let root = x;
        while (this.parent[root] !== root) root = this.parent[root];
        while (this.parent[x] !== x) {
            const next_x = this.parent[x]; this.parent[x] = root; x = next_x;
        }
        return root;
    }
    union(a, b) {
        let ra = this.find(a), rb = this.find(b);
        if (ra === rb) return false;
        if (this.sizes[ra] < this.sizes[rb]) [ra, rb] = [rb, ra];
        this.parent[rb] = ra; this.sizes[ra] += this.sizes[rb]; this.components--; return true;
    }
    connected(a, b) { return this.find(a) === this.find(b); }
    size() { return this.parent.length; }
    is_empty() { return this.size() === 0; }
    component_count() { return this.components; }
    component_size(x) { return this.sizes[this.find(x)]; }
}

// topics/union-find/union-find-applications.md
function connection_forest(n, edges) {
    const sets = new DisjointSet(n), chosen = [], rejected = [];
    for (const [a, b] of edges) (sets.union(a, b) ? chosen : rejected).push([a, b]);
    return [chosen, rejected, sets.components];
}

// topics/graph-algorithms/topological-order.md
var dag = new Map([["A", ["C"]], ["B", ["C", "D"]], ["C", ["E"]],
    ["D", ["E"]], ["E", ["F"]], ["F", []], ["G", []]]);
function valid_topological_order(graph, order) {
    if (order.length !== graph.size || new Set(order).size !== graph.size || order.some(v => !graph.has(v))) return false;
    const position = new Map(order.map((v, i) => [v, i]));
    for (const [u, adjacent] of graph) for (const v of adjacent)
        if (position.get(u) >= position.get(v)) return false;
    return true;
}

// topics/graph-algorithms/topological-order.md
function topological_sort(graph) {
    const degree = new Map([...graph.keys()].map(v => [v, 0]));
    for (const adjacent of graph.values()) for (const v of adjacent) degree.set(v, degree.get(v) + 1);
    const ready = new DequeBuffer([...graph.keys()].filter(v => degree.get(v) === 0)), order = [];
    while (!ready.is_empty()) {
        const u = ready.remove_first(); order.push(u);
        for (const v of graph.get(u)) {
            degree.set(v, degree.get(v) - 1);
            if (degree.get(v) === 0) ready.add_last(v);
        }
    }
    if (order.length !== graph.size) throw new RangeError("directed cycle: no complete order");
    return order;
}

// topics/graph-algorithms/shortest-path-state.md
var weighted = new Map([
    ["A", [["B",4],["C",1]]], ["B", [["D",1],["E",7]]],
    ["C", [["B",2],["D",5],["F",8]]], ["D", [["E",3]]],
    ["E", [["F",1]]], ["F", []], ["G", []]
]);

// topics/graph-algorithms/shortest-path-state.md
function weighted_path_to(source, target, distance, parent) {
    if (!distance.has(target)) throw new KeyError(String(target));
    if (distance.get(target) === Infinity) return null;
    const path = []; let current = target;
    while (current !== null) { path.push(current); current = parent.get(current); }
    return path.reverse();
}

// topics/graph-algorithms/dijkstra.md
function dijkstra(graph, source) {
    if (!graph.has(source)) throw new KeyError(String(source));
    for (const adjacent of graph.values()) for (const [v,w] of adjacent)
        if (w < 0) throw new RangeError("Dijkstra requires nonnegative weights");
    const distance = new Map([...graph.keys()].map(v => [v, Infinity]));
    const parent = new Map([...graph.keys()].map(v => [v, null]));
    distance.set(source, 0); let sequence = 0;
    const heap = new MinHeap(entry_less); heap.push([0, sequence++, source]);
    while (heap.size()) {
        const [cost, serial, u] = heap.pop();
        if (cost !== distance.get(u)) continue;
        for (const [v,w] of graph.get(u)) {
            const candidate = cost + w;
            if (candidate < distance.get(v)) {
                distance.set(v, candidate); parent.set(v, u); heap.push([candidate, sequence++, v]);
            }
        }
    }
    return [distance, parent];
}

// topics/graph-algorithms/dag-shortest-paths.md
function dag_shortest_paths(graph, source) {
    if (!graph.has(source)) throw new KeyError(String(source));
    const unweighted = new Map([...graph].map(([u,adjacent]) => [u, adjacent.map(([v,w]) => v)]));
    const order = topological_sort(unweighted);
    const distance = new Map([...graph.keys()].map(v => [v, Infinity]));
    const parent = new Map([...graph.keys()].map(v => [v, null])); distance.set(source, 0);
    for (const u of order) {
        if (distance.get(u) === Infinity) continue;
        for (const [v,w] of graph.get(u)) {
            const candidate = distance.get(u) + w;
            if (candidate < distance.get(v)) { distance.set(v, candidate); parent.set(v, u); }
        }
    }
    return [distance, parent];
}

// topics/graph-algorithms/spanning-trees.md
var vertices = [..."ABCDEF"];
var edges = [[4,"A","B"],[2,"A","C"],[1,"B","C"],[5,"B","D"],[8,"C","D"],
    [10,"C","E"],[2,"D","E"],[6,"D","F"],[3,"E","F"]];
function weighted_adjacency(vertices, edges) {
    const graph = new Map([...vertices].map(v => [v, []]));
    for (const [w,u,v] of edges) { graph.get(u).push([v,w]); graph.get(v).push([u,w]); }
    return graph;
}

// topics/graph-algorithms/prim.md
function prim_forest(graph) {
    const seen = new Set(), chosen = []; let total = 0, components = 0, sequence = 0;
    for (const root of graph.keys()) {
        if (seen.has(root)) continue;
        components++; seen.add(root); const heap = new MinHeap(entry_less);
        for (const [v,w] of graph.get(root)) if (!seen.has(v)) heap.push([w, sequence++, root, v]);
        while (heap.size()) {
            const [w,serial,u,v] = heap.pop(); if (seen.has(v)) continue;
            seen.add(v); chosen.push([w,u,v]); total += w;
            for (const [x,cost] of graph.get(v)) if (!seen.has(x)) heap.push([cost, sequence++, v, x]);
        }
    }
    return [chosen, total, components];
}

// topics/graph-algorithms/kruskal.md
function kruskal_forest(vertices, edges) {
    vertices = [...vertices]; const index = new Map(vertices.map((v,i) => [v,i]));
    if (index.size !== vertices.length) throw new RangeError("vertices must be unique");
    const sets = new DisjointSet(vertices.length), chosen = []; let total = 0;
    for (const [w,u,v] of [...edges].sort((a,b) => a[0]-b[0])) {
        if (!index.has(u) || !index.has(v)) throw new KeyError("unknown endpoint");
        if (sets.union(index.get(u), index.get(v))) { chosen.push([w,u,v]); total += w; }
    }
    return [chosen, total, sets.components];
}

// topics/applications/transport-model.md
// Use BFS, Dijkstra, DisjointSet, Prim and Kruskal from the preceding topics.
var places = new Map([["A","Gate"],["B","Museum"],["C","Library"],["D","Market"],
    ["E","Clinic"],["F","Park"],["G","Harbour"]]);
var links = [["A","B",12,3],["A","C",3,6],["B","C",2,2],["B","D",3,4],
    ["C","D",9,1],["C","E",12,7],["D","E",3,5],["D","F",8,2],["E","F",2,3]];
function adjacency_view(places, links, weight_column = null) {
    if (![null,2,3].includes(weight_column)) throw new RangeError("invalid weight column");
    const graph = new Map([...places.keys()].map(v => [v, []]));
    for (const row of links) {
        const [u,v] = row;
        if (!graph.has(u) || !graph.has(v)) throw new KeyError("unknown endpoint");
        graph.get(u).push(weight_column === null ? v : [v,row[weight_column]]);
        graph.get(v).push(weight_column === null ? u : [u,row[weight_column]]);
    }
    return graph;
}
var hop_graph = adjacency_view(places, links), time_graph = adjacency_view(places, links, 2);
var build_graph_view = adjacency_view(places, links, 3);
var edge_key = (u,v) => JSON.stringify([u,v].sort());

// topics/applications/transport-model.md
function route_total(route, links, weight_column) {
    if (![2,3].includes(weight_column)) throw new RangeError("invalid weight column");
    if (route === null) return null;
    const weights = new Map(links.map(row => [edge_key(row[0],row[1]),row[weight_column]]));
    const rest = route.slice(1); let total = 0;
    for (let i = 0; i < rest.length; i++) {
        const key = edge_key(route[i],rest[i]);
        if (!weights.has(key)) throw new KeyError("missing link"); total += weights.get(key);
    }
    return total;
}

// topics/applications/transport-hops.md
var [order, hop_parent, hop_distance] = bfs(hop_graph, "A");
var fewest_route = path_to(hop_parent, "F");
var fewest_minutes = route_total(fewest_route, links, 2);

// topics/applications/transport-times.md
var [time_distance, time_parent] = dijkstra(time_graph, "A");
var fastest_route = weighted_path_to("A", "F", time_distance, time_parent);
var fastest_minutes = route_total(fastest_route, links, 2);

// topics/applications/transport-connectivity.md
var place_index = new Map([...places.keys()].map((v,i) => [v,i]));
var sets = new DisjointSet(places.size), opening_log = [];
for (const [u,v,minutes,build_units] of links) {
    const merged = sets.union(place_index.get(u), place_index.get(v));
    opening_log.push([u,v,merged,sets.components]);
}

// topics/applications/transport-design.md
var construction_edges = links.map(([u,v,minutes,cost]) => [cost,u,v]);
var [chosen_build, build_total, build_components] = kruskal_forest(places.keys(), construction_edges);
var [prim_chosen, prim_total, prim_components] = prim_forest(build_graph_view);

// topics/applications/transport-design.md
var chosen_pairs = new Set(chosen_build.map(([cost,u,v]) => edge_key(u,v)));
var built_links = links.filter(row => chosen_pairs.has(edge_key(row[0],row[1])));
var built_time_graph = adjacency_view(places, built_links, 2);
var [built_distance, built_parent] = dijkstra(built_time_graph, "A");
var built_route = weighted_path_to("A", "F", built_distance, built_parent);
