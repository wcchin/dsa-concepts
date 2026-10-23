# Generated from the published Markdown; run scripts/build_language_examples.py to refresh.
# Independent examples may reuse top-level names. Python remains the explanation language.

# Fixed-size linked nodes; O(1) deque endpoint updates.
mutable struct DQLink
    item
    prev
    next
end
mutable struct DequeBuffer
    head
    tail
    n::Int
end
function DequeBuffer(values=())
    q = DequeBuffer(nothing, nothing, 0)
    for item in values
        db_add_last!(q, item)
    end
    return q
end
function db_add_first!(q, item)
    node = DQLink(item, nothing, q.head)
    if q.head === nothing; q.tail = node; else; q.head.prev = node; end
    q.head = node; q.n += 1
    return nothing
end
function db_add_last!(q, item)
    node = DQLink(item, q.tail, nothing)
    if q.tail === nothing; q.head = node; else; q.tail.next = node; end
    q.tail = node; q.n += 1
    return nothing
end
function db_first(q)
    q.n > 0 || throw(BoundsError())
    return q.head.item
end
function db_last(q)
    q.n > 0 || throw(BoundsError())
    return q.tail.item
end
function db_remove_first!(q)
    item = db_first(q); q.head = q.head.next; q.n -= 1
    if q.head === nothing; q.tail = nothing; else; q.head.prev = nothing; end
    return item
end
function db_remove_last!(q)
    item = db_last(q); q.tail = q.tail.prev; q.n -= 1
    if q.tail === nothing; q.head = nothing; else; q.tail.next = nothing; end
    return item
end
function db_values(q)
    result = Any[]; p = q.head
    while p !== nothing
        push!(result, p.item); p = p.next
    end
    return result
end
mutable struct MinHeap
    data::Vector{Any}
    less
end
MinHeap(less=isless) = MinHeap(Any[], less)
function heap_peek(h)
    isempty(h.data) && throw(BoundsError())
    return h.data[1]
end
function heap_push!(h, item)
    a = h.data; push!(a, item); i = length(a)
    while i > 1
        p = div(i, 2)
        !h.less(a[i], a[p]) && break
        a[i], a[p] = a[p], a[i]; i = p
    end
    return nothing
end
function heap_pop!(h)
    result = heap_peek(h); a = h.data; last_item = pop!(a)
    if !isempty(a)
        a[1] = last_item; i = 1
        while 2i <= length(a)
            c = 2i
            if c < length(a) && h.less(a[c+1], a[c]); c += 1; end
            !h.less(a[c], a[i]) && break
            a[c], a[i] = a[i], a[c]; i = c
        end
    end
    return result
end
entry_less(a, b) = isless((a[1], a[2]), (b[1], b[2]))
# Integer trace keys use h(k)=k; native hashing for other hashable values.
hash_index(key, m) = key isa Integer ? mod(key, m) + 1 : Int(mod(hash(key), UInt(m))) + 1

# topics/kd-trees/spatial-queries.md
shared_points = [(5,4),(2,7),(8,1),(1,3),(3,6),(7,5),(9,2)]
shared_query = (1,2,4,7)
function checked_rect(rect)
    (length(rect)==4 && all(isfinite,rect)) || throw(ArgumentError("four finite coordinates required"))
    (rect[1]<=rect[3] && rect[2]<=rect[4]) || throw(ArgumentError("reversed bounds"))
    return Tuple(rect)
end
function in_closed_rect(point,rect)
    x,y=point; xmin,ymin,xmax,ymax=rect
    return xmin<=x<=xmax && ymin<=y<=ymax
end
function scan_range(points,rect)
    rect=checked_rect(rect); return [p for p in points if in_closed_rect(p,rect)]
end

# topics/kd-trees/kd-construction.md
mutable struct KDNode
    point
    left
    right
end
KDNode(point)=KDNode(point,nothing,nothing)
function kd_insert(node,point,depth=0)
    node===nothing && return KDNode(point)
    point==node.point && return node
    axis=mod(depth,2)+1
    if point[axis]<node.point[axis]; node.left=kd_insert(node.left,point,depth+1)
    else; node.right=kd_insert(node.right,point,depth+1); end
    return node
end
points=[(5,4),(2,7),(8,1),(1,3),(3,6),(7,5),(9,2)]
root=let tree=nothing
    for point in points; tree=kd_insert(tree,point); end
    tree
end

# topics/kd-trees/kd-exact-search.md
function kd_search(node,point,depth=0)
    while node!==nothing
        point==node.point && return node
        axis=mod(depth,2)+1
        node=point[axis]<node.point[axis] ? node.left : node.right
        depth+=1
    end
    return nothing
end

# topics/kd-trees/kd-range-search.md
function kd_range(root,low,high)
    any(low[i]>high[i] for i in 1:2) && throw(ArgumentError("reversed bounds"))
    out=Any[]
    function visit(node,depth)
        node===nothing && return
        p=node.point; axis=mod(depth,2)+1
        all(low[i]<=p[i]<=high[i] for i in 1:2) && push!(out,p)
        low[axis]<p[axis] && visit(node.left,depth+1)
        high[axis]>=p[axis] && visit(node.right,depth+1)
    end
    visit(root,0); return out
end

# topics/kd-trees/kd-nearest.md
function kd_nearest(root,query)
    best_point=nothing; best_d2=Inf
    function visit(node,depth)
        node===nothing && return
        p=node.point; d2=sum((p[i]-query[i])^2 for i in 1:2)
        if best_point===nothing || d2<best_d2; best_point=p; best_d2=d2; end
        axis=mod(depth,2)+1; delta=query[axis]-p[axis]
        near,far=delta<0 ? (node.left,node.right) : (node.right,node.left)
        visit(near,depth+1)
        delta^2<=best_d2 && visit(far,depth+1)
    end
    visit(root,0); return best_point
end

# topics/kd-trees/kd-updates-costs.md
function kd_axis_min(node,axis,depth)
    node===nothing && return nothing
    if mod(depth,2)+1==axis
        return node.left===nothing ? node.point : kd_axis_min(node.left,axis,depth+1)
    end
    candidates=Any[node.point]
    for child in (node.left,node.right)
        point=kd_axis_min(child,axis,depth+1); point!==nothing && push!(candidates,point)
    end
    return reduce((a,b)->b[axis]<a[axis] ? b : a,candidates)
end
function kd_delete(node,point,depth=0)
    node===nothing && return nothing
    axis=mod(depth,2)+1
    if point==node.point
        if node.right!==nothing
            replacement=kd_axis_min(node.right,axis,depth+1)
            node.point=replacement; node.right=kd_delete(node.right,replacement,depth+1)
        elseif node.left!==nothing
            replacement=kd_axis_min(node.left,axis,depth+1)
            node.point=replacement; node.right=kd_delete(node.left,replacement,depth+1); node.left=nothing
        else; return nothing; end
    elseif point[axis]<node.point[axis]; node.left=kd_delete(node.left,point,depth+1)
    else; node.right=kd_delete(node.right,point,depth+1); end
    return node
end

# topics/kd-trees/point-quadtrees.md
point_quadrant(point,pivot)=1+Int(point[1]>=pivot[1])+2Int(point[2]>=pivot[2])
mutable struct PointQuadNode
    point
    children::Vector{Any}
end
PointQuadNode(point)=PointQuadNode(point,Any[nothing for _ in 1:4])
function point_quad_insert(root,point)
    root===nothing && return PointQuadNode(point)
    node=root
    while true
        point==node.point && return root
        q=point_quadrant(point,node.point); child=node.children[q]
        if child===nothing; node.children[q]=PointQuadNode(point); return root; end
        node=child
    end
end
function point_quad_contains(root,point)
    node=root
    while node!==nothing
        point==node.point && return true
        node=node.children[point_quadrant(point,node.point)]
    end
    return false
end
point_root=let tree=nothing
    for point in shared_points; tree=point_quad_insert(tree,point); end
    tree
end

# topics/kd-trees/point-quadtrees.md
function point_quad_range(root,rect)
    rect=checked_rect(rect); xmin,ymin,xmax,ymax=rect
    out=Any[]; stack=root===nothing ? Any[] : Any[root]
    while !isempty(stack)
        node=pop!(stack); x,y=node.point
        in_closed_rect(node.point,rect) && push!(out,node.point)
        west,east=xmin<x,xmax>=x; south,north=ymin<y,ymax>=y
        possible=(west&&south,east&&south,west&&north,east&&north)
        for i in 4:-1:1
            possible[i] && node.children[i]!==nothing && push!(stack,node.children[i])
        end
    end
    return out
end

# topics/kd-trees/point-quadtree-updates.md
function box_distance2(query,bounds)
    xmin,ymin,xmax,ymax=bounds
    dx=max(xmin-query[1],0,query[1]-xmax); dy=max(ymin-query[2],0,query[2]-ymax)
    return dx^2+dy^2
end
function point_quad_cells(bounds,pivot)
    xmin,ymin,xmax,ymax=bounds; x,y=pivot
    return ((xmin,ymin,x,y),(x,ymin,xmax,y),(xmin,y,x,ymax),(x,y,xmax,ymax))
end

# topics/kd-trees/point-quadtree-updates.md
function point_quad_nearest(root,query)
    best=nothing; best_d2=Inf
    stack=root===nothing ? Any[] : Any[(root,(-Inf,-Inf,Inf,Inf))]
    while !isempty(stack)
        node,bounds=pop!(stack); box_distance2(query,bounds)>best_d2 && continue
        d2=sum((node.point[i]-query[i])^2 for i in 1:2)
        if best===nothing || d2<best_d2; best=node.point; best_d2=d2; end
        cells=point_quad_cells(bounds,node.point)
        children=Any[(child,cell) for (child,cell) in zip(node.children,cells) if child!==nothing]
        sort!(children;by=p->box_distance2(query,p[2]),rev=true,alg=MergeSort)
        append!(stack,children)
    end
    return best
end

# topics/kd-trees/point-quadtree-updates.md
function point_quad_delete(root,point)
    parent=nothing; branch=nothing; node=root
    while node!==nothing && node.point!=point
        parent=node; branch=point_quadrant(point,node.point); node=node.children[branch]
    end
    node===nothing && return root
    survivors=Any[]; stack=Any[node]
    while !isempty(stack)
        current=pop!(stack); current.point!=point && push!(survivors,current.point)
        append!(stack,(c for c in Iterators.reverse(current.children) if c!==nothing))
    end
    replacement=nothing
    for survivor in survivors; replacement=point_quad_insert(replacement,survivor); end
    parent===nothing && return replacement
    parent.children[branch]=replacement; return root
end

# topics/kd-trees/pr-quadtree-operations.md
function in_half_open_cell(point,cell)
    x,y=point; xmin,ymin,xmax,ymax=cell
    return xmin<=x<xmax && ymin<=y<ymax
end
function cell_query_overlap(cell,query)
    xmin,ymin,xmax,ymax=cell; a,b,c,d=query
    return c>=xmin && a<xmax && d>=ymin && b<ymax
end
function midpoint_cells(cell)
    xmin,ymin,xmax,ymax=cell; mx=xmin/2+xmax/2; my=ymin/2+ymax/2
    (xmin<mx<xmax && ymin<my<ymax) || return nothing
    return ((xmin,ymin,mx,my),(mx,ymin,xmax,my),(xmin,my,mx,ymax),(mx,my,xmax,ymax))
end
mutable struct PRNode
    bounds
    points::Vector{Any}
    children
end
PRNode(bounds)=PRNode(bounds,Any[],nothing)

# topics/kd-trees/pr-quadtree-operations.md
mutable struct PRQuadTree
    root::PRNode
    capacity::Int
    max_depth::Int
    members::Set{Any}
end
function PRQuadTree(bounds,capacity=1,max_depth=16)
    bounds=checked_rect(bounds)
    (bounds[1]<bounds[3] && bounds[2]<bounds[4]) || throw(ArgumentError("positive extent required"))
    (capacity isa Int && capacity>=1 && max_depth isa Int && max_depth>=0) || throw(ArgumentError("invalid capacity/depth"))
    return PRQuadTree(PRNode(bounds),capacity,max_depth,Set{Any}())
end
function pr_insert!(tree::PRQuadTree,point)
    in_half_open_cell(point,tree.root.bounds) || throw(ArgumentError("point outside extent"))
    point in tree.members && return false
    pending=Any[(tree.root,point,0)]
    while !isempty(pending)
        node,p,depth=pop!(pending)
        if node.children!==nothing
            pivot=(node.children[1].bounds[3],node.children[1].bounds[4])
            push!(pending,(node.children[point_quadrant(p,pivot)],p,depth+1)); continue
        end
        subdivisions=midpoint_cells(node.bounds)
        if length(node.points)<tree.capacity || depth>=tree.max_depth || subdivisions===nothing
            push!(node.points,p); continue
        end
        records=copy(node.points); push!(records,p); node.points=Any[]
        node.children=[PRNode(cell) for cell in subdivisions]
        pivot=(subdivisions[1][3],subdivisions[1][4])
        for old in records; push!(pending,(node.children[point_quadrant(old,pivot)],old,depth+1)); end
    end
    push!(tree.members,point); return true
end
function pr_contains(tree::PRQuadTree,point)
    in_half_open_cell(point,tree.root.bounds) || return false
    node=tree.root
    while node.children!==nothing
        pivot=(node.children[1].bounds[3],node.children[1].bounds[4])
        node=node.children[point_quadrant(point,pivot)]
    end
    return point in node.points
end
function pr_range(tree::PRQuadTree,rect)
    rect=checked_rect(rect); out=Any[]; stack=Any[tree.root]
    while !isempty(stack)
        node=pop!(stack); cell_query_overlap(node.bounds,rect) || continue
        if node.children===nothing
            append!(out,(p for p in node.points if in_closed_rect(p,rect)))
        else; append!(stack,reverse(node.children)); end
    end
    return out
end
pr_tree=PRQuadTree((0,0,12,12),1)
for point in shared_points; pr_insert!(pr_tree,point); end

# topics/kd-trees/pr-quadtree-updates.md
function pr_nearest(tree,query)
    best=nothing; best_d2=Inf; stack=Any[tree.root]
    while !isempty(stack)
        node=pop!(stack); box_distance2(query,node.bounds)>best_d2 && continue
        if node.children===nothing
            for point in node.points
                d2=sum((point[i]-query[i])^2 for i in 1:2)
                if best===nothing || d2<best_d2; best=point; best_d2=d2; end
            end
        else
            append!(stack,sort(collect(node.children);by=c->box_distance2(query,c.bounds),rev=true,alg=MergeSort))
        end
    end
    return best
end

# topics/kd-trees/pr-quadtree-updates.md
function pr_delete!(tree,point)
    point in tree.members || return false
    node=tree.root; path=Any[]
    while node.children!==nothing
        push!(path,node); pivot=(node.children[1].bounds[3],node.children[1].bounds[4])
        node=node.children[point_quadrant(point,pivot)]
    end
    deleteat!(node.points,findfirst(==(point),node.points)); delete!(tree.members,point)
    for parent in Iterators.reverse(path)
        children=parent.children
        any(c.children!==nothing for c in children) && break
        sum(length(c.points) for c in children)>tree.capacity && break
        parent.points=Any[p for c in children for p in c.points]; parent.children=nothing
    end
    return true
end

# topics/kd-trees/r-tree-representation.md
segments=Dict("L1"=>((0,0),(10,10)),"L2"=>((0,7),(6,7)),"L3"=>((8,0),(10,2)),
    "L4"=>((3,5),(3,9)),"L5"=>((5,6),(9,8)))
line_query=(2,6,4,8)
function segment_bounds(segment)
    a,b=segment; return (min(a[1],b[1]),min(a[2],b[2]),max(a[1],b[1]),max(a[2],b[2]))
end
function enclosing_bounds(boxes)
    boxes=collect(boxes)
    return (minimum(b[1] for b in boxes),minimum(b[2] for b in boxes),
        maximum(b[3] for b in boxes),maximum(b[4] for b in boxes))
end
struct RNode
    entries::Vector{Any}
    leaf::Bool
end
RNode(entries,leaf)=RNode(Any[entries...],leaf)
line_boxes=Dict(k=>segment_bounds(v) for (k,v) in segments)
group_u=RNode([(line_boxes[k],k) for k in ["L1","L2"]],true)
group_v=RNode([(line_boxes[k],k) for k in ["L3","L4","L5"]],true)
r_root=RNode([(enclosing_bounds(b for (b,_) in group_u.entries),group_u),
    (enclosing_bounds(b for (b,_) in group_v.entries),group_v)],false)

# topics/kd-trees/r-tree-queries.md
closed_boxes_overlap(a,b)=a[1]<=b[3] && b[1]<=a[3] && a[2]<=b[4] && b[2]<=a[4]
function rtree_candidates(root,rect)
    rect=checked_rect(rect); out=Any[]; stack=Any[root]
    while !isempty(stack)
        node=pop!(stack)
        for (box,item) in node.entries
            closed_boxes_overlap(box,rect) || continue
            push!(node.leaf ? out : stack,item)
        end
    end
    return out
end

# topics/kd-trees/r-tree-queries.md
function orientation(a,b,c)
    return (big(b[1])-a[1])*(big(c[2])-a[2])-(big(b[2])-a[2])*(big(c[1])-a[1])
end
on_segment(a,b,p)=orientation(a,b,p)==0 && in_closed_rect(p,segment_bounds((a,b)))
function segments_intersect(a,b,c,d)
    x,y,z,w=orientation(a,b,c),orientation(a,b,d),orientation(c,d,a),orientation(c,d,b)
    ((x<0<y || y<0<x) && (z<0<w || w<0<z)) && return true
    return (x==0&&on_segment(a,b,c))||(y==0&&on_segment(a,b,d))||(z==0&&on_segment(c,d,a))||(w==0&&on_segment(c,d,b))
end
function segment_intersects_rect(segment,rect)
    rect=checked_rect(rect); a,b=segment
    (in_closed_rect(a,rect)||in_closed_rect(b,rect)) && return true
    xmin,ymin,xmax,ymax=rect; corners=[(xmin,ymin),(xmax,ymin),(xmax,ymax),(xmin,ymax)]
    return any(segments_intersect(a,b,corners[i],corners[mod(i,4)+1]) for i in 1:4)
end
candidates=rtree_candidates(r_root,line_query)
line_matches=[key for key in candidates if segment_intersects_rect(segments[key],line_query)]

# topics/kd-trees/r-tree-operations.md
function rtree_exact_segment(root,query_segment,records)
    candidates=rtree_candidates(root,segment_bounds(query_segment)); a,b=query_segment
    return [key for key in candidates if records[key]==(a,b) || records[key]==(b,a)]
end

# topics/kd-trees/r-tree-operations.md
function point_segment_distance2(query,segment)
    a,b=segment; dx,dy=b[1]-a[1],b[2]-a[2]; length2=dx^2+dy^2
    t=length2==0 ? 0 : clamp(((query[1]-a[1])*dx+(query[2]-a[2])*dy)/length2,0,1)
    return (query[1]-(a[1]+t*dx))^2+(query[2]-(a[2]+t*dy))^2
end
function rtree_nearest(root,query,records)
    serial=0; best=nothing; best_d2=Inf; pending=MinHeap(entry_less)
    function enqueue(node)
        for (box,item) in node.entries
            bound=box_distance2(query,box)
            if bound<=best_d2; heap_push!(pending,(bound,serial,node.leaf,item)); serial+=1; end
        end
    end
    enqueue(root)
    while !isempty(pending.data)
        bound,sequence,is_record,item=heap_pop!(pending); bound>best_d2 && break
        if is_record
            d2=point_segment_distance2(query,records[item])
            if best===nothing || d2<best_d2; best=item; best_d2=d2; end
        else; enqueue(item); end
    end
    return best
end
