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

// topics/heaps/heap-insertion.md
function sift_up(heap, i) {
    while (i > 0) {
        const parent = Math.floor((i - 1) / 2);
        if (heap[parent] <= heap[i]) break;
        [heap[parent], heap[i]] = [heap[i], heap[parent]]; i = parent;
    }
}
function push_min(heap, priority) { heap.push(priority); sift_up(heap, heap.length - 1); }

// topics/heaps/heap-removal.md
function peek_min(heap) {
    if (!heap.length) throw new RangeError("empty heap"); return heap[0];
}

// topics/heaps/heap-removal.md
function sift_down(heap, i) {
    const n = heap.length;
    while (2 * i + 1 < n) {
        let child = 2 * i + 1, right = child + 1;
        if (right < n && heap[right] < heap[child]) child = right;
        if (heap[i] <= heap[child]) break;
        [heap[i], heap[child]] = [heap[child], heap[i]]; i = child;
    }
}

// topics/heaps/heap-removal.md
function pop_min(heap) {
    const result = peek_min(heap), last = heap.pop();
    if (heap.length) { heap[0] = last; sift_down(heap, 0); }
    return result;
}

// topics/heaps/heap-construction.md
function build_min_heap(values) {
    const heap = [...values];
    for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) sift_down(heap, i);
    return heap;
}

// topics/heaps/heap-applications.md
var values = build_min_heap([9, 5, 6, 2, 3, 4]);
push_min(values, 1);
console.assert(pop_min(values) === 1);
console.assert(values[0] === 2);

// topics/heaps/heap-applications.md
// MinHeap and entry_less are in the shared support file.
class MinPriorityQueue {
    constructor() { this._heap = new MinHeap(entry_less); this._sequence = 0; }
    size() { return this._heap.size(); }
    is_empty() { return this.size() === 0; }
    insert(item, priority) { this._heap.push([priority, this._sequence++, item]); }
    peek_min() { return this._heap.peek()[2]; }
    remove_min() { return this._heap.pop()[2]; }
    extract_min() { return this.remove_min(); }
}

// topics/heaps/heap-applications.md
class MaxPriorityQueue {
    constructor() { this._queue = new MinPriorityQueue(); }
    size() { return this._queue.size(); }
    is_empty() { return this.size() === 0; }
    insert(item, priority) { this._queue.insert(item, -priority); }
    peek_max() { return this._queue.peek_min(); }
    remove_max() { return this._queue.remove_min(); }
    extract_max() { return this.remove_max(); }
}

// topics/heaps/heap-sorting-costs.md
function heapsort(a) {
    function sift_down_max(i, end) {
        while (2 * i + 1 < end) {
            let child = 2 * i + 1, right = child + 1;
            if (right < end && a[right] > a[child]) child = right;
            if (a[i] >= a[child]) break;
            [a[i], a[child]] = [a[child], a[i]]; i = child;
        }
    }
    for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) sift_down_max(i, a.length);
    for (let end = a.length - 1; end > 0; end--) {
        [a[0], a[end]] = [a[end], a[0]]; sift_down_max(0, end);
    }
}
