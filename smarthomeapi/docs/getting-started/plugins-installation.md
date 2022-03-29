---
sidebar_position: 2
---

# Plugins installation

Let's look how to install plugins on example of [SmartHomeApi.Plugins.VirtualState](https://github.com/hdimon/SmartHomeApi.Plugins.VirtualState) plugin.

## Manual installation

1. Create `SmartHomeApi.Plugins.VirtualState` directory inside `Plugins` one which was created by SmartHomeApi during installation.
2. Download latest [plugin](https://github.com/hdimon/SmartHomeApi.Plugins.VirtualState/releases) from Releases and extract its files into `SmartHomeApi.Plugins.VirtualState` directory.
3. That's done. Some plugins will start to work automatically after putting them to appropriate directory but the most plugins require own config files (as VirtualState plugin). Create config file with any name (for example VirtualStates.json) in Configs directory which also was created during installation. Put next text inside VirtualStates.json:
```
{
    "ItemId": "MyVirtualStates",
	"ItemType": "Virtual_States"
}
```
4. If you [request](/external-api/http-rest) now SmartHomeApi state you should see created item.

## Installation via plugins manager

It's in [TODO list](/whats-next#plugins-manager) and will be implemented soon.