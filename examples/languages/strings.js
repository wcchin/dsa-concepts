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

// topics/strings/string-model.md
var composed = "é", decomposed = "e\u0301";
console.assert(composed !== decomposed);
console.assert(composed.normalize("NFC") === decomposed.normalize("NFC"));

// topics/strings/trie-representation.md
class TrieNode {
    constructor() { this.children = new Map(); this.terminal = false; }
}

// topics/strings/trie-operations.md
class Trie {
    constructor() { this.root = new TrieNode(); this.size = 0; }
    is_empty() { return this.size === 0; }
    _walk(text) {
        if (typeof text !== "string") throw new TypeError("expected a string");
        let node = this.root;
        for (const char of text) { node = node.children.get(char); if (node === undefined) return null; }
        return node;
    }
    contains(word) { const node = this._walk(word); return node !== null && node.terminal; }
    has_prefix(prefix) { return this._walk(prefix) !== null; }
    insert(word) {
        if (typeof word !== "string") throw new TypeError("expected a string");
        let node = this.root;
        for (const char of word) {
            if (!node.children.has(char)) node.children.set(char, new TrieNode());
            node = node.children.get(char);
        }
        if (node.terminal) return false;
        node.terminal = true; this.size++; return true;
    }
    delete(word) {
        if (typeof word !== "string") throw new TypeError("expected a string");
        let node = this.root; const path = [];
        for (const char of word) {
            const child = node.children.get(char); if (child === undefined) return false;
            path.push([node,char,child]); node = child;
        }
        if (!node.terminal) return false;
        node.terminal = false; this.size--;
        for (let i = path.length - 1; i >= 0; i--) {
            const [parent,char,child] = path[i];
            if (child.terminal || child.children.size) break;
            parent.children.delete(char);
        }
        return true;
    }
}

// topics/strings/trie-operations.md
var trie = new Trie();
for (const word of ["be","bus","buses","busy","car"]) trie.insert(word);

// topics/strings/trie-prefix-queries.md
function* words_with_prefix(trie, prefix) {
    const node = trie._walk(prefix); if (node === null) return;
    const path = [...prefix]; if (node.terminal) yield prefix;
    const stack = [[node, node.children.entries()]];
    while (stack.length) {
        const step = stack.at(-1)[1].next();
        if (step.done) { stack.pop(); if (stack.length) path.pop(); continue; }
        const [char,child] = step.value; path.push(char);
        if (child.terminal) yield path.join("");
        stack.push([child,child.children.entries()]);
    }
}

// topics/strings/trie-prefix-queries.md
function longest_stored_prefix(trie, text) {
    if (typeof text !== "string") throw new TypeError("expected a string");
    const chars = [...text]; let node = trie.root, best = node.terminal ? 0 : null;
    for (let i = 0; i < chars.length; i++) {
        node = node.children.get(chars[i]); if (node === undefined) break;
        if (node.terminal) best = i + 1;
    }
    return best === null ? null : chars.slice(0,best).join("");
}

// topics/strings/substring-baseline.md
function naive_find_all(text, pattern) {
    const t = [...text], p = [...pattern], n = t.length, m = p.length;
    if (m === 0) return Array.from({length:n+1}, (_,i) => i);
    const matches = [];
    for (let start = 0; start <= n - m; start++) {
        let j = 0; while (j < m && t[start+j] === p[j]) j++;
        if (j === m) matches.push(start);
    }
    return matches;
}

// topics/strings/kmp-matching.md
function prefix_function(pattern) {
    const p = [...pattern], pi = Array(p.length).fill(0); let j = 0;
    for (let i = 1; i < p.length; i++) {
        while (j > 0 && p[i] !== p[j]) j = pi[j-1];
        if (p[i] === p[j]) j++;
        pi[i] = j;
    }
    return pi;
}

// topics/strings/kmp-matching.md
function kmp_find_all(text, pattern) {
    const t = [...text], p = [...pattern];
    if (!p.length) return Array.from({length:t.length+1}, (_,i) => i);
    const pi = prefix_function(p), matches = []; let j = 0;
    for (let i = 0; i < t.length; i++) {
        while (j > 0 && t[i] !== p[j]) j = pi[j-1];
        if (t[i] === p[j]) j++;
        if (j === p.length) { matches.push(i-p.length+1); j = pi[j-1]; }
    }
    return matches;
}

// topics/strings/rolling-hash-search.md
function rolling_find_all(text, pattern, {base=257n, modulus=1000000007n} = {}) {
    if (typeof base !== "bigint" || base < 2n || typeof modulus !== "bigint" || modulus < 2n)
        throw new RangeError("base and modulus must be BigInts at least 2");
    const t = [...text], p = [...pattern], n = t.length, m = p.length;
    if (!m) return Array.from({length:n+1}, (_,i) => i);
    if (m > n) return [];
    let high = 1n, power = m-1, factor = base % modulus;
    while (power > 0) {
        if (power % 2) high = high * factor % modulus;
        factor = factor * factor % modulus; power = Math.floor(power / 2);
    }
    const code = c => BigInt(c.codePointAt(0));
    const mod = x => (x % modulus + modulus) % modulus;
    let target_hash = 0n, window_hash = 0n;
    for (let j=0; j<m; j++) {
        target_hash = mod(target_hash * base + code(p[j]));
        window_hash = mod(window_hash * base + code(t[j]));
    }
    const matches = [];
    for (let start=0; start<=n-m; start++) {
        if (window_hash === target_hash && p.every((c,j) => t[start+j] === c)) matches.push(start);
        if (start+m<n) window_hash = mod((window_hash-code(t[start])*high)*base+code(t[start+m]));
    }
    return matches;
}
