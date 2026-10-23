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

// topics/analysis/counting-work.md
function contains_with_count(values, target) {
    let comparisons = 0;
    for (const value of values) {
        comparisons++;
        if (value === target) return [true, comparisons];
    }
    return [false, comparisons];
}
var stations = ["KR", "MUS", "UTN", "CLM"];
console.log(contains_with_count(stations, "UTN"));
console.log(contains_with_count(stations, "BG"));

// topics/analysis/counting-work.md
function visit_count(values) {
    let visits = 0;
    for (const value of values) visits++;
    return visits;
}
console.log(visit_count(["KR", "MUS", "UTN"]));
console.log(visit_count([]));

// topics/analysis/counting-work.md
class Node {
    constructor(value, next_node = null) { this.value = value; this.next = next_node; }
}
var known = new Node("KR", new Node("UTN"));
var added = new Node("MUS");
added.next = known.next;
known.next = added;

// topics/analysis/code-and-space.md
function count_two_passes(values) {
    let work = 0;
    for (const value of values) work++;
    for (const value of values) work++;
    return work;
}
console.log(count_two_passes(["KR", "MUS", "UTN"]));

// topics/analysis/code-and-space.md
function count_pairs(n) {
    let full = 0, triangular = 0;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) full++;
    for (let i = 0; i < n; i++) for (let j = 0; j < i; j++) triangular++;
    return [full, triangular];
}
console.log(count_pairs(5));

// topics/analysis/code-and-space.md
function halving_steps(n) {
    if (n < 1) throw new RangeError("n must be positive");
    let steps = 0, remaining = n;
    while (remaining > 1) { remaining = Math.floor(remaining / 2); steps++; }
    return steps;
}
console.log(halving_steps(16)); console.log(halving_steps(13)); console.log(halving_steps(1));

// topics/analysis/code-and-space.md
function inspect_count(values, detailed) {
    if (values.length === 0) return 0;
    if (!detailed) return 1;
    return count_two_passes(values);
}

// topics/analysis/code-and-space.md
function count_values(values) {
    let count = 0;
    for (const value of values) count++;
    return count;
}
function copy_values(values) {
    const result = [];
    for (const value of values) result.push(value);
    return result;
}
