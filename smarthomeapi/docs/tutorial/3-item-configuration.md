---
sidebar_position: 3
---

# 3 - Item configuration

On previous step we made our plugin expose some info about SmartHomeApi process. But there is one potential thing which can be inconvinient for all users of plugin - refreshing interval (`Task.Delay(1000, token)`) has constant 1000ms. But what if someone wants to set interval as 5000ms? That's what we can do via moving configuration to file instead of hardcoded in Locator.

Let's do few changes.

## Update ProcessInfoConfig

Modify code of `ProcessInfoConfig` class to get:
```csharp
namespace SmartHomeApi.Plugins.ProcessInfo
{
    public class ProcessInfoConfig : ItemConfigAbstract
    {
        public int RefreshIntervalMs { get; set; }

        public ProcessInfoConfig(string itemId, string itemType) : base(itemId, itemType)
        {
        }
    }
}
```

## Update ProcessInfoLocator

The most important changes are here:
```csharp
namespace SmartHomeApi.Plugins.ProcessInfo
{
    public class ProcessInfoLocator : StandardItemsLocatorAbstract
    {
        public override string ItemType => "SmartHomeApi.Plugins.ProcessInfo";
        public override Type ConfigType => typeof(ProcessInfoConfig);

        public ProcessInfoLocator(ISmartHomeApiFabric fabric) : base(fabric)
        {
        }

        protected override IItem ItemFactory(IItemConfig config)
        {
            var helpersFabric = Fabric.GetItemHelpersFabric(config.ItemId, config.ItemType);

            return new ProcessInfo(Fabric.GetApiManager(), helpersFabric, config);
        }
    }
}
```

As you can see `ProcessInfoLocator` became even simpler than it was before.
We changed `NonConfigItemsLocatorAbstract` to `StandardItemsLocatorAbstract` and added `public override Type ConfigType => typeof(ProcessInfoConfig)` so that SmartHomeApi knows which type it should create when meets json config file for ProcessInfo plugin.
Also we removed method with hardcoded items creating and implemented Item factory. When SmartHomeApi processed config file it creates instance of ProcessInfoConfig and then passes it to `ItemFactory` which should return Item, in our case it's `ProcessInfo`.

Finally let's modify code of `ProcessInfo` class to use `RefreshIntervalMs` from config instead of hardcoded value.

## Update ProcessInfo

Modify code of `ProcessInfo` class to get:
```csharp
namespace SmartHomeApi.Plugins.ProcessInfo
{
    public class ProcessInfo : StandardItem
    {
        private Process _process;
        private RecurrentWorker _worker;

        public ProcessInfo(IApiManager manager, IItemHelpersFabric helpersFabric, IItemConfig config) : base(manager, helpersFabric, config)
        {
        }

        protected override Task InitializeItem()
        {
            CreateItemState();

            _process = Process.GetCurrentProcess();
            _worker = new RecurrentWorker(DisposingCancellationTokenSource.Token, PreAction, Action, OnException);

            _worker.Run();

            return Task.CompletedTask;
        }

        public override void OnConfigChange(IItemConfig newConfig, IEnumerable<ItemConfigChangedField> changedFields)
        {
            var conf = (ProcessInfoConfig)Config;
            var newConf = (ProcessInfoConfig)newConfig;

            if (conf.RefreshIntervalMs != newConf.RefreshIntervalMs)
                Logger.Info($"RefreshIntervalMs has been changed from {conf.RefreshIntervalMs} to {newConf.RefreshIntervalMs}.");

            //Assign Config = newConfig
            base.OnConfigChange(newConfig, changedFields);
        }

        private async Task PreAction(CancellationToken token)
        {
            await Task.Delay(GetRefreshIntervalMs(), token);
        }

        private int GetRefreshIntervalMs()
        {
            var config = (ProcessInfoConfig)Config;

            return config.RefreshIntervalMs > 0 ? config.RefreshIntervalMs : 1000;
        }

        private Task Action(CancellationToken token)
        {
            UpdateProcessInfo();

            return Task.CompletedTask;
        }

        private void OnException(Exception ex)
        {
            Logger.Error(ex);
        }

        private void UpdateProcessInfo()
        {
            _process.Refresh();

            State.SetState("ProcessId", _process.Id);
            State.SetState("StartTime", _process.StartTime);
            State.SetState("UpTime", DateTime.Now - _process.StartTime);
            State.SetState("MemoryUsage", _process.WorkingSet64 / 1024 / 1024); //Get memory usage in megabytes
        }

        protected override ValueTask DisposeItem()
        {
            _process.Dispose();

            return ValueTask.CompletedTask;
        }
    }
}
```

We added here overridden implementation of `OnConfigChange` but only thing that it does - logs fact about changing RefreshIntervalMs.
This method is here just with demostration purpose. In real life it's needed only if you either want to trigger some other actions of Config changes or if you want to override default behavior. For example you can choose not to call `base.OnConfigChange(newConfig, changedFields)` at all and in this case Config will not be updated with new value.

Also now we take interval from method `GetRefreshIntervalMs()` which just returns RefreshIntervalMs value from config or returns default 1000ms in case if value in config is not set.

## Create json config file

Last thing that we should do is to create `ProcessInfo.json` file in SmartHomeApi `Configs` directory with next content:
```json
{
    "ItemId": "SmartHomeApiProcessInfo",
	"ItemType": "SmartHomeApi.Plugins.ProcessInfo",
    "RefreshIntervalMs": 5000
}
```
You could play with it changing RefreshIntervalMs value and refreshing `http://localhost:5100/api/GetState` to see that interval applies.

Of course you can create more than one config files with different ItemIds. It's useless in our particular case because all Items will show info about the same process but in real life for the most plugins it will be a case.

Now our first simple plugin is completed. In next steps we will consider more possibilities of SmartHomeApi on examples of other plugins.