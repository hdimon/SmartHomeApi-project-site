---
sidebar_position: 4
---

# 4 - Observe state changes

In previous steps we learnt how to create plugins and how to expose their state. But how other plugins can observe state changes in order to react on it? Let's look at it on example of plugin [SmartHomeApi.Plugins.MqttAdapter](https://github.com/hdimon/SmartHomeApi.Plugins.MqttAdapter) - which provides possibility to communicate with SmartHomeApi via MQTT protocol. It's more complicated plugin in comparing with SmartHomeApi.Plugins.ProcessInfo which we created before and also it contains few interesting points which could be useful for your future development so we will consider them at all.

Let's look at the most important parts of `MqttAdapter` class (full code you can find in repository mentioned above)"

```csharp
...

protected override async Task InitializeItem()
{
    try
    {
        _client = new MqttFactory().CreateMqttClient();
        _client.UseConnectedHandler(OnConnected);
        _client.UseDisconnectedHandler(OnDisconnected);
        _client.UseApplicationMessageReceivedHandler(OnMessageReceived);

        await Connect();
    }
    catch (Exception e)
    {
        Logger.Error(e);
    }

    await base.InitializeItem();

    Logger.Info("MQTT adapter initialized.");
}

private async Task OnConnected(MqttClientConnectedEventArgs arg)
{
    var config = (MqttAdapterConfig)Config;

    Logger.Info($"MQTT adapter connected to {config.Address}:{config.Port}.");

    if (!_subscribedOnNotifications)
    {
        _publishInitialStateTcs.SetResult(true);
        SubscribeOnNotifications();
        _subscribedOnNotifications = true;
    }

    await PublishInitialState();
}

...

private async Task OnMessageReceived(MqttApplicationMessageReceivedEventArgs arg)
{
    ...
    CultureInfo culture = GetCultureInfo(((MqttAdapterConfig)Config).Culture);

    if (culture == null)
        return;

    object objValue;

    try
    {
        objValue = payload.GetAsObject(valueType, culture);
    }
    catch (Exception)
    {
        Logger.Error($"Can't cast [{payload}] of type [{type}] to Object.");

        return;
    }

    await Manager.SetValue(itemId, parameter, objValue);
    ...
}

...

private string GetValueString(object value)
{
    if (value == null)
        return null;

    CultureInfo culture = GetCultureInfo(((MqttAdapterConfig)Config).Culture);

    if (culture == null)
        return null;

    if (value is bool)
        return value.ToString()?.ToLower();

    if (TypeHelper.IsSimpleType(value.GetType()))
        return Convert.ToString(value, culture);

    try
    {
        var serialized = _serializer.Serialize(value);

        return serialized;
    }
    catch (Exception e)
    {
        Logger.Error(e);
    }

    return null;
}

protected override async Task ProcessNotification(StateChangedEvent args)
{
    if (args.EventType == StateChangedEventType.ValueSet ||
        args.EventType == StateChangedEventType.ValueRemoved)
        return;

    await _publishInitialStateTcs.Task;

    var valueStr = GetValueString(args.NewValue);

    if (args.NewValue != null && valueStr == null)
        return;

    await PublishMessage(args.ItemId, args.Parameter, valueStr);
}
```

## Subscribe on state change events

First let's look at method `InitializeItem()` (which we are already familiar with) and method `OnConnected(MqttClientConnectedEventArgs arg)`. As it was recommended earlier `InitializeItem()` contains code of creating resources which are needed for plugin. It's ok. But pay attention please to next line in `OnConnected(MqttClientConnectedEventArgs arg)` method:
```csharp
SubscribeOnNotifications();
```

Do you remember `CreateItemState()` from previous steps? That method is needed if you want your plugin to expose some state. The same thing with `SubscribeOnNotifications()`. Plugin doesn't have to subscribe on state change events (and if plugin does not need to observe states of other plugins then you **should not** call this method) but if it's needed then you should call it. What is the next interesting thing in this case - generally it should be called from `InitializeItem()` item BUT it can be called from some other methods if it's needed. As you see in `SmartHomeApi.Plugins.MqttAdapter` it's called from `OnConnected(MqttClientConnectedEventArgs arg)` method, i.e. only after connection to MQTT server (broker) is established. In this particular case it means `SmartHomeApi.Plugins.MqttAdapter` will **not** get state change events from SmartHomeApi till that moment.

## Process state change events

After `SubscribeOnNotifications()` is called plugin starts to get notifications in `ProcessNotification(StateChangedEvent args)` method. You can filter only needed events by `args.EventType`, `args.ItemType`, `args.ItemId`, `args.Parameter` and also you can get not only `args.NewValue` which is actual value of state but also previous `args.OldValue`.

In `SmartHomeApi.Plugins.MqttAdapter` we filter out all events which notify us about `ValueSet` (that is triggered on `SetValue` action which we will consider further) and `ValueRemoved` event types and process `ValueAdded` and `ValueUpdated` event types.

Also let's have a look at `GetValueString(object value)` method. It demonstates quite important possibility of SmartHomeApi. MqttAdapterConfig contains `Culture` parameter which allow you to integrate SmartHomeApi even with more than one different systems at the same time! So having created two config files, i.e. two separate items of MqttAdapter you can integrate SmartHomeApi working, for example in US culture with "System 1" working in GB culture and with "System 2" working in "CA" culture.

Finally pay attention to line `await Manager.SetValue(itemId, parameter, objValue)`. When `SmartHomeApi.Plugins.MqttAdapter` gets message it parses that, determine which Item should get that and send value to this Item. In next steps we'll consider how Item can process this value.