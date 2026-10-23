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

// topics/searching/binary-search.md
function binary_search(a, target) {
    let low = 0, high = a.length - 1;
    while (low <= high) {
        const mid = low + Math.floor((high - low) / 2);
        if (a[mid] === target) {
            return mid;
        }
        if (target < a[mid]) {
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return null;
}

// topics/searching/binary-search.md
var values = [3, 7, 11, 18, 24];
console.log(binary_search(values, 18)); // 3
console.log(binary_search(values, 3));  // 0
console.log(binary_search(values, 20)); // null
console.log(binary_search([], 18));    // null

// topics/searching/search-boundaries.md
function lower_bound(a, target) {
    let low = 0, high = a.length;
    while (low < high) {
        const mid = low + Math.floor((high - low) / 2);
        if (a[mid] < target) low = mid + 1; else high = mid;
    }
    return low;
}

// topics/searching/search-boundaries.md
function upper_bound(a, target) {
    let low = 0, high = a.length;
    while (low < high) {
        const mid = low + Math.floor((high - low) / 2);
        if (a[mid] <= target) low = mid + 1; else high = mid;
    }
    return low;
}

// topics/searching/bst-lookup-insertion.md
class BSTNode {
    constructor(key) { this.key = key; this.left = null; this.right = null; }
}

// topics/searching/bst-lookup-insertion.md
function bst_search(node, target) {
    while (node !== null) {
        if (target === node.key) return node;
        node = target < node.key ? node.left : node.right;
    }
    return null;
}

// topics/searching/bst-lookup-insertion.md
function bst_insert(node, key) {
    if (node === null) return new BSTNode(key);
    if (key < node.key) node.left = bst_insert(node.left, key);
    else if (key > node.key) node.right = bst_insert(node.right, key);
    return node;
}
var root = null;
for (const key of [50, 30, 70, 20, 40, 60, 80]) root = bst_insert(root, key);
root = bst_insert(root, 65);

// topics/searching/bst-traversal.md
function inorder_keys(root) {
    const out = [];
    function visit(node) {
        if (node === null) return;
        visit(node.left);
        out.push(node.key);
        visit(node.right);
    }
    visit(root); return out;
}

// topics/searching/bst-traversal.md
function preorder_keys(root) {
    const out = [];
    function visit(node) {
        if (node === null) return;
        out.push(node.key);
        visit(node.left);
        visit(node.right);
    }
    visit(root); return out;
}

function postorder_keys(root) {
    const out = [];
    function visit(node) {
        if (node === null) return;
        visit(node.left);
        visit(node.right);
        out.push(node.key);
    }
    visit(root); return out;
}

// topics/searching/bst-traversal.md
function bst_minimum(node) {
    if (node === null) return null;
    while (node.left !== null) node = node.left;
    return node;
}

// topics/searching/bst-traversal.md
function bst_maximum(node) {
    if (node === null) return null;
    while (node.right !== null) node = node.right;
    return node;
}
function bst_successor(root, key) {
    let candidate = null, node = root;
    while (node !== null) {
        if (key < node.key) { candidate = node; node = node.left; }
        else node = node.right;
    }
    return candidate;
}
function bst_predecessor(root, key) {
    let candidate = null, node = root;
    while (node !== null) {
        if (node.key < key) { candidate = node; node = node.right; }
        else node = node.left;
    }
    return candidate;
}

// topics/searching/bst-range-queries.md
function bst_range_keys(root, low, high) {
    if (low > high) throw new RangeError("lower bound exceeds upper bound");
    const out = [];
    function visit(node) {
        if (node === null) return;
        if (low < node.key) visit(node.left);
        if (low <= node.key && node.key <= high) out.push(node.key);
        if (node.key < high) visit(node.right);
    }
    visit(root); return out;
}

// topics/searching/bst-deletion.md
function bst_delete(node, key) {
    if (node === null) return null;
    if (key < node.key) node.left = bst_delete(node.left, key);
    else if (key > node.key) node.right = bst_delete(node.right, key);
    else {
        if (node.left === null) return node.right;
        if (node.right === null) return node.left;
        const successor = bst_minimum(node.right);
        node.key = successor.key;
        node.right = bst_delete(node.right, successor.key);
    }
    return node;
}

// topics/searching/ordered-set-operations.md
class OrderedSet {
    constructor(insert_key, delete_key) {
        this._root = null; this._size = 0;
        this._insert_key = insert_key; this._delete_key = delete_key;
    }
    size() { return this._size; }
    is_empty() { return this._size === 0; }
    contains(key) { return bst_search(this._root, key) !== null; }
    add(key) {
        if (!this.contains(key)) { this._root = this._insert_key(this._root, key); this._size++; }
    }
    remove(key) {
        if (!this.contains(key)) throw new KeyError(String(key));
        this._root = this._delete_key(this._root, key); this._size--;
    }
    discard(key) { if (this.contains(key)) this.remove(key); }
    _required_key(node) { if (node === null) throw new KeyError("no matching key"); return node.key; }
    minimum() { return this._required_key(bst_minimum(this._root)); }
    maximum() { return this._required_key(bst_maximum(this._root)); }
    successor(key) { return this._required_key(bst_successor(this._root, key)); }
    predecessor(key) { return this._required_key(bst_predecessor(this._root, key)); }
    extract_min() { const key = this.minimum(); this.remove(key); return key; }
    extract_max() { const key = this.maximum(); this.remove(key); return key; }
    keys() { return inorder_keys(this._root); }
    range_keys(low, high) { return bst_range_keys(this._root, low, high); }
}

// topics/balanced-trees/avl-invariants.md
class AVLNode {
    constructor(key) { this.key = key; this.left = null; this.right = null; this.height = 0; }
}
function height(node) { return node === null ? -1 : node.height; }
function update_height(node) { node.height = 1 + Math.max(height(node.left), height(node.right)); }
function balance_factor(node) { return height(node.left) - height(node.right); }

// topics/balanced-trees/avl-rotations.md
function rotate_right(z) {
    const y = z.left, middle = y.right;
    y.right = z; z.left = middle;
    update_height(z); update_height(y); return y;
}
function rotate_left(z) {
    const y = z.right, middle = y.left;
    y.left = z; z.right = middle;
    update_height(z); update_height(y); return y;
}

// topics/balanced-trees/avl-cases.md
function rebalance(node) {
    update_height(node); const bf = balance_factor(node);
    if (bf > 1) {
        if (balance_factor(node.left) < 0) node.left = rotate_left(node.left);
        return rotate_right(node);
    }
    if (bf < -1) {
        if (balance_factor(node.right) > 0) node.right = rotate_right(node.right);
        return rotate_left(node);
    }
    return node;
}

// topics/balanced-trees/avl-insertion.md
function avl_insert(node, key) {
    if (node === null) return new AVLNode(key);
    if (key < node.key) node.left = avl_insert(node.left, key);
    else if (key > node.key) node.right = avl_insert(node.right, key);
    else return node;
    return rebalance(node);
}
var root = null;
for (const key of [30, 10, 20]) root = avl_insert(root, key);

// topics/balanced-trees/avl-deletion.md
function avl_delete(node, key) {
    if (node === null) return null;
    if (key < node.key) node.left = avl_delete(node.left, key);
    else if (key > node.key) node.right = avl_delete(node.right, key);
    else {
        if (node.left === null) return node.right;
        if (node.right === null) return node.left;
        let successor = node.right;
        while (successor.left !== null) successor = successor.left;
        node.key = successor.key; node.right = avl_delete(node.right, successor.key);
    }
    return rebalance(node);
}

// topics/balanced-trees/avl-operations.md
var balanced = new OrderedSet(avl_insert, avl_delete);
for (const key of [30, 10, 20]) balanced.add(key);
balanced.add(20);
console.assert(balanced.size() === 3);
console.assert(JSON.stringify(balanced.keys()) === "[10,20,30]");
console.assert(balanced.successor(15) === 20);
console.assert(JSON.stringify(balanced.range_keys(15, 30)) === "[20,30]");
console.assert(balanced.extract_min() === 10);
console.assert(JSON.stringify(balanced.keys()) === "[20,30]");
