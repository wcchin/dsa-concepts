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

// topics/sorting/sorting-properties.md
var students = [["Alice", 80], ["Ben", 70], ["Chen", 80]];
var by_score = students.slice().sort((a, b) => a[1] - b[1]);
console.assert(JSON.stringify(by_score) === JSON.stringify([["Ben", 70], ["Alice", 80], ["Chen", 80]]));
console.assert(students[0][0] === "Alice");

// topics/sorting/sorting-properties.md
var values = [3, 1, 2];
var result = values.sort((a, b) => a - b);
console.assert(JSON.stringify(values) === "[1,2,3]");
console.assert(result === values); // JS sort returns the mutated array, unlike Python.

// topics/sorting/insertion-sort.md
function insertion_sort(a) {
    for (let i = 1; i < a.length; i++) {
        const item = a[i];
        let j = i - 1;
        while (j >= 0 && a[j] > item) { a[j + 1] = a[j]; j--; }
        a[j + 1] = item;
    }
}

// topics/sorting/bubble-sort.md
function bubble_sort(a) {
    for (let end = a.length - 1; end > 0; end--) {
        let swapped = false;
        for (let j = 0; j < end; j++) {
            if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; swapped = true; }
        }
        if (!swapped) break;
    }
}

// topics/sorting/merge-sort.md
function merge_sorted(left, right) {
    const result = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) result.push(left[i++]);
        else result.push(right[j++]);
    }
    while (i < left.length) result.push(left[i++]);
    while (j < right.length) result.push(right[j++]);
    return result;
}
function merge_sort(values) {
    if (values.length <= 1) return values.slice();
    const middle = Math.floor(values.length / 2);
    return merge_sorted(merge_sort(values.slice(0, middle)), merge_sort(values.slice(middle)));
}

// topics/sorting/partitioning.md
function partition(a, lo, hi) {
    const pivot = a[hi];
    let boundary = lo;
    for (let scan = lo; scan < hi; scan++) {
        if (a[scan] <= pivot) {
            [a[boundary], a[scan]] = [a[scan], a[boundary]];
            boundary++;
        }
    }
    [a[boundary], a[hi]] = [a[hi], a[boundary]];
    return boundary;
}

// topics/sorting/quicksort.md
function quicksort(a) {
    function sort_range(lo, hi) {
        if (lo >= hi) return;
        const p = partition(a, lo, hi);
        sort_range(lo, p - 1);
        sort_range(p + 1, hi);
    }
    sort_range(0, a.length - 1);
}

// topics/sorting/timsort.md
// Native sort API comparison; this does not claim its engine uses Powersort.
var records = [["A", 4], ["B", 1], ["C", 4]];
var ordered = records.slice().sort((a, b) => a[1] - b[1]);
console.assert(JSON.stringify(ordered) === JSON.stringify([["B", 1], ["A", 4], ["C", 4]]));
var result = records.sort((a, b) => b[1] - a[1]);
console.assert(result === records);
console.assert(JSON.stringify(records) === JSON.stringify([["A", 4], ["C", 4], ["B", 1]]));
