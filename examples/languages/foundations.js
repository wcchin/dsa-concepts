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

// topics/foundations/data-and-algorithms.md
function find_stop(route, target) {
    for (let index = 0; index < route.length; index++) {
        if (route[index] === target) return index;
    }
    return null;
}
var route = ["KR", "MUS", "UTN", "MUS"];
console.log(find_stop(route, "MUS")); // 1
console.log(find_stop(route, "CLM")); // null

// topics/foundations/objects-and-references.md
var stop = "Kent Ridge";
var passengers = 12;
stop = "Museum";
console.log(stop); // Museum

// topics/foundations/objects-and-references.md
var route_a = ["KR", "MUS"];
var route_b = route_a;
console.log(route_a === route_b); // true

// topics/foundations/objects-and-references.md
var x = ["KR", "MUS"], y = ["KR", "MUS"], z = x;
// JavaScript array equality tests identity, so compare elements for contents.
console.log(x.length === y.length && x.every((v, i) => v === y[i])); // true
console.log(x === y); // false
console.log(x === z); // true

// topics/foundations/objects-and-references.md
var next_node = null;
console.log(next_node === null); // true

// topics/foundations/mutation-and-copying.md
// Freeze the outer record, not the array it refers to.
var record = Object.freeze(["KR", [12, 15]]);
record[1].push(18);
console.log(record); // ["KR", [12, 15, 18]]

// topics/foundations/mutation-and-copying.md
var route_a = ["KR", "MUS"];
var route_b = route_a;
route_b.push("UTN");
console.log(route_a); // ["KR", "MUS", "UTN"]
route_b = ["CLM"];
console.log(route_a); // ["KR", "MUS", "UTN"]
console.log(route_b); // ["CLM"]

// topics/foundations/mutation-and-copying.md
function replace_route(route) { route = ["Botanic Gardens"]; }
function extend_route(route) { route.push("Botanic Gardens"); }
var stops = ["Kent Ridge"];
replace_route(stops);
console.log(stops); // ["Kent Ridge"]
extend_route(stops);
console.log(stops); // ["Kent Ridge", "Botanic Gardens"]

// topics/foundations/mutation-and-copying.md
var routes = [["KR", "MUS"], ["KR", "UTN"]];
var backup = routes.slice();
console.log(backup === routes); // false
console.log(backup[0] === routes[0]); // true
backup[0].push("CLM");
console.log(routes[0]); // ["KR", "MUS", "CLM"]

// topics/foundations/mutation-and-copying.md
var original = [["KR", "MUS"], ["KR", "UTN"]];
// structuredClone supports these plain nested arrays, not arbitrary class instances.
var independent = structuredClone(original);
independent[0].push("CLM");
console.log(original[0]);
console.log(independent[0]);

// topics/foundations/mutation-and-copying.md
// Unlike Python, JavaScript evaluates this default at each call.
function add_stop(stop, route = []) {
    route.push(stop);
    return route;
}
var first = add_stop("KR"), second = add_stop("MUS");
console.log(first, second); // ["KR"] ["MUS"]
console.log(first === second); // false

// topics/foundations/collections-and-classes.md
var location = [1.2937, 103.7845];
var [latitude, longitude] = location;
var passenger_counts = new Map([
    ["Kent Ridge", 12], ["Museum", 7], ["University Town", 18]
]);
var busy_stops = [...passenger_counts]
    .filter(([name, count]) => count >= 10).map(([name]) => name);
console.log(busy_stops);

// topics/foundations/collections-and-classes.md
class ShuttleStop {
    constructor(code, name) {
        this.code = code; this.name = name; this._passengers = 0;
    }
    _check_number(number) {
        if (!Number.isSafeInteger(number) || number < 0)
            throw new RangeError("Expected a nonnegative integer count");
    }
    board(number = 1) { this._check_number(number); this._passengers += number; }
    alight(number = 1) {
        this._check_number(number);
        if (number > this._passengers) throw new RangeError("Not enough passengers");
        this._passengers -= number;
    }
    toString() {
        return `ShuttleStop(${this.code}, ${this.name}, passengers=${this._passengers})`;
    }
}
var museum = new ShuttleStop("MUS", "Museum");
var utown = new ShuttleStop("UTN", "University Town");
museum.board(3); utown.board(8); museum.alight(1);
console.log(String(museum)); console.log(String(utown));

// topics/foundations/collections-and-classes.md
class RouteNode {
    constructor(stop, next_node = null) { this.stop = stop; this.next = next_node; }
}
var second = new RouteNode(new ShuttleStop("MUS", "Museum"));
var first = new RouteNode(new ShuttleStop("KR", "Kent Ridge"), second);
for (let current = first; current !== null; current = current.next)
    console.log(current.stop.name);
