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
