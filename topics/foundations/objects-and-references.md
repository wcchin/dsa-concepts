# Objects, references, identity and equality

To understand a Python data structure, we need a model of what its names and fields refer to. Otherwise, an innocent-looking assignment can be mistaken for a copy, and a reference update can be mistaken for a change to the referenced object.

(objects-and-bindings)=
## Objects, names and assignment

An **object** has an identity, a type and a value. A **name** is bound to an object. A **reference** is the connection through which a program refers to an object. These are useful reasoning terms; our diagrams do not claim to show physical memory addresses or Python’s internal layout.

```python
stop = "Kent Ridge"
passengers = 12
stop = "Museum"
print(stop)  # Museum
```

The first assignment binds `stop` to a string object. The final assignment rebinds that name to another string. It does not edit the characters of the original string.

Objects can be referenced from names, collection entries and attributes. A list entry can therefore refer to another list, and an object attribute can refer to another node. This is how separate objects form larger structures.

(aliasing)=
## Assignment can create aliases

```python
route_a = ["KR", "MUS"]
route_b = route_a
print(route_a is route_b)  # True
```

Evaluating `route_a` supplies the existing list object; assigning it to `route_b` gives that object another name. It does not construct another list. The names are **aliases**.

![Two names route_a and route_b point to the same list. After rebinding route_b, route_a still points to the original list while route_b points to a new list.](../../assets/foundations/aliasing-rebinding.svg)

An arrow means “refers to”. A box represents an object. Two arrows ending at one box indicate sharing; two boxes indicate different objects even if their contents happen to be equal. The lower panel illustrates the rebinding developed on the [next page](mutation-and-copying.md).

(identity-and-equality)=
## Identity and equality answer different questions

```python
x = ["KR", "MUS"]
y = ["KR", "MUS"]
z = x
print(x == y)  # True
print(x is y)  # False
print(x is z)  # True
```

For these lists, `==` compares their contents and `is` tests whether they are the same object. Separate list expressions create separate lists, so changing x can leave y unchanged even though they began equal. Conversely, z provides another reference to x’s list.

The meaning of equality depends on the type. A user-defined class can supply its own equality rule; Python does not automatically compare all attributes of every class. See [classes and instances](collections-and-classes.md#classes-and-instances).

Do not use `is` to compare the values of numbers or strings. Implementations may reuse some immutable objects, so an identity observation is not a reliable rule for value equality. `id(obj)` can identify an object during its lifetime, but its numerical value is not needed for these traces and may later be reused after an object ceases to exist.

(none-sentinel)=
## None represents an explicit absence

`None` is a singleton object: it is a value a reference can identify, not an uninitialised hole. We use it when a function has no search result or a node has no next node.

```python
next_node = None
print(next_node is None)  # True
```

Use `is None` and `is not None` for these tests. An empty list is a different object with a different meaning: it is a collection containing zero items. A function that reaches its end without a `return` value also returns `None`.

## Read a reference diagram in three steps

First locate the names or attributes. Then follow their arrows to the objects. Finally distinguish an operation that changes a box’s state from an assignment that redirects an arrow. This method scales from two list aliases to linked nodes and trees.

Next: [Mutability, rebinding and copying](mutation-and-copying.md).

**Browse:** [Foundations](foundations.md) · [Concept index](../../concepts.md)
