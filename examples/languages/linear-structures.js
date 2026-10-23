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

// topics/linear-structures/sequence-adt.md
class ArraySequence {
    constructor(values = []) { this._items = [...values]; }
    size() { return this._items.length; }
    is_empty() { return this.size() === 0; }
    _check_index(i, allow_end = false) {
        if (!Number.isInteger(i)) throw new TypeError("integer index required");
        if (i < 0 || i > this.size() - (allow_end ? 0 : 1)) throw new RangeError("index out of range");
    }
    get(i) { this._check_index(i); return this._items[i]; }
    set(i, item) { this._check_index(i); this._items[i] = item; }
    insert(i, item) { this._check_index(i, true); this._items.splice(i, 0, item); }
    append(item) { this._items.push(item); }
    remove_at(i) { this._check_index(i); return this._items.splice(i, 1)[0]; }
}

// topics/linear-structures/stacks.md
class Stack {
    constructor() { this._items = []; }
    push(item) { this._items.push(item); }
    pop() { if (this.is_empty()) throw new RangeError("empty stack"); return this._items.pop(); }
    peek() { if (this.is_empty()) throw new RangeError("empty stack"); return this._items.at(-1); }
    size() { return this._items.length; }
    is_empty() { return this.size() === 0; }
}

// topics/linear-structures/stacks.md
function brackets_balanced(text) {
    const openers = [], matching = new Map([[")", "("], ["]", "["], ["}", "{"]]);
    for (const symbol of text) {
        if (["(", "[", "{"].includes(symbol)) openers.push(symbol);
        else if (matching.has(symbol)) {
            if (!openers.length || openers.pop() !== matching.get(symbol)) return false;
        }
    }
    return openers.length === 0;
}

// topics/linear-structures/queues-and-deques.md
// DequeBuffer is defined in the downloadable shared support file.
class Queue {
    constructor() { this._items = new DequeBuffer(); }
    size() { return this._items.size(); }
    is_empty() { return this.size() === 0; }
    enqueue(item) { this._items.add_last(item); }
    front() { return this._items.peek_first(); }
    dequeue() { return this._items.remove_first(); }
}

// topics/linear-structures/deques.md
// Use the shared linked DequeBuffer; JavaScript has no built-in deque.
var items = new DequeBuffer();
items.add_last("B"); items.add_first("A"); items.add_last("C");
console.assert(items.remove_last() === "C");
items.add_first("X");
console.assert(items.remove_first() === "X");
console.assert(JSON.stringify([...items]) === '["A","B"]');

// topics/linear-structures/deques.md
class Deque {
    constructor() { this._items = new DequeBuffer(); }
    size() { return this._items.size(); }
    is_empty() { return this.size() === 0; }
    add_first(item) { this._items.add_first(item); }
    add_last(item) { this._items.add_last(item); }
    peek_first() { return this._items.peek_first(); }
    peek_last() { return this._items.peek_last(); }
    remove_first() { return this._items.remove_first(); }
    remove_last() { return this._items.remove_last(); }
}

// topics/linear-structures/deques.md
var window = new DequeBuffer([12, 15, 14, 18]);
window.add_last(20);
if (window.size() > 4) window.remove_first();
console.assert(JSON.stringify([...window]) === "[15,14,18,20]");

// topics/linear-structures/deques.md
function is_palindrome(sequence) {
    const remaining = new DequeBuffer(sequence);
    while (remaining.size() > 1)
        if (remaining.remove_first() !== remaining.remove_last()) return false;
    return true;
}

// topics/linear-structures/arrays.md
var route = ["A", "B", "C", "D"];
route.splice(1, 0, "X");
console.assert(JSON.stringify(route) === '["A","X","B","C","D"]');
console.assert(route.splice(1, 1)[0] === "X");
route[1] = "Y";
console.assert(JSON.stringify(route) === '["A","Y","C","D"]');

// topics/linear-structures/linked-structures.md
class Node {
    constructor(value, next_node = null) { this.value = value; this.next = next_node; }
}
var c = new Node("C"), b = new Node("B", c), head = new Node("A", b);

// topics/linear-structures/linked-structures.md
function linked_values(head) {
    const values = [];
    for (let current = head; current !== null; current = current.next) values.push(current.value);
    return values;
}
console.assert(JSON.stringify(linked_values(head)) === '["A","B","C"]');

// topics/linear-structures/linked-structures.md
var added = new Node("X");
added.next = b.next; b.next = added;
console.assert(JSON.stringify(linked_values(head)) === '["A","B","X","C"]');

// topics/linear-structures/linked-structures.md
function remove_after(node) {
    if (node.next === null) throw new RangeError("no successor");
    const removed = node.next; node.next = removed.next; removed.next = null;
    return removed.value;
}
console.assert(remove_after(b) === "X");
console.assert(JSON.stringify(linked_values(head)) === '["A","B","C"]');

// topics/linear-structures/circular-queues.md
class CircularQueue {
    constructor(capacity) {
        if (!Number.isSafeInteger(capacity) || capacity <= 0) throw new RangeError("positive integer capacity required");
        this._data = Array(capacity).fill(null); this._front = 0; this._size = 0;
    }
    size() { return this._size; }
    is_empty() { return this._size === 0; }
    enqueue(item) {
        if (this._size === this._data.length) throw new RangeError("queue is full");
        this._data[(this._front + this._size) % this._data.length] = item;
        this._size++;
    }
    front() { if (this.is_empty()) throw new RangeError("empty queue"); return this._data[this._front]; }
    dequeue() {
        const item = this.front(); this._data[this._front] = null;
        this._front = (this._front + 1) % this._data.length; this._size--; return item;
    }
}

// topics/linear-structures/linked-queues.md
class LinkedQueue {
    constructor() { this._head = null; this._tail = null; this._size = 0; }
    size() { return this._size; }
    is_empty() { return this._size === 0; }
    enqueue(item) {
        const added = new Node(item);
        if (this.is_empty()) this._head = added; else this._tail.next = added;
        this._tail = added; this._size++;
    }
    front() { if (this.is_empty()) throw new RangeError("empty queue"); return this._head.value; }
    dequeue() {
        const item = this.front(), removed = this._head;
        this._head = removed.next; this._size--;
        if (this._head === null) this._tail = null;
        removed.next = null; return item;
    }
}
