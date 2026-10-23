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

const values = [3, 7, 11, 18, 24];
console.log(binary_search(values, 18)); // 3
console.log(binary_search(values, 3));  // 0
console.log(binary_search(values, 20)); // null
console.log(binary_search([], 18));    // null
