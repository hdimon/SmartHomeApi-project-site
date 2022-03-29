---
sidebar_position: 2
---

# 2 - Expose item state

On previous step we created our first plugin which is useless for now. In this step we will make our plugin expose some info about SmartHomeApi process.

## Initialize method

Add new code to existing `ProcessInfo` class in order to get:
```csharp
namespace SmartHomeApi.Plugins.ProcessInfo
{
    public class ProcessInfo : StandardItem
    {
        private Process _process;

        public ProcessInfo(IApiManager manager, IItemHelpersFabric helpersFabric, IItemConfig config) : base(manager, helpersFabric, config)
        {
        }

        protected override Task InitializeItem()
        {
            CreateItemState();

            _process = Process.GetCurrentProcess();

            UpdateProcessInfo();

            return Task.CompletedTask;
        }

        private void UpdateProcessInfo()
        {
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

Let's look at code.

First we call `CreateItemState()` which indicates SmartHomeApi that this plugin exposes state and prepares state container. Since plugins don't have to have states then it's needed to define it explicitely.
If you forget to call this method but try to set state via `SetState(string key, object value)` then you will get error during plugin work.

Then we get instance of Process class which contains info about current Process, i.e. SmartHomeApi process.
It's strongly recommended to create needed resources in `InitializeItem()` and then dispose and free them in `DisposeItem()` method. If you ignore this rule then your plugin could work incorrectly, for example not to support hot reloading (see below about this feature).

Finally we call `UpdateProcessInfo()` where usefull information about process is collected to state.

Rebuild project now and copy-paste "SmartHomeApi.Plugins.ProcessInfo.dll" into `SmartHomeApi.Plugins.ProcessInfo` directory in `Plugins`. If you didn't stop SmartHomeApi after previous learning step then don't worry - SmartHomeApi supports hot reloading, i.e. it disposes plugin and then create again when files in `SmartHomeApi.Plugins.ProcessInfo` directory are changed.

Open `http://localhost:5100/api/GetState` and look that now there should appear something like:
```
{
  "States": {
    "SmartHomeApiProcessInfo": {
      "ItemId": "SmartHomeApiProcessInfo",
      "ItemType": "SmartHomeApi.Plugins.ProcessInfo",
      "States": {
        "StartTime": "2022-01-21T20:04:46.5432462+03:00",
        "UpTime": "00:00:01.6499459",
        "MemoryUsage": 61,
        "ProcessId": 31212
      }
    }
  }
}
```

Great! Now our plugin became more useful but... If you refresh `http://localhost:5100/api/GetState` then state is not updated. Let's fix that.

## Recurrent worker

Let's modify our plugin code to get next:
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
        
        private async Task PreAction(CancellationToken token)
        {
            await Task.Delay(1000, token);
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

As you see we added `RecurrentWorker` - helper which runs Action after PreAction finishes. In our case we want to refresh state periodically so just add Delay on 1000 milliseconds.

Also pay attention to the first parameter of `RecurrentWorker` constructor - `DisposingCancellationTokenSource.Token`. When SmartHomeApi exits or reloads plugins it cancels `DisposingCancellationTokenSource`. It's needed for correct unloading plugins. This token then passed to PreAction and Action methods. Of course you can write something like this `await Task.Delay(1000000)` without token, i.e. making delay in 1000 seconds. But if during this delay you will delete plugin or reload it, SmartHomeApi could not do it till 1000 seconds pass. So it's recommended to follow this recommendation and don't forget `DisposingCancellationTokenSource`.

Rebuild project now and copy-paste "SmartHomeApi.Plugins.ProcessInfo.dll" into `SmartHomeApi.Plugins.ProcessInfo` directory in `Plugins`. After ~7 seconds which are needed for reloading plugin try to refresh `http://localhost:5100/api/GetState` several times to see that values are changing.

Let's move to next page to learn how to congifure plugins.