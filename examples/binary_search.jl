function binary_search(a, target)
    low, high = 1, length(a)
    while low <= high
        mid = low + div(high - low, 2)
        if a[mid] == target
            return mid
        end
        if target < a[mid]
            high = mid - 1
        else
            low = mid + 1
        end
    end
    return nothing
end

values = [3, 7, 11, 18, 24]
println(binary_search(values, 18))  # 4
println(binary_search(values, 3))   # 1
println(binary_search(values, 20))  # nothing
println(binary_search(Int[], 18))  # nothing
