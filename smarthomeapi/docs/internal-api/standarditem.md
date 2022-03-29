---
sidebar_position: 2
---

# StandardItem

## Definition

`StandardItem` is base class for plugin items.

## Constructors

#### `protected StandardItem(IApiManager manager, IItemHelpersFabric helpersFabric, IItemConfig config)`

## Fields

#### `protected IItemState State`

Gets ItemState object. Null by default. Call [CreateItemState()](/internal-api/standarditem#protected-void-createitemstate) first so that SmartHomeApi creates instance.

#### `protected readonly IApiManager Manager`

Gets IApiManager object.

#### `protected readonly IItemHelpersFabric HelpersFabric`

Gets IItemHelpersFabric object.

#### `protected readonly IApiLogger Logger`

Gets IApiLogger object.

#### `protected CancellationTokenSource DisposingCancellationTokenSource`

Gets CancellationTokenSource object. DisposingCancellationTokenSource is cancelled by SmartHomeApi when disposing Item. Check `DisposingCancellationTokenSource.Token.IsCancellationRequested` property in long-running loops and so on in order not to block disposing Item.

## Properties

#### `public override string ItemId { get; }`

Gets ItemId of current Item.

#### `public override string ItemType { get; }`

Gets ItemType of current Item.

#### `public IItemConfig Config { get; }`

Gets IItemConfig object of current Item.

#### `public bool IsInitialized { get; set; }`

Determines if current Item has been already initialized or not.

## Methods

#### `public virtual void OnConfigChange(IItemConfig newConfig, IEnumerable<ItemConfigChangedField> changedFields = null)`

Method is invoked by SmartHomeApi when config file for current Item is changed. It's not necessary to override this method in your plugin if you don't need to do something special (without overriding SmartHomeApi just assigns new config to `Config` property). Override this method if you need to track event of config updating. Refer tutorial for more explanation and example of usage.

#### `public virtual Task<ISetValueResult> SetValue(string parameter, object value)`

Method is invoked by SmartHomeApi when external API or other Items call this method on current Item. It's not necessary to override this method in your plugin if plugin does not support any SetValue operations. Otherwise override it. Refer tutorial for more explanation and example of usage.

#### `public Task Initialize()`

Method is invoked by SmartHomeApi during Item initialization. 

:::danger

**Don't call or override this method**. It's described here just for information purpose.

:::

#### `protected virtual Task InitializeItem()`

#### `protected override Task ProcessNotification(StateChangedEvent args)`

#### `protected void SubscribeOnNotifications()`

#### `protected void CreateItemState()`

#### `public Task Notify(StateChangedEvent args)`

#### `public ValueTask DisposeAsync()`

#### `protected virtual ValueTask DisposeItem()`

## Attributes

#### `ExecutableAttribute`

It's powerful mechanism that is similar to RPC (remote procedure calling). Methods which are marked with `[Executable]` attribute are becoming callable via `IApiManager.Execute` method.

Executable method should fit few requirements:
- It should be `public`.
- Returned type must be `Task` or `Task<T>` where T - class or primitive type.
- It must have only one input parameter (class, ExpandoObject or primitive type) or not to have parameter at all.

Let's look at examples for better understanding:

```csharp
[Executable]
public Task Test() // Method that does not return any result.
{
    return Task.CompletedTask;
}

// Actually it's the same as previous method - it returns nothing but pay attention please
// that for previous case SmartHomeApi implicitely will replace Task with Task<ExecuteCommandResultVoid>.
// You can use both approaches - return Task or Task<ExecuteCommandResultVoid>, they are equivalent.
[Executable]
public Task<ExecuteCommandResultVoid> TestVoid()
{
    return Task.FromResult(new ExecuteCommandResultVoid());
}

[Executable]
public Task<int> TestReturnPrimitive()
{
    return Task.FromResult(15);
}

[Executable]
public async Task<ExecutableSimpleResult> TestSimpleResult(ExecutableSimpleInput data)
{
    await Task.Delay(100);

    var res = new ExecutableSimpleResult { DataResult = data.Data + " result", NumberResult = data.Number + 1000 };

    return res;
}

public class ExecutableSimpleResult
{
    public string DataResult { get; set; }
    public int NumberResult { get; set; }
}

[Executable]
public async Task<ExecutableComplexResult> TestComplexResult(ExecutableComplexResult data)
{
    var res = new ExecutableComplexResult
    {
        Name = "Test name",
        List = new List<ExecutableSimpleResult>
            { new() { DataResult = "Data in list", NumberResult = 1000 } },
        Dict = new Dictionary<string, ExecutableSimpleResult>
        {
            { "TestKey", new() { DataResult = "Data in dict", NumberResult = 10000 } }
        }
    };

    return Task.FromResult(res);
}

public class ExecutableComplexResult
{
    public string Name { get; set; }

    public List<ExecutableSimpleResult> List { get; set; }

    public IDictionary<string, ExecutableSimpleResult> Dict { get; set; }
}

// Exceptions are also supported. They will be caught by SmartHomeApi and transformed to ApplicationException.
[Executable]
public Task<string> GetException(int input)
{
    if (input < 100) throw new Exception("Less than 100!");

    return Task.FromResult("It's fine!");
}

// It's possible to return just object
[Executable]
public Task<object> GetObject(int input)
{
    object res = 234;
    return Task.FromResult(res);
}

// If you need to return byte array then use ExecuteCommandResultFileContent for it.
// You can return just Task<byte[]> but in this case SmartHomeApi could not process it correctly
// when GetFile() is called via HTTP API. So take it as general rule to use ExecuteCommandResultFileContent.
[Executable]
public Task<ExecuteCommandResultFileContent> GetFile()
{
    var res = new ExecuteCommandResultFileContent(new byte[] { 1, 2, 5, 7 }, "application/jpeg");

    return Task.FromResult(res);
}
```

Of course it's also possible to call methods from other plugins like this:

```csharp
[Executable]
public async Task<int> TestPrimitive()
{   
    // Call method that does not have imput parameter and returns result of primitive type.
    var result = await Manager.Execute("ItemFromAnotherPlugin", "TestReturnPrimitive", null);

    return (int)result;
}

[Executable]
public async Task<ComplexResult> TestComplexResult(ComplexResult data)
{
    // Call method which imput parameter is class with complex structure and returned result is also class.
    var result = (ComplexResult)await Manager.Execute("ItemFromAnotherPlugin", "TestComplexResult", data, typeof(ComplexResult));

    return result;
}

public class ComplexResult
{
    public string Name { get; set; }

    public List<SimpleResult> List { get; set; }

    public IDictionary<string, SimpleResult> Dict { get; set; }
}

public class SimpleResult
{
    public string DataResult { get; set; }
    public int NumberResult { get; set; }
}
```

:::caution
There are some limitations for input and output types:
- Only properties are supported as nested items in data classes (like `public string DataResult { get; set; }` in example above).
- In order to support executing methods via HTTP API only int, long, double and boolean primitives can be used as input parameters.
In practise it means that you can create `Task<object> GetObject(int input)` method as in example above but if you want to create `Task<object> GetObject(DateTime date)` method then actually you should create class with nested DateTime property, i.e. something like this:
```csharp
public class InputData
{
    public DateTime Date { get; set; }
}
```
You can ignore this restriction but take in mind then that your method will be inaccessible via external APIs.
- Only `List<T>` and `Dictionary<K,V>` are supported. They can be as main parameter like `Task<List<int>> GetObject(List<int> input)` or nested properties as in examples above.
:::