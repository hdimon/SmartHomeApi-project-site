---
sidebar_position: 5
---

# 5 - External dependencies

`SmartHomeApi.Plugins.ProcessInfo` plugin doesn't use any other packages excepting `SmartHomeApi.ItemUtils`, in-build .NET possibilities are enough for plugins's purposes.
There is a bit different case with `SmartHomeApi.Plugins.MqttAdapter` though. It uses popular [MQTTnet](https://github.com/dotnet/MQTTnet) library and references it from NuGet.

Currently SmartHomeApi is not able to resolve dependencies automatically so external libraries should be delivered with plugin. In case if your plugin does not reference other packages (like `SmartHomeApi.Plugins.ProcessInfo` for example) then it requires nothing special. But if it is (like `SmartHomeApi.Plugins.MqttAdapter`) then you should modify project file in this way:
```
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
    <CopyLocalLockFileAssemblies>true</CopyLocalLockFileAssemblies>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="MQTTnet" Version="3.1.0" />
    <PackageReference Include="SmartHomeApi.ItemUtils" Version="1.4.0-alpha-6" ExcludeAssets="Runtime" />
  </ItemGroup>

</Project>
```

Actually there are two changes in comparing with project file by default:
1. `<CopyLocalLockFileAssemblies>true</CopyLocalLockFileAssemblies>` line is needed. It says compiler to copy dependencies into output folder together with plugin files.
2. `ExcludeAssets="Runtime"` for `SmartHomeApi.ItemUtils` so that this package will not be copied into output folder since it's not needed for SmartHomeApi.

That's it.