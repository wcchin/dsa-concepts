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

// topics/maps-sets-hashing/maps.md
class HashMap {
    constructor() { this._entries = new Map(); }
    size() { return this._entries.size; }
    is_empty() { return this.size() === 0; }
    put(key, value) { this._entries.set(key, value); }
    get(key) { if (!this.contains_key(key)) throw new KeyError(String(key)); return this._entries.get(key); }
    remove(key) { const value = this.get(key); this._entries.delete(key); return value; }
    contains_key(key) { return this._entries.has(key); }
    keys() { return [...this._entries.keys()]; }
    items() { return [...this._entries]; }
}

// topics/maps-sets-hashing/maps.md
var directory = new Map([["S01", "Central"], ["S02", "Museum"]]);
directory.set("S03", "Harbour"); directory.set("S01", "Downtown");
var name = directory.get("S02"); directory.delete("S03");
var present = directory.has("S04");

// topics/maps-sets-hashing/maps.md
var missing = Symbol("missing");
var result = directory.has("S04") ? directory.get("S04") : missing;
if (result === missing) console.log("No such station");

// topics/maps-sets-hashing/sets.md
class HashSet {
    constructor(elements = []) { this._elements = new Set(elements); }
    size() { return this._elements.size; }
    is_empty() { return this.size() === 0; }
    add(item) { this._elements.add(item); }
    contains(item) { return this._elements.has(item); }
    remove(item) { if (!this.contains(item)) throw new KeyError(String(item)); this._elements.delete(item); }
    discard(item) { this._elements.delete(item); }
    elements() { return [...this._elements]; }
    union(other) { return new HashSet([...this._elements, ...other._elements]); }
    intersection(other) { return new HashSet([...this._elements].filter(x => other.contains(x))); }
    difference(other) { return new HashSet([...this._elements].filter(x => !other.contains(x))); }
}

// topics/maps-sets-hashing/sets.md
var visited = new Set();
visited.add("S01"); visited.add("S02"); visited.add("S01");
var present = visited.has("S02"), count = visited.size;
visited.delete("S03"); // missing member: no change

// topics/maps-sets-hashing/sets.md
var observations = ["S01", "S02", "S01"], counts = new Map();
for (const station of observations) counts.set(station, (counts.get(station) ?? 0) + 1);

// topics/maps-sets-hashing/hashing.md
// JS Map compares array keys by identity, not by coordinate value.
var point = [2, 3], locations = new Map([[point, "Stop A"]]);
console.assert(locations.get(point) === "Stop A");
console.assert(!locations.has([2, 3]));
var records = new Map([["S01", [72, 81]]]);
records.get("S01").push(85);

// topics/maps-sets-hashing/chaining.md
function get_chained(table, key) {
    for (const [stored_key, value] of table[hash_index(key, table.length)])
        if (stored_key === key) return value;
    throw new KeyError(String(key));
}

// topics/maps-sets-hashing/chaining.md
function put_chained(table, key, value) {
    const bucket = table[hash_index(key, table.length)];
    for (let j = 0; j < bucket.length; j++) {
        if (bucket[j][0] === key) { bucket[j] = [key, value]; return false; }
    }
    bucket.push([key, value]); return true;
}

// topics/maps-sets-hashing/chaining.md
function remove_chained(table, key) {
    const bucket = table[hash_index(key, table.length)];
    for (let j = 0; j < bucket.length; j++) {
        if (bucket[j][0] === key) return bucket.splice(j, 1)[0][1];
    }
    throw new KeyError(String(key));
}

// topics/maps-sets-hashing/chaining.md
var table = Array.from({length: 7}, () => []);

// topics/maps-sets-hashing/open-addressing.md
var EMPTY = Symbol("empty"), DELETED = Symbol("deleted");
function get_probed(table, key) {
    const m = table.length, start = hash_index(key, m);
    for (let step = 0; step < m; step++) {
        const slot = table[(start + step) % m];
        if (slot === EMPTY) throw new KeyError(String(key));
        if (slot === DELETED) continue;
        if (slot[0] === key) return slot[1];
    }
    throw new KeyError(String(key));
}

// topics/maps-sets-hashing/open-addressing.md
function put_probed(table, key, value) {
    const m = table.length, start = hash_index(key, m); let first_deleted = null;
    for (let step = 0; step < m; step++) {
        const i = (start + step) % m, slot = table[i];
        if (slot === EMPTY) { table[first_deleted === null ? i : first_deleted] = [key, value]; return true; }
        if (slot === DELETED) { if (first_deleted === null) first_deleted = i; }
        else if (slot[0] === key) { table[i] = [key, value]; return false; }
    }
    if (first_deleted !== null) { table[first_deleted] = [key, value]; return true; }
    throw new RangeError("hash table is full");
}
function remove_probed(table, key) {
    const m = table.length, start = hash_index(key, m);
    for (let step = 0; step < m; step++) {
        const i = (start + step) % m, slot = table[i];
        if (slot === EMPTY) throw new KeyError(String(key));
        if (slot !== DELETED && slot[0] === key) { table[i] = DELETED; return slot[1]; }
    }
    throw new KeyError(String(key));
}

// topics/maps-sets-hashing/performance.md
function rebuild_chained(table, capacity) {
    if (!Number.isSafeInteger(capacity) || capacity <= 0) throw new RangeError("positive integer capacity required");
    const fresh = Array.from({length: capacity}, () => []);
    for (const bucket of table) for (const [key, value] of bucket) put_chained(fresh, key, value);
    return fresh;
}
function rebuild_probed(table, capacity) {
    if (!Number.isSafeInteger(capacity) || capacity <= 0) throw new RangeError("positive integer capacity required");
    const fresh = Array(capacity).fill(EMPTY);
    for (const slot of table) if (slot !== EMPTY && slot !== DELETED) put_probed(fresh, slot[0], slot[1]);
    return fresh;
}
