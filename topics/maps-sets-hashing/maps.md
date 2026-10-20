# Maps: keys, values and operations

A **Map** associates each distinct key with one value. A key identifies an entry; the value carries its associated information. Different keys may have equal values. A key may also be associated with a collection, such as a list of readings, without changing the one-key/one-value rule.

## The behavioural contract

| Operation | Meaning | Changes the size? |
|---|---|---|
| `put(key, value)` | Add a new association or replace an existing key’s value | Only for a new key |
| `get(key)` | Retrieve the associated value | No |
| `remove(key)` | Remove the association | Yes, if present |
| `contains_key(key)` | Test key membership | No |
| `size()` | Count distinct stored keys | No |

The Map ADT does not specify that keys occupy any particular array position. It also does not require hashing: other implementations are possible.

## A complete Python example

Python’s `dict` supplies Map behaviour, although the operation names differ from our abstract contract.

```python
directory = {"S01": "Central", "S02": "Museum"}
directory["S03"] = "Harbour"     # insert a new key
directory["S01"] = "Downtown"    # replace an existing value
name = directory["S02"]          # retrieve: "Museum"
del directory["S03"]             # remove one association
present = "S04" in directory     # False: membership checks keys
```

The final directory has two keys. Updating S01 changes its associated name; it does not add a second S01 entry. In contrast, `"Museum" in directory` tests whether that string is a **key**, not whether it occurs among the values. Use `directory.values()` when the question concerns values.

## Missing is different from a stored value

`directory[key]` raises `KeyError` when the key is absent. `directory.get(key)` returns `None` by default, but `None` may itself be a legitimate stored value. If the distinction matters, test membership or supply a unique sentinel:

```python
missing = object()
result = directory.get("S04", missing)
if result is missing:
    print("No such station")
```

The sentinel is compared by identity because it represents one particular marker object.

## Order and identity

Python dictionaries preserve insertion order. That is a property of Python’s dictionary, not a requirement of every Map, and it is not sorted-key order. Replacing a value does not make the key numerically or alphabetically sorted.

If you only need to know which identifiers occur, read [Sets](sets.md). To see how a key can guide retrieval, continue to [Hashing](hashing.md).
