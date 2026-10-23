def binary_search(a, target):
    low, high = 0, len(a) - 1
    while low <= high:
        mid = (low + high) // 2
        if a[mid] == target:
            return mid
        if target < a[mid]:
            high = mid - 1
        else:
            low = mid + 1
    return None

values = [3, 7, 11, 18, 24]
print(binary_search(values, 18))  # 3
print(binary_search(values, 3))   # 0
print(binary_search(values, 20))  # None
print(binary_search([], 18))      # None
