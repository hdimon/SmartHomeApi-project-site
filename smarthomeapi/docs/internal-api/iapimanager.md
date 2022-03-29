---
sidebar_position: 1
---

# IApiManager

IApiManager is accessible via `Manager` property in plugins which inherit `StandardItem`.

### `Task<ISetValueResult> SetValue(string itemId, string parameter, object value)`
### `Task<IStatesContainer> GetState()`
### `Task<IItemStateModel> GetState(string itemId)`
### `Task<object> GetState(string itemId, string parameter)`
### `Task<IList<IItem>> GetItems()`
### `Task<object> Execute(string itemId, string command, object data, Type resultType = null)`

Allows to execute methods which have `[Executable]` attribute.

Input parameters:
- itemId - Id of item which you want to call method on.
- command - name of `[Executable]` method. It's case **insensitive**.
- data - object which is passed as input parameter of `[Executable]` method.
- resultType - optional parameter. If it's passed then SmartHomeApi will try to cast result of execution to this type.