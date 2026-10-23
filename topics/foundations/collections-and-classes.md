# Collections, classes and invariants

**After this page, you should be able to:**

- Choose a built-in collection by sequence, key/value or membership requirements.
- Read instance methods, validated state transitions and linked-object invariants.

**Builds on:** [Object/reference locations](objects-and-references.md) and [mutation/sharing contracts](mutation-and-copying.md#mutation-operation-contracts).

Built-in collections give us useful representations immediately. Classes let us define objects with named state and operations. Both approaches require clear decisions about what the data means and which states are valid.

(built-in-collections)=
## Lists, tuples, dictionaries and sets

| Type | Main interpretation | Mutable? | Example |
|---|---|---|---|
| `list` | Ordered sequence; repeated items allowed | Yes | `["KR", "MUS", "KR"]` |
| `tuple` | Fixed sequence, often a small record | No | `(1.2937, 103.7845)` |
| `dict` | Unique keys associated with values | Yes | `{"KR": "Kent Ridge"}` |
| `set` | Distinct elements and membership | Yes | `{"KR", "MUS"}` |

Python dictionaries preserve insertion order, but that is not sorted-key order. Sets provide no insertion-order guarantee. Dictionary keys and set elements must be [hashable](../maps-sets-hashing/hashing.md#hashability-in-python); dictionary values do not have that requirement. `{}` creates an empty dictionary; use `set()` for an empty set.

A tuple is useful for coordinates because each position has a fixed interpretation. That is a design convention, not a runtime restriction that tuples may only contain coordinates or that lists cannot store them.

(unpacking-and-comprehensions)=
## Unpacking and comprehensions

```python
location = (1.2937, 103.7845)
latitude, longitude = location

passenger_counts = {"Kent Ridge": 12, "Museum": 7, "University Town": 18}
busy_stops = [
    name
    for name, count in passenger_counts.items()
    if count >= 10
]
print(busy_stops)  # ['Kent Ridge', 'University Town']
```

Unpacking gives names to the two coordinate fields. In the comprehension, `.items()` supplies key-value pairs. For each pair, the condition selects a name for the new list. Reading it as “iterate, test, produce” helps distinguish the input representation from the output collection. The resulting order follows the dictionary’s iteration order, not a ranking by passenger count.

(classes-and-instances)=
## Classes, instances, attributes and methods

A **class** defines a type of object and its behaviour. An **instance** is a particular object of that class. An **attribute** holds named state or another accessible member; a **method** supplies behaviour associated with an object.

The following teaching model records a passenger count associated with each shuttle stop. It is deliberately small: it illustrates state updates, rather than modelling all transport operations.

```python
class ShuttleStop:
    def __init__(self, code: str, name: str) -> None:
        self.code = code
        self.name = name
        self._passengers = 0

    def board(self, number: int = 1) -> None:
        self._check_number(number)
        self._passengers += number

    def alight(self, number: int = 1) -> None:
        self._check_number(number)
        if number > self._passengers:
            raise ValueError("Not enough passengers")
        self._passengers -= number

    def _check_number(self, number: int) -> None:
        if type(number) is not int or number < 0:
            raise ValueError("Expected a nonnegative integer count")

    def __repr__(self) -> str:
        return (
            f"ShuttleStop({self.code!r}, {self.name!r}, "
            f"passengers={self._passengers})"
        )

museum = ShuttleStop("MUS", "Museum")
utown = ShuttleStop("UTN", "University Town")
museum.board(3)
utown.board(8)
museum.alight(1)
print(museum)  # ShuttleStop('MUS', 'Museum', passengers=2)
print(utown)   # ShuttleStop('UTN', 'University Town', passengers=8)
```

`__init__` initialises each newly created instance. Assignments to `self.code`, `self.name` and `self._passengers` establish instance attributes. Each stop has its own count; updating Museum does not change University Town. `__repr__` supplies an informative representation for inspection. Here `!r` requests the representation of each string, including its quotes.

(shuttle-stop-contract)=
## Specify the small class's supported operations

| Operation | Result and state change | Boundary or invalid request |
|---|---|---|
| `ShuttleStop(code, name)` | New instance with passenger count 0 | String annotations describe intended inputs; constructor does not validate them |
| `board(number=1)` | `None`; increase this instance's recorded count | Exact nonnegative `int` required; otherwise `ValueError` |
| `alight(number=1)` | `None`; decrease this instance's recorded count | Same type/range check; insufficient passengers also raises `ValueError` |
| `repr(stop)` | New descriptive string through `__repr__` | Observes state; no passenger update |

Zero boarding/alighting is valid and leaves the count unchanged. Rejected boarding/alighting leaves it unchanged because validation precedes the update. There is no capacity limit, passenger-list storage or public count-query method in this small model; inspect the displayed representation for the example. Later ADT implementations provide their own complete interfaces.

`board` and `alight` update one instance. Another reference to that **same** instance observes those changes; a separately constructed instance keeps its own state. `_check_number` is an internal helper, not an additional operation required from clients.

(self)=
## What does self mean?

In `museum.board(3)`, the method receives Museum as its `self` argument. For this ordinary instance method, the call can be understood as `ShuttleStop.board(museum, 3)`. `self` is the conventional name for that parameter; it is not a separate shared stop or a copy of the instance.

(invariants)=
## Invariants describe valid states

An **invariant** is a condition intended to hold in every valid state at the boundaries of the supported operations. In this model the recorded passenger count must be a nonnegative integer.

Initialisation establishes the invariant. `board` accepts only nonnegative integer increments. `alight` also checks that enough passengers exist before subtraction. Rejected requests raise an exception before changing the count. Accepting a negative boarding count would defeat the invariant, so checking only the alighting limit would be insufficient.

For simplicity, the validation accepts Python’s `int` type exactly and rejects other types, including Boolean values. The particular validation policy is a design choice; the important point is that it matches the stated contract.

(encapsulation-and-hints)=
## Conventions and type hints are not runtime barriers

A leading underscore communicates that `_passengers` is an internal implementation detail. Python still permits direct assignment to it, so a client could bypass the intended methods and create invalid state. Encapsulation here relies on the interface and a documented usage convention.

Annotations such as `number: int` document intent and support static tools. They do not ordinarily enforce the type at runtime; the explicit `_check_number` code supplies that check. Similarly, our constructor annotates `code` and `name` but does not validate those arguments.

Default equality for ordinary instances of this class is based on identity. Two separately constructed stops do not become equal merely because their code and name match; value-based equality would need an explicit design, such as defining `__eq__`.

:::{note} Pause and trace
You can study this page in two sittings: collection choices and validated instance state first, linked objects second. Before continuing, explain why rejected boarding/alighting leaves the count unchanged; then distinguish a RouteNode from the ShuttleStop it refers to.
:::

(linked-objects)=
## References connect instances into structures

```python
class RouteNode:
    def __init__(self, stop, next_node=None):
        self.stop = stop
        self.next = next_node

second = RouteNode(ShuttleStop("MUS", "Museum"))
first = RouteNode(ShuttleStop("KR", "Kent Ridge"), second)

current = first
while current is not None:
    print(current.stop.name)
    current = current.next
```

The output is Kent Ridge followed by Museum. Each node refers to a stop and either another node or `None`. The stop is an object in its own right; the node is the object that gives it a position in this route.

![The first and second route nodes link through their next attributes; each separately refers to a ShuttleStop object. The second next attribute is None.](../../assets/foundations/linked-objects.svg)

Rebinding `current` advances the traversal without changing `first` or any node’s `next` attribute. Assigning `first.next = None` would instead change the structure and make the traversal stop after the first node. The loop finishes for this finite, acyclic chain. If links form a cycle, the same stopping test alone is insufficient.

Insertion, removal and safe reference-update order belong to [linear structures](../linear-structures/linear-structures.md). This introduction supplies the object model needed to read those operations.

(foundation-state-invariants)=
## Check state boundaries and traversal assumptions

The passenger invariant is established by construction and preserved by supported methods, including rejected requests. An alias to the instance shares its state; a second constructor call creates a different instance. The count itself is an immutable integer, but rebinding the instance's count attribute changes the mutable instance's recorded state.

For the route example, each `next` reference must lead to another valid node or `None`, and the displayed traversal assumes a finite acyclic chain whose stops have names. `RouteNode` does not enforce these conditions. Advancing the local `current` binding is an observer of the chain; changing a node's `next` is a structural mutation and may change reachability or create a cycle.

Under the introductory fixed-size-value model, boarding/alighting performs a fixed amount of validation and arithmetic; it does not scan one stored object per passenger. A chain traversal, however, visits each reached node, and the comprehension inspects each dictionary entry and allocates a list for selected names. The amount of represented data and the operation's actual steps determine cost, not the number of attribute names in the class.

:::{tip} Common misconception
**Type hints and underscores enforce valid state automatically.** Runtime checks maintain this model's count invariant; clients can still bypass conventions by assigning internal attributes.
:::

(foundation-class-checks)=
## Check your understanding

Predict the result or draw the references before opening the explanation.

**1. Museum has count 2. What happens after alight(3), and what happens after board(True)?**

:::{dropdown} Show explanation
Each raises ValueError without changing the count. The first request exceeds the count; the second fails the exact-int check even though bool is numerically related to int in Python.
:::

**2. If current=first and then current=current.next, has first.next changed?**

:::{dropdown} Show explanation
No. The local traversal binding moves to another existing node. Assigning first.next directly would instead mutate the structure.
:::

Next: [Abstract data types: behaviour before representation](adt-basics.md).

**Browse:** [Foundations](foundations.md) · [Concept index](../../concepts.md)
