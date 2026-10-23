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
