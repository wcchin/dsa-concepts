"""Independent fixtures and behavioural checks for the translated teaching code."""
import itertools
import json
from fractions import Fraction


def jl(value):
    if value is None: return 'nothing'
    if value is True: return 'true'
    if value is False: return 'false'
    if isinstance(value,str): return json.dumps(value,ensure_ascii=False)
    if isinstance(value,tuple): return '('+','.join(map(jl,value))+(',' if len(value)==1 else '')+')'
    if isinstance(value,list): return '['+','.join(map(jl,value))+']'
    return str(value)


def literals(name, value):
    return ('const '+name+'='+json.dumps(value,ensure_ascii=False)+';\n',name+'='+jl(value)+'\n')


def cases():
    out={}
    arrays=[list(a) for n in range(6) for a in itertools.product([-2,0,2],repeat=n)]
    a,b=literals('samples',arrays)
    out['foundations']=('''
check(find_stop(["KR","MUS","MUS"],"MUS")===1);
check(find_stop([],"X")===null);
const shared=["A"], alias=shared; extend_route(shared); check(alias===shared && shared.length===2);
const saved=shared.slice(); replace_route(shared); check(JSON.stringify(shared)===JSON.stringify(saved));
check(add_stop("A")!==add_stop("A"));
const s=new ShuttleStop("A","A"); s.board(2); s.alight(); check(s._passengers===1);
rejects(()=>s.board(true)); rejects(()=>s.alight(2)); check(s._passengers===1);
''','''
check(find_stop(["KR","MUS","MUS"],"MUS")==2)
check(find_stop([],"X")===nothing)
shared=["A"]; alias=shared; extend_route(shared); check(alias===shared && length(shared)==2)
saved=copy(shared); replace_route(shared); check(shared==saved)
check(add_stop("A")!==add_stop("A"))
s=ShuttleStop("A","A"); board!(s,2); alight!(s); check(s.passengers==1)
rejects(()->board!(s,true)); rejects(()->alight!(s,2)); check(s.passengers==1)
''')
    out['analysis']=('''
for(let n=0;n<100;n++) {
 check(JSON.stringify(count_pairs(n))===JSON.stringify([n*n,n*(n-1)/2]));
 check(count_two_passes(Array(n).fill(0))===2*n);
 check(visit_count(Array(n).fill(0))===n);
 if(n>0)check(halving_steps(n)===Math.floor(Math.log2(n)));
}
for(let t=0;t<6;t++){const r=contains_with_count([0,1,2,3],t);check(r[0]===(t<4));check(r[1]===(t<4?t+1:4));}
const x=[{}], y=copy_values(x);check(y!==x&&y[0]===x[0]);
''','''
for n in 0:99
 check(count_pairs(n)==(n*n,div(n*(n-1),2)))
 check(count_two_passes(fill(0,n))==2n);check(visit_count(fill(0,n))==n)
 n>0 && check(halving_steps(n)==floor(Int,log2(n)))
end
for t in 0:5
 r=contains_with_count([0,1,2,3],t);check(r[1]==(t<4));check(r[2]==(t<4 ? t+1 : 4))
end
x=[Ref(0)];y=copy_values(x);check(y!==x&&y[1]===x[1])
''')
    out['recursion']=(a+'''
for(let n=0;n<=40;n++){check(sum_to(n)===n*(n+1)/2);check(sum_to_iterative(n)===sum_to(n));}
rejects(()=>sum_to(-1));rejects(()=>sum_to(true));
for(const values of samples){const original=values.slice(), sorted=merge_sort(values);check(JSON.stringify(sorted)===JSON.stringify(values.slice().sort((a,b)=>a-b)));check(JSON.stringify(values)===JSON.stringify(original));check(sorted!==values);}
''',b+'''
for n in 0:40;check(sum_to(n)==div(n*(n+1),2));check(sum_to_iterative(n)==sum_to(n));end
rejects(()->sum_to(-1));rejects(()->sum_to(true))
for values in samples
 original=copy(values);sorted=merge_sort(values)
 check(sorted==sort(values));check(values==original);check(sorted!==values)
end
''')
    out['sorting']=(a+'''
for(const input of samples){
 const expected=input.slice().sort((a,b)=>a-b);
 for(const sort of [insertion_sort,bubble_sort,quicksort]){const v=input.slice();check(sort(v)===undefined);check(JSON.stringify(v)===JSON.stringify(expected));}
 const v=input.slice();check(JSON.stringify(merge_sort(v))===JSON.stringify(expected));check(JSON.stringify(v)===JSON.stringify(input));
 for(let lo=0;lo<input.length;lo++){let w=input.slice(), hi=input.length-1,pivot=w[hi],p=partition(w,lo,hi);check(w[p]===pivot);check(w.slice(lo,p).every(x=>x<=pivot));check(w.slice(p+1,hi+1).every(x=>x>pivot));check(JSON.stringify(w.slice(0,lo))===JSON.stringify(input.slice(0,lo)));}
}
for(const sort of [insertion_sort,bubble_sort,merge_sort]) {
 const rows=[{key:2,id:0,valueOf(){return this.key}},{key:1,id:1,valueOf(){return this.key}},{key:2,id:2,valueOf(){return this.key}}];
 const answer=sort===merge_sort?sort(rows): (sort(rows),rows);check(answer.map(x=>x.id).join()==="1,0,2");
}
''',b+'''
for input in samples
 expected=sort(input)
 for f in (insertion_sort!,bubble_sort!,quicksort!)
  v=copy(input);check(f(v)===nothing);check(v==expected)
 end
 v=copy(input);check(merge_sort(v)==expected);check(v==input)
 for lo in 1:length(input)
  w=copy(input);hi=length(w);pivot=w[hi];p=partition!(w,lo,hi)
  check(w[p]==pivot);check(all(x<=pivot for x in w[lo:p-1]));check(all(x>pivot for x in w[p+1:hi]));check(w[1:lo-1]==input[1:lo-1])
 end
end
for f in (insertion_sort!,bubble_sort!,merge_sort)
 rows=[TestRecord(2,0),TestRecord(1,1),TestRecord(2,2)]
 answer=f===merge_sort ? f(rows) : (f(rows);rows)
 check([x.tag for x in answer]==[1,0,2])
end
''')
    out['linear-structures']=('''
for(const Type of [Queue,LinkedQueue]) {
 const q=new Type(), ref=[];
 for(let i=0;i<300;i++){q.enqueue(i);ref.push(i);if(i%3===0)check(q.dequeue()===ref.shift());check(q.size()===ref.length);if(ref.length)check(q.front()===ref[0]);}
 while(ref.length)check(q.dequeue()===ref.shift());check(q.is_empty());rejects(()=>q.dequeue());rejects(()=>q.front());
 q.enqueue(null);check(q.dequeue()===null);check(q.is_empty());
}
const cq=new CircularQueue(3);for(let i=0;i<100;i++){cq.enqueue(i);cq.enqueue(null);check(cq.dequeue()===i);check(cq.dequeue()===null);}
for(let i=0;i<3;i++)cq.enqueue(i);rejects(()=>cq.enqueue(4));check(cq.size()===3);
const s=new Stack();rejects(()=>s.pop());for(let i=0;i<100;i++)s.push(i);for(let i=99;i>=0;i--)check(s.pop()===i);
const d=new Deque();d.add_first(null);d.add_last(2);d.add_first(1);check(d.remove_first()===1);check(d.remove_last()===2);check(d.remove_first()===null);rejects(()=>d.peek_first());
const seq=new ArraySequence([1,2]);seq.insert(2,3);seq.set(0,4);check(seq.remove_at(1)===2);check(seq.size()===2);check(seq.get(1)===3);rejects(()=>seq.get(-1));rejects(()=>seq.get(true));rejects(()=>seq.insert(4,0));
for(const [text,ok] of [["([{}])",true],["([)]",false],["",true],["]",false]])check(brackets_balanced(text)===ok);
check(is_palindrome("😀a😀"));check(!is_palindrome("abc"));
''','''
for T in (Queue,LinkedQueue)
 q=T();ref=Any[]
 for i in 0:299
  enqueue!(q,i);push!(ref,i)
  i%3==0 && check(dequeue!(q)==popfirst!(ref))
  check(length(q)==length(ref));!isempty(ref) && check(queue_front(q)==ref[1])
 end
 while !isempty(ref);check(dequeue!(q)==popfirst!(ref));end
 check(isempty(q));rejects(()->dequeue!(q));rejects(()->queue_front(q))
 enqueue!(q,nothing);check(dequeue!(q)===nothing);check(isempty(q))
end
cq=CircularQueue(3)
for i in 0:99;enqueue!(cq,i);enqueue!(cq,nothing);check(dequeue!(cq)==i);check(dequeue!(cq)===nothing);end
for i in 0:2;enqueue!(cq,i);end
rejects(()->enqueue!(cq,4));check(length(cq)==3)
s=Stack();rejects(()->stack_pop!(s));for i in 0:99;stack_push!(s,i);end
for i in 99:-1:0;check(stack_pop!(s)==i);end
d=Deque();add_first!(d,nothing);add_last!(d,2);add_first!(d,1)
check(remove_first!(d)==1);check(remove_last!(d)==2);check(remove_first!(d)===nothing);rejects(()->peek_first(d))
seq=ArraySequence([1,2]);insert_at!(seq,3,3);set_at!(seq,1,4);check(remove_at!(seq,2)==2)
check(length(seq)==2);check(get_at(seq,2)==3);rejects(()->get_at(seq,0));rejects(()->get_at(seq,true));rejects(()->insert_at!(seq,5,0))
for (text,ok) in [("([{}])",true),("([)]",false),("",true),("]",false)];check(brackets_balanced(text)==ok);end
check(is_palindrome("😀a😀"));check(!is_palindrome("abc"))
''')
    out['maps-sets-hashing']=('''
const m=new HashMap();m.put("a",null);check(m.contains_key("a"));check(m.remove("a")===null);rejects(()=>m.get("a"));
const set=new HashSet([1,2,1]);check(set.size()===2);set.discard(9);rejects(()=>set.remove(9));check(set.union(new HashSet([2,3])).size()===3);check(set.intersection(new HashSet([2,3])).contains(2));
let chain=Array.from({length:7},()=>[]), probe=Array(7).fill(EMPTY);
for(const tableKind of [0,1]){
 let table=tableKind?probe:chain; const put=tableKind?put_probed:put_chained,get=tableKind?get_probed:get_chained,remove=tableKind?remove_probed:remove_chained;
 for(const k of [-7,0,7,14,21])check(put(table,k,k+1));
 check(!put(table,7,null));check(get(table,7)===null);check(remove(table,0)===1);rejects(()=>get(table,0));check(get(table,14)===15);
 table=tableKind?rebuild_probed(table,13):rebuild_chained(table,13);for(const k of [-7,7,14,21])check(get(table,k)===(k===7?null:k+1));
}
probe=Array(2).fill(EMPTY);put_probed(probe,0,"a");put_probed(probe,2,"b");rejects(()=>put_probed(probe,4,"c"));remove_probed(probe,0);check(put_probed(probe,4,"c"));check(get_probed(probe,2)==="b");
''','''
m=HashMap();put!(m,"a",nothing);check(contains_key(m,"a"));check(remove!(m,"a")===nothing);rejects(()->get_value(m,"a"))
s=HashSet([1,2,1]);check(length(s)==2);discard!(s,9);rejects(()->remove!(s,9));check(length(set_union(s,HashSet([2,3])))==3);check(contains_item(set_intersection(s,HashSet([2,3])),2))
for kind in 0:1
 table=kind==1 ? Any[EMPTY for _ in 1:7] : [Any[] for _ in 1:7]
 putter=kind==1 ? put_probed! : put_chained!;getter=kind==1 ? get_probed : get_chained;remover=kind==1 ? remove_probed! : remove_chained!
 for k in [-7,0,7,14,21];check(putter(table,k,k+1));end
 check(!putter(table,7,nothing));check(getter(table,7)===nothing);check(remover(table,0)==1);rejects(()->getter(table,0));check(getter(table,14)==15)
 table=kind==1 ? rebuild_probed(table,13) : rebuild_chained(table,13)
 for k in [-7,7,14,21];check(isequal(getter(table,k),k==7 ? nothing : k+1));end
end
probe=Any[EMPTY,EMPTY];put_probed!(probe,0,"a");put_probed!(probe,2,"b");rejects(()->put_probed!(probe,4,"c"));remove_probed!(probe,0);check(put_probed!(probe,4,"c"));check(get_probed(probe,2)=="b")
''')
    permutations=[list(p) for p in itertools.permutations(range(1,6))]
    a,b=literals('orders',permutations)
    search_js=a+'''
for(const order of orders){const s=new OrderedSet(INSERT,DELETE);
 for(const k of order){s.add(k);s.add(k);}check(s.size()===5);check(s.keys().join()==="1,2,3,4,5");check(s.range_keys(2,4).join()==="2,3,4");check(s.successor(2.5)===3);check(s.predecessor(2.5)===2);
 for(const k of order){s.remove(k);check(!s.contains(k));VALIDATE(s._root,-Infinity,Infinity);}
 check(s.is_empty());rejects(()=>s.extract_min());rejects(()=>s.remove(1));}
for(const v of [[],[1],[1,1,2,3],[1,2,3,4]])for(let t=0;t<=5;t++){
 const lb=v.filter(x=>x<t).length,ub=v.filter(x=>x<=t).length;check(lower_bound(v,t)===lb);check(upper_bound(v,t)===ub);
 const p=binary_search(v,t);check(p===null?!v.includes(t):v[p]===t);
}
'''
    search_jl=b+'''
for order in orders
 s=OrderedSet(INSERT,DELETE)
 for k in order;add!(s,k);add!(s,k);end
 check(length(s)==5);check(ordered_keys(s)==[1,2,3,4,5]);check(range_keys(s,2,4)==[2,3,4]);check(successor(s,2.5)==3);check(predecessor(s,2.5)==2)
 for k in order;remove!(s,k);check(!contains_key(s,k));VALIDATE(s.root,-Inf,Inf);end
 check(isempty(s));rejects(()->extract_min!(s));rejects(()->remove!(s,1))
end
for v in [Int[],[1],[1,1,2,3],[1,2,3,4]],t in 0:5
 check(lower_bound(v,t)==count(x->x<t,v)+1);check(upper_bound(v,t)==count(x->x<=t,v)+1)
 p=binary_search(v,t);check(p===nothing ? !(t in v) : v[p]==t)
end
'''
    for name,ins,delete in [('searching','bst_insert','bst_delete'),('balanced-trees','avl_insert','avl_delete')]:
        j=search_js.replace('INSERT',ins).replace('DELETE',delete)
        l=search_jl.replace('INSERT',ins).replace('DELETE',delete)
        check_js='''function VALIDATE(node,lo,hi){if(node===null)return -1;check(lo<node.key&&node.key<hi);const a=VALIDATE(node.left,lo,node.key),b=VALIDATE(node.right,node.key,hi);CHECKHEIGHT;return 1+Math.max(a,b);}'''
        check_jl='''function VALIDATE(node,lo,hi)
 node===nothing && return -1
 check(lo<node.key<hi);a=VALIDATE(node.left,lo,node.key);b=VALIDATE(node.right,node.key,hi)
 CHECKHEIGHT
 return 1+max(a,b)
end
'''
        out[name]=(check_js.replace('CHECKHEIGHT','check(node.height===1+Math.max(a,b));check(Math.abs(a-b)<=1)' if name=='balanced-trees' else '')+j,check_jl.replace('CHECKHEIGHT','check(node.height==1+max(a,b));check(abs(a-b)<=1)' if name=='balanced-trees' else '')+l)
    a,b=literals('samples',arrays)
    out['heaps']=(a+'''
for(const input of samples){const saved=input.slice(),h=build_min_heap(input),ref=saved.slice().sort((a,b)=>a-b);check(JSON.stringify(input)===JSON.stringify(saved));for(const x of ref)check(pop_min(h)===x);rejects(()=>pop_min(h));const v=input.slice();check(heapsort(v)===undefined);check(JSON.stringify(v)===JSON.stringify(ref));}
const p=new MinPriorityQueue();p.insert("first",2);p.insert(null,1);p.insert("second",2);check(p.remove_min()===null);check(p.remove_min()==="first");check(p.remove_min()==="second");rejects(()=>p.peek_min());
const q=new MaxPriorityQueue();q.insert("a",1);q.insert("b",4);q.insert("c",4);check(q.remove_max()==="b");check(q.remove_max()==="c");
''',b+'''
for input in samples
 h=build_min_heap(input);ref=sort(input)
 for x in ref;check(pop_min!(h)==x);end
 rejects(()->pop_min!(h));v=copy(input);check(heapsort!(v)===nothing);check(v==ref)
end
p=MinPriorityQueue();pq_insert!(p,"first",2);pq_insert!(p,nothing,1);pq_insert!(p,"second",2)
check(remove_min!(p)===nothing);check(remove_min!(p)=="first");check(remove_min!(p)=="second");rejects(()->peek_min(p))
q=MaxPriorityQueue();pq_insert!(q,"a",1);pq_insert!(q,"b",4);pq_insert!(q,"c",4);check(remove_max!(q)=="b");check(remove_max!(q)=="c")
''')
    out.update(extra_cases())
    return out


def extra_cases():
    out={}
    pairs=list(itertools.combinations(range(4),2))
    graphs=[];forests=[]
    for mask in range(64):
        edges=[(u,v) for i,(u,v) in enumerate(pairs) if mask>>i&1]
        dist=[[0 if i==j else 99 for j in range(4)] for i in range(4)]
        for u,v in edges:dist[u][v]=dist[v][u]=1
        for k in range(4):
            for i in range(4):
                for j in range(4):dist[i][j]=min(dist[i][j],dist[i][k]+dist[k][j])
        dist=[[d if d<99 else -1 for d in row] for row in dist]
        components=len({tuple(d>=0 for d in row) for row in dist})
        graphs.append([edges,dist,components])
        weighted=[(i%4-1,u,v) for i,(u,v) in enumerate(edges)]
        best=10**6
        for chosen in itertools.combinations(weighted,4-components):
            reach=[{i} for i in range(4)]
            for w,u,v in chosen:
                joined=reach[u]|reach[v]
                for x in joined:reach[x]=joined
            if len({tuple(sorted(r)) for r in reach})==components:best=min(best,sum(w for w,u,v in chosen))
        forests.append([weighted,best,components])
    a,b=literals('fixtures',graphs)
    out['union-find']=(a+'''
for(const [edges,dist,count] of fixtures){const s=new DisjointSet(4);for(const [u,v] of edges)s.union(u,v);check(s.component_count()===count);for(let u=0;u<4;u++){check(s.component_size(u)===dist[u].filter(d=>d>=0).length);for(let v=0;v<4;v++)check(s.connected(u,v)===(dist[u][v]>=0));}for(const [u,v] of edges)check(s.union(u,v)===false);}
const e=new DisjointSet(0);check(e.is_empty());rejects(()=>e.find(0));rejects(()=>new DisjointSet(-1));rejects(()=>new DisjointSet(true));
''',b+'''
for (edges,dist,count) in fixtures
 s=DisjointSet(4);for (u,v) in edges;union_sets!(s,u+1,v+1);end
 check(component_count(s)==count)
 for u in 1:4
  check(component_size(s,u)==Base.count(d->d>=0,dist[u]))
  for v in 1:4;check(connected(s,u,v)==(dist[u][v]>=0));end
 end
 for (u,v) in edges;check(!union_sets!(s,u+1,v+1));end
end
e=DisjointSet(0);check(isempty(e));rejects(()->find_set!(e,1));rejects(()->DisjointSet(-1));rejects(()->DisjointSet(true))
''')
    out['graphs']=(a+'''
const labels=["A","B","C","D"];
for(const [edges,dist,count] of fixtures){const g=build_graph(labels,edges.map(([u,v])=>[labels[u],labels[v]]));check(edge_count(g)===edges.length);check(connected_components(g).length===count);
 for(let s=0;s<4;s++){const [order,parent,d]=bfs(g,labels[s]),[discovery,finish,dp]=dfs(g,labels[s]);check(new Set(order).size===order.length);check(discovery.length===order.length&&finish.length===order.length);
 for(let t=0;t<4;t++){check((d.get(labels[t])??-1)===dist[s][t]);const p=path_to(parent,labels[t]);if(dist[s][t]<0)check(p===null);else {check(p.length===dist[s][t]+1);check(p[0]===labels[s]&&p.at(-1)===labels[t]);for(let i=1;i<p.length;i++)check(has_edge(g,p[i-1],p[i]));}}
 }rejects(()=>bfs(g,"X"));}
const g=build_graph(labels,[["A","B"]]);const ns=neighbours(g,"A");ns.length=0;check(has_edge(g,"A","B"));add_edge(g,"A","B");check(edge_count(g)===1);remove_vertex(g,"B");check(vertex_count(g)===3&&edge_count(g)===0);rejects(()=>add_edge(g,"A","X"));rejects(()=>add_edge(g,"A","A"));
''',b+'''
labels=["A","B","C","D"]
for (edges,dist,count) in fixtures
 g=build_graph(labels,[(labels[u+1],labels[v+1]) for (u,v) in edges]);check(edge_count(g)==length(edges));check(length(connected_components(g))==count)
 for s in 1:4
  order,parent,d=bfs(g,labels[s]);discovery,finish,dp=dfs(g,labels[s]);check(length(Set(order))==length(order));check(length(discovery)==length(order)==length(finish))
  for t in 1:4
   check(get(d,labels[t],-1)==dist[s][t]);p=path_to(parent,labels[t])
   if dist[s][t]<0;check(p===nothing)
   else
    check(length(p)==dist[s][t]+1);check(first(p)==labels[s]&&last(p)==labels[t]);for i in 2:length(p);check(has_edge(g,p[i-1],p[i]));end
   end
  end
 end
 rejects(()->bfs(g,"X"))
end
g=build_graph(labels,[("A","B")]);ns=neighbours(g,"A");empty!(ns);check(has_edge(g,"A","B"));add_edge!(g,"A","B");check(edge_count(g)==1);remove_vertex!(g,"B");check(vertex_count(g)==3&&edge_count(g)==0);rejects(()->add_edge!(g,"A","X"));rejects(()->add_edge!(g,"A","A"))
''')
    c,d=literals('forests',forests)
    out['graph-algorithms']=(a+c+'''
const labels=["A","B","C","D"];
for(const [edges,dist,count] of fixtures){const g=new Map(labels.map(v=>[v,[]]));for(const [u,v] of edges){g.get(labels[u]).push([labels[v],1]);g.get(labels[v]).push([labels[u],1]);}
 for(let s=0;s<4;s++){const [ds,ps]=dijkstra(g,labels[s]);for(let t=0;t<4;t++){check(ds.get(labels[t])===(dist[s][t]<0?Infinity:dist[s][t]));const p=weighted_path_to(labels[s],labels[t],ds,ps);check(dist[s][t]<0?p===null:p.length===dist[s][t]+1);}}
 const dag=build_graph(labels,edges.map(([u,v])=>[labels[u],labels[v]]),true);check(valid_topological_order(dag,topological_sort(dag)));
}
for(const [edges,cost,count] of forests){const es=edges.map(([w,u,v])=>[w,labels[u],labels[v]]),g=weighted_adjacency(labels,es);for(const r of [prim_forest(g),kruskal_forest(labels,es)]){check(r[1]===cost);check(r[2]===count);check(r[0].length===4-count);}}
const cycle=build_graph(labels,[["A","B"],["B","A"]],true);rejects(()=>topological_sort(cycle));
const dag=new Map([["A",[["B",2],["C",4]]],["B",[["C",-3]]],["C",[]],["D",[]]]);check(dag_shortest_paths(dag,"A")[0].get("C")===-1);rejects(()=>dijkstra(dag,"A"));rejects(()=>dijkstra(dag,"X"));
''',b+d+'''
labels=["A","B","C","D"]
for (edges,dist,count) in fixtures
 g=Dict(v=>Any[] for v in labels)
 for (u,v) in edges;push!(g[labels[u+1]],(labels[v+1],1));push!(g[labels[v+1]],(labels[u+1],1));end
 for s in 1:4
  ds,ps=dijkstra(g,labels[s])
  for t in 1:4
   check(ds[labels[t]]==(dist[s][t]<0 ? Inf : dist[s][t]));p=weighted_path_to(labels[s],labels[t],ds,ps);check(dist[s][t]<0 ? p===nothing : length(p)==dist[s][t]+1)
  end
 end
 dag=build_graph(labels,[(labels[u+1],labels[v+1]) for (u,v) in edges];directed=true);check(valid_topological_order(dag,topological_sort(dag)))
end
for (edges,cost,count) in forests
 es=[(w,labels[u+1],labels[v+1]) for (w,u,v) in edges];g=weighted_adjacency(labels,es)
 for r in [prim_forest(g),kruskal_forest(labels,es)];check(r[2]==cost);check(r[3]==count);check(length(r[1])==4-count);end
end
cycle=build_graph(labels,[("A","B"),("B","A")];directed=true);rejects(()->topological_sort(cycle))
dag=Dict("A"=>Any[("B",2),("C",4)],"B"=>Any[("C",-3)],"C"=>Any[],"D"=>Any[]);check(dag_shortest_paths(dag,"A")[1]["C"]==-1);rejects(()->dijkstra(dag,"A"));rejects(()->dijkstra(dag,"X"))
''')
    coin=[]
    for coins in [[],[1],[2,4],[1,3,4],[3,5],[2,2,7]]:
        reachable={0:0};front=[0]
        for value in front:
            for c in coins:
                if value+c<=25 and value+c not in reachable:reachable[value+c]=reachable[value]+1;front.append(value+c)
        coin.extend([coins,amount,reachable.get(amount)] for amount in range(26))
    subsets=[]
    for values in [[],[1],[1,1,2],[2,3,7],[1,2,3,4]]:
        for target in range(12):
            expected=[[i for i in range(len(values)) if mask>>i&1] for mask in range(1<<len(values)) if sum(v for i,v in enumerate(values) if mask>>i&1)==target]
            subsets.append([values,target,expected])
    a,b=literals('coins',coin);c,d=literals('subsets',subsets)
    out['strategies']=(a+c+'''
for(const [cs,amount,want] of coins){check(min_coins_memo(cs,amount)===want);const r=min_coin_change(cs,amount);check(want===null?r===null:r[0]===want&&r[1].length===want&&r[1].reduce((a,b)=>a+b,0)===amount&&r[1].every(c=>cs.includes(c)));}
const canon=v=>v.map(x=>JSON.stringify(x)).sort().join(";");for(const [vs,t,want] of subsets)check(canon(subset_sum_indices(vs,t))===canon(want));
for(const vs of [[],[-2,0,3,3],[0.5,1.25,-0.25]]){const ps=prefix_sums(vs);for(let i=0;i<=vs.length;i++)check(ps[i]===vs.slice(0,i).reduce((a,b)=>a+b,0));for(let k=1;k<=vs.length;k++)check(max_fixed_window_sum(vs,k)===Math.max(...vs.slice(0,vs.length-k+1).map((_,i)=>vs.slice(i,i+k).reduce((a,b)=>a+b,0))));for(let t=-4;t<=7;t++){const found=vs.some((v,i)=>vs.some((w,j)=>i<j&&v+w===t)),r=two_sum_sorted(vs.slice().sort((a,b)=>a-b),t);check((r!==null)===found);}}
rejects(()=>min_coin_change([0],3));rejects(()=>min_coins_memo([1],true));rejects(()=>subset_sum_indices([0],0));rejects(()=>max_fixed_window_sum([],1));
''',b+d+'''
for (cs,amount,want) in coins
 check(min_coins_memo(cs,amount)===want);r=min_coin_change(cs,amount);check(want===nothing ? r===nothing : r[1]==want&&length(r[2])==want&&sum(r[2];init=0)==amount&&all(c->c in cs,r[2]))
end
canon(v)=sort([join(x,",") for x in v])
for (vs,t,want) in subsets;check(canon([is.-1 for is in subset_sum_indices(vs,t)])==canon(want));end
for vs in [[],[-2,0,3,3],[0.5,1.25,-0.25]]
 ps=prefix_sums(vs);for i in 0:length(vs);check(ps[i+1]==sum(vs[1:i];init=0));end
 for k in 1:length(vs);check(max_fixed_window_sum(vs,k)==maximum(sum(vs[i:i+k-1]) for i in 1:length(vs)-k+1));end
 for t in -4:7
  found=any(vs[i]+vs[j]==t for i in eachindex(vs) for j in i+1:length(vs));r=two_sum_sorted(sort(vs),t);check((r!==nothing)==found)
 end
end
rejects(()->min_coin_change([0],3));rejects(()->min_coins_memo([1],true));rejects(()->subset_sum_indices([0],0));rejects(()->max_fixed_window_sum([],1))
''')
    texts=[''.join(a) for n in range(4) for a in itertools.product('ab😀',repeat=n)]
    patterns=[''.join(a) for n in range(3) for a in itertools.product('ab😀',repeat=n)]
    matches=[[s,p,[i for i in range(len(s)-len(p)+1) if s[i:i+len(p)]==p]] for s in texts for p in patterns]
    matches.extend([[s,p,[i for i in range(len(s)-len(p)+1) if s[i:i+len(p)]==p]] for s,p in [('abababab','abab'),('😀a😀a😀','😀a😀'),('a'*80,'a'*9),('ab😀','ab😀ab')]])
    a,b=literals('fixtures',matches)
    out['strings']=(a+'''
for(const [s,p,want] of fixtures){for(const r of [naive_find_all(s,p),kmp_find_all(s,p),rolling_find_all(s,p),rolling_find_all(s,p,{base:3n,modulus:5n})])check(JSON.stringify(r)===JSON.stringify(want));}
const t=new Trie();for(const w of ["","a","ab","a😀","😀b"])check(t.insert(w));check(!t.insert("a"));check(t.size===5);check(JSON.stringify([...words_with_prefix(t,"a")].sort())===JSON.stringify(["a","ab","a😀"].sort()));check(longest_stored_prefix(t,"a😀z")==="a😀");check(t.delete("a"));check(t.contains("ab")&&!t.contains("a"));check(!t.delete("x"));check(t.delete(""));check(longest_stored_prefix(t,"x")===null);rejects(()=>[...words_with_prefix(t,42)]);rejects(()=>rolling_find_all("","",{modulus:1n}));
''',b+'''
for (s,p,want) in fixtures
 for r in [naive_find_all(s,p),kmp_find_all(s,p),rolling_find_all(s,p),rolling_find_all(s,p;base=3,modulus=5)];check(r.-1==want);end
end
t=Trie();for w in ["","a","ab","a😀","😀b"];check(trie_insert!(t,w));end
check(!trie_insert!(t,"a"));check(length(t)==5);check(sort(collect(words_with_prefix(t,"a")))==sort(["a","ab","a😀"]));check(longest_stored_prefix(t,"a😀z")=="a😀");check(trie_delete!(t,"a"));check(trie_contains(t,"ab")&&!trie_contains(t,"a"));check(!trie_delete!(t,"x"));check(trie_delete!(t,""));check(longest_stored_prefix(t,"x")===nothing);rejects(()->collect(words_with_prefix(t,42)));rejects(()->rolling_find_all("","";modulus=1))
''')
    out['applications']=('''
check(fewest_minutes===23);check(fastest_minutes===13);check(build_total===11&&prim_total===11);check(build_components===2&&prim_components===2);check(built_distance.get("F")===31);check(sets.component_count()===2);check(hop_distance.get("F")===3);check(path_to(hop_parent,"G")===null);check(route_total(null,links,2)===null);check(route_total([],links,2)===0);rejects(()=>adjacency_view(places,links,0));rejects(()=>route_total(["A","G"],links,2));
''','''
check(fewest_minutes==23);check(fastest_minutes==13);check(build_total==11&&prim_total==11);check(build_components==2&&prim_components==2);check(built_distance["F"]==31);check(component_count(sets)==2);check(hop_distance["F"]==3);check(path_to(hop_parent,"G")===nothing);check(route_total(nothing,links,3)===nothing);check(route_total([],links,3)==0);rejects(()->adjacency_view(places,links,0));rejects(()->route_total(["A","G"],links,3))
''')
    out['kd-trees']=spatial_cases()
    return out


def spatial_cases():
    points=[(5,4),(2,7),(8,1),(1,3),(3,6),(7,5),(9,2),(5,1),(5,9)]
    queries=list(itertools.product(range(-1,13,2),repeat=2))
    rects=[(a,b,c,d) for a,c in [(0,12),(2,5),(5,5),(8,10)] for b,d in [(0,12),(3,7),(7,7)]]
    a,b=literals('testpoints',points);c,d=literals('queries',queries);e,f=literals('rects',rects)
    segments=[((0,0),(10,10)),((0,7),(6,7)),((8,0),(10,2)),((3,5),(3,9)),((5,6),(9,8))]
    def hit(segment,rect):
        lo,hi=Fraction(0),Fraction(1)
        for axis in (0,1):
            start=segment[0][axis];delta=segment[1][axis]-start
            if not delta:
                if not rect[axis]<=start<=rect[axis+2]:return False
            else:
                x,y=sorted((Fraction(rect[axis]-start,delta),Fraction(rect[axis+2]-start,delta)))
                lo=max(lo,x);hi=min(hi,y)
        return lo<=hi
    rfixtures=[[r,[f'L{i+1}' for i,s in enumerate(segments) if hit(s,r)]] for r in rects+[(0,0,0,0),(3,7,3,7),(11,11,11,11)]]
    g,h=literals('linefixtures',rfixtures)
    js=a+c+e+g+'''
const canon=xs=>xs.map(p=>JSON.stringify(p)).sort().join(";");const distance=(p,q)=>(p[0]-q[0])**2+(p[1]-q[1])**2;
for(let rotation=0;rotation<testpoints.length;rotation++){
 let active=testpoints.slice(rotation).concat(testpoints.slice(0,rotation)),kd=null,pq=null,pr=new PRQuadTree([0,0,12,12],1);
 for(const p of active){kd=kd_insert(kd,p);pq=point_quad_insert(pq,p);check(pr.insert(p));check(!pr.insert(p));}
 for(let remaining=active.length;remaining>=0;remaining--){
  for(const q of queries){check((kd_search(kd,q)!==null)===active.some(p=>same_point(p,q)));check(point_quad_contains(pq,q)===active.some(p=>same_point(p,q)));check(pr.contains(q)===active.some(p=>same_point(p,q)));const best=active.length?Math.min(...active.map(p=>distance(p,q))):null;for(const nearest of [kd_nearest(kd,q),point_quad_nearest(pq,q),pr_nearest(pr,q)])check(best===null?nearest===null:distance(nearest,q)===best);}
  for(const r of rects){const want=canon(active.filter(p=>in_closed_rect(p,r)));check(canon(kd_range(kd,r.slice(0,2),r.slice(2)))===want);check(canon(point_quad_range(pq,r))===want);check(canon(pr.range_query(r))===want);}
  if(active.length){const removed=active.shift();kd=kd_delete(kd,removed);pq=point_quad_delete(pq,removed);check(pr_delete(pr,removed));check(!pr_delete(pr,removed));}
 }
}
const overflow=new PRQuadTree([0,0,12,12],1,0);for(const p of testpoints)overflow.insert(p);check(overflow.root.children===null);check(overflow.root.points.length===testpoints.length);rejects(()=>overflow.insert([12,2]));
for(const [r,want] of linefixtures){const actual=rtree_candidates(r_root,r).filter(k=>segment_intersects_rect(segments.get(k),r));check(actual.sort().join()===want.slice().sort().join());}
for(const [key,segment] of segments){check(rtree_exact_segment(r_root,[...segment].reverse(),segments).includes(key));}
for(const q of queries){const key=rtree_nearest(r_root,q,segments),cost=point_segment_distance2(q,segments.get(key));check(Math.abs(cost-Math.min(...[...segments.values()].map(s=>point_segment_distance2(q,s))))<1e-9);}
'''
    julia=b+d+f+h+'''
canon(xs)=sort([join(p,",") for p in xs]);distance(p,q)=(p[1]-q[1])^2+(p[2]-q[2])^2
for rotation in 0:length(testpoints)-1
 active=vcat(testpoints[rotation+1:end],testpoints[1:rotation]);kd=nothing;pq=nothing;pr=PRQuadTree((0,0,12,12),1)
 for p in active;kd=kd_insert(kd,p);pq=point_quad_insert(pq,p);check(pr_insert!(pr,p));check(!pr_insert!(pr,p));end
 for remaining in length(active):-1:0
  for q in queries
   check((kd_search(kd,q)!==nothing)==(q in active));check(point_quad_contains(pq,q)==(q in active));check(pr_contains(pr,q)==(q in active));best=isempty(active) ? nothing : minimum(distance(p,q) for p in active)
   for nearest in [kd_nearest(kd,q),point_quad_nearest(pq,q),pr_nearest(pr,q)];check(best===nothing ? nearest===nothing : distance(nearest,q)==best);end
  end
  for r in rects
   want=canon(filter(p->in_closed_rect(p,r),active));check(canon(kd_range(kd,r[1:2],r[3:4]))==want);check(canon(point_quad_range(pq,r))==want);check(canon(pr_range(pr,r))==want)
  end
  if !isempty(active);removed=popfirst!(active);kd=kd_delete(kd,removed);pq=point_quad_delete(pq,removed);check(pr_delete!(pr,removed));check(!pr_delete!(pr,removed));end
 end
end
overflow=PRQuadTree((0,0,12,12),1,0);for p in testpoints;pr_insert!(overflow,p);end
check(overflow.root.children===nothing);check(length(overflow.root.points)==length(testpoints));rejects(()->pr_insert!(overflow,(12,2)))
for (r,want) in linefixtures
 actual=filter(k->segment_intersects_rect(segments[k],r),rtree_candidates(r_root,r));check(sort(actual)==sort(want))
end
for (key,segment) in segments;check(key in rtree_exact_segment(r_root,reverse(segment),segments));end
for q in queries
 key=rtree_nearest(r_root,q,segments);cost=point_segment_distance2(q,segments[key]);check(abs(cost-minimum(point_segment_distance2(q,s) for s in values(segments)))<1e-9)
end
'''
    return js,julia
