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

// topics/strategies/greedy.md
function select_activities(activities) {
    activities = [...activities];
    if (activities.some(([name,start,end]) => start >= end)) throw new RangeError("start must precede end");
    const chosen = []; let last_end = -Infinity;
    for (const activity of activities.slice().sort((a,b)=>a[2]-b[2] || a[1]-b[1])) {
        if (activity[1] >= last_end) { chosen.push(activity); last_end = activity[2]; }
    }
    return chosen;
}

// topics/strategies/dynamic-programming.md
function coin_problem(coins, amount) {
    coins = [...coins];
    if (!Number.isSafeInteger(amount) || amount<0 || coins.some(c=>!Number.isSafeInteger(c)||c<=0))
        throw new RangeError("nonnegative amount and positive integer coins required");
    return [...new Set(coins)].sort((a,b)=>a-b);
}
function min_coins_memo(coins, amount) {
    coins = coin_problem(coins,amount); const memo = new Map([[0,0]]);
    function solve(a) {
        if (!memo.has(a)) {
            let best = Infinity;
            for (const c of coins) if (c<=a) best = Math.min(best,1+solve(a-c));
            memo.set(a,best);
        }
        return memo.get(a);
    }
    const result = solve(amount); return result === Infinity ? null : result;
}

// topics/strategies/dynamic-programming.md
function min_coin_change(coins, amount) {
    coins = coin_problem(coins,amount);
    const best = Array(amount+1).fill(Infinity), choice = Array(amount+1).fill(null); best[0] = 0;
    for (let a=1;a<=amount;a++) for (const c of coins) {
        if (c<=a && best[a-c]+1<best[a]) { best[a]=best[a-c]+1; choice[a]=c; }
    }
    if (best[amount] === Infinity) return null;
    const selected = []; let a=amount;
    while (a>0) { selected.push(choice[a]); a-=choice[a]; }
    return [best[amount],selected];
}

// topics/strategies/backtracking.md
function subset_sum_indices(values,target) {
    values = [...values];
    if (!Number.isSafeInteger(target)||target<0||values.some(v=>!Number.isSafeInteger(v)||v<=0))
        throw new RangeError("nonnegative target and positive integers required");
    const results=[], chosen=[];
    function search(i,remaining) {
        if (remaining===0) { results.push(chosen.slice()); return; }
        if (i===values.length) return;
        if (values[i]<=remaining) { chosen.push(i); search(i+1,remaining-values[i]); chosen.pop(); }
        search(i+1,remaining);
    }
    search(0,target); return results;
}

// topics/strategies/sequence-patterns.md
function prefix_sums(values) {
    const prefix = [0]; for (const value of values) prefix.push(prefix.at(-1) + value);
    return prefix;
}

// topics/strategies/sequence-patterns.md
function two_sum_sorted(values, target) {
    let left = 0, right = values.length - 1;
    while (left < right) {
        const total = values[left] + values[right];
        if (total === target) return [left,right];
        if (total < target) left++; else right--;
    }
    return null;
}

// topics/strategies/sequence-patterns.md
function max_fixed_window_sum(values, k) {
    if (!Number.isSafeInteger(k) || k<1 || k>values.length) throw new RangeError("invalid window size");
    let total = 0; for (let i=0;i<k;i++) total += values[i];
    let best = total;
    for (let right=k;right<values.length;right++) {
        total += values[right] - values[right-k]; best = Math.max(best,total);
    }
    return best;
}
