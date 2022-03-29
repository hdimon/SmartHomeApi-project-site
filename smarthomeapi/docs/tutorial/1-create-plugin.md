---
sidebar_position: 1
---

# 1 - Create plugin

This tutorial will walk through steps of creating your own plugin from first simplest one to more elaborated.

For example purpose we will create plugin which provides info about current SmartHomeApi process. You can find plugin in its [repository](https://github.com/hdimon/SmartHomeApi.Plugins.ProcessInfo).

## Prerequisites

Plugin for this tutorial is created in Visual Studio Community 2022. You can use another IDE or download Visual Studio from [official website](https://visualstudio.microsoft.com/ru/downloads/).

## Creating minimal working plugin

1. In Visual Studio find `Create a new project` option and then choose `Class Library` project type for `C#` language. Call project "SmartHomeApi.Plugins.ProcessInfo". Choose `.NET 6.0` as Target Framework.

2. Find Solution Explorer, right click on `Dependencies` and then click `Manage NuGet Packages...`.

3. Type `SmartHomeApi.ItemUtils` in Search form and find `SmartHomeApi.ItemUtils` package in search results. Click Install button.

4. By default Visual Studio creates one class with name `Class1`. Rename it to `ProcessInfo` and insert next code:
```csharp
using SmartHomeApi.Core.Interfaces;
using SmartHomeApi.ItemUtils;

namespace SmartHomeApi.Plugins.ProcessInfo
{
    public class ProcessInfo : StandardItem
    {
        public ProcessInfo(IApiManager manager, IItemHelpersFabric helpersFabric, IItemConfig config) : base(manager, helpersFabric, config)
        {
        }
    }
}
```

5. Right click on "SmartHomeApi.Plugins.ProcessInfo" in Solution Explorer and select `Add -> Class...`. Name it "ProcessInfoConfig" and insert next code:

```csharp
using SmartHomeApi.ItemUtils;

namespace SmartHomeApi.Plugins.ProcessInfo
{
    public class ProcessInfoConfig : ItemConfigAbstract
    {
        public ProcessInfoConfig(string itemId, string itemType) : base(itemId, itemType)
        {
        }
    }
}
```

5. Right click on "SmartHomeApi.Plugins.ProcessInfo" in Solution Explorer and select `Add -> Class...`. Name it "ProcessInfoLocator" and insert next code:

```csharp
using SmartHomeApi.Core.Interfaces;
using SmartHomeApi.ItemUtils;

namespace SmartHomeApi.Plugins.ProcessInfo
{
    public class ProcessInfoLocator : NonConfigItemsLocatorAbstract
    {
        public override string ItemType => "SmartHomeApi.Plugins.ProcessInfo";

        public ProcessInfoLocator(ISmartHomeApiFabric fabric) : base(fabric)
        {
        }

        protected override Task<IList<IItem>> CreateItems()
        {
            var config = new ProcessInfoConfig("SmartHomeApiProcessInfo", ItemType);

            IList<IItem> items = new List<IItem>();

            items.Add(
                new ProcessInfo(Fabric.GetApiManager(), Fabric.GetItemHelpersFabric(config.ItemId, config.ItemType), config));

            return Task.FromResult(items);
        }
    }
}
```

## Run plugin
Yes, we have just created plugin which actually does nothing but it's already valid plugin!
Go to `BUILD => Build Solution` and then open `.../SmartHomeApi.Plugins.ProcessInfo/SmartHomeApi.Plugins.ProcessInfo/bin/Debug/net6.0` directory in File Explorer.
You should see "ref" directory and 3 files: "SmartHomeApi.Plugins.ProcessInfo.deps.json", "SmartHomeApi.Plugins.ProcessInfo.dll" and "SmartHomeApi.Plugins.ProcessInfo.pdb". 

Right now we need only one file - "SmartHomeApi.Plugins.ProcessInfo.dll".

Create `SmartHomeApi.Plugins.ProcessInfo` directory in `Plugins` directory of SmartHomeApi and copy-paste "SmartHomeApi.Plugins.ProcessInfo.dll" into it.

Run SmartHomeApi and look at content of latest file in `Logs` directory of SmartHomeApi. You should see there something like:

```
...
20-01-2022 20:14:41.789 [INFO] [] Start processing SmartHomeApi.Plugins.ProcessInfo plugin.
20-01-2022 20:14:41.913 [INFO] [] ItemLocator SmartHomeApi.Plugins.ProcessInfo has been created.
20-01-2022 20:14:41.913 [INFO] [] Plugin SmartHomeApi.Plugins.ProcessInfo has been processed.
20-01-2022 20:14:42.761 [INFO] [] Start items locators initialization...
20-01-2022 20:14:42.761 [INFO] [] Start SmartHomeApi.Plugins.ProcessInfo items locator initialization...
20-01-2022 20:14:42.767 [INFO] [] SmartHomeApi.Plugins.ProcessInfo items locator has been initialized.
...
20-01-2022 20:14:42.771 [INFO] [] Start SmartHomeApiProcessInfo item initialization...
20-01-2022 20:14:42.780 [INFO] [] Item SmartHomeApiProcessInfo has been initialized.
...
```

## Overview what has been done

Now let's go through what we done.

First we created `ProcessInfo` class which is entry point for all plugin logic. It inherited from `StandardItem` class which is very important - it's a marker for SmartHomeApi and it contains basic logic for plugin that allows us to create own plugins just in few lines of code.

Then we created `ProcessInfoConfig` class which is actually not needed right now in our simple example (since it does not contain any custom parameters) but it's one of the restrictions of SmartHomeApi - every plugin should define Configuration class even if it's hardcoded rather than took from configuration files. `ProcessInfoConfig` inherited from `ItemConfigAbstract` class which is also marker for SmartHomeApi.

Finally we created `ProcessInfoLocator` class which is inherited from `NonConfigItemsLocatorAbstract` class. "NonConfig" prefix means that SmartHomeApi should not search config files for our plugin because plugin creates Items on its own.
Let's look at first line of class code:
```
public override string ItemType => "SmartHomeApi.Plugins.ProcessInfo";
```
You might notice that constructor of `ProcessInfoConfig` contains `itemType` parameter:
```
public ProcessInfoConfig(string itemId, string itemType) : base(itemId, itemType)
```
It's very important concept of SmartHomeApi that is based on how SmartHomeApi manages Items. The clue is in necessity to determine which config files belong to particular plugins. When SmartHomeApi scans `Config` directory it looks at `ItemType` property in config files, constructs object from config json and passes it to right plugin.

Rest code of `ProcessInfoLocator` is very simple. Since we use `NonConfigItemsLocatorAbstract` class and don't need configs stored in files then we just directly create Items.

:::info
There will be so many instances of `ProcessInfo` class (that is Item in terms of SmartHomeApi) as many ones will be created by Items Locator. For our learning purpose it's not very important but in real life when plugin manages physical devices you will likely want to have one Item per each device instead of manage all devices from the same Item.
:::

Pay attention to line:
```
var config = new ProcessInfoConfig("SmartHomeApiProcessInfo", ItemType);
```

We pass "SmartHomeApiProcessInfo" as ItemId. ItemId - is identificator of Item which should be unique over all system. **Every Item must have own ItemId.**

Now open `http://localhost:5100/api/GetState` (change port in according to which was set during installation) in browser. There is nothing related to our plugin because currently our plugin does not expose any state. Let's go to the next page and make our plugin show some useful information!