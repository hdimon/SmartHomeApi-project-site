---
sidebar_position: 20
---

# Backward compatibility

## SmartHomeApi

SmartHomeApi versions are managed in according to [Semantic Versioning](https://semver.org/) rules. So it means that newer major version of SmartHomeApi (for example 3.y.z) has breaking changes and will not be compatible with version 2.y.z or 1.y.z. All breaking changes will be listed in Release notes.

## Plugins

In opposite to SmartHomeApi core application plugins have a bit different behavior.

Each plugin should refer to SmartHomeApi.Utils package which is delivered together with SmartHomeApi and has the same version.

Normally it would mean that if plugin refers for example to SmartHomeApi.Utils 1.2.0 then it will not work in SmartHomeApi with version >= 2.0.0 because different major version means breaking changes and .NET will follow this rule and throw error.

It also would mean that with every new major release of SmartHomeApi all existing plugins would stop working in this new version till they will be upgraded to refer to new version of SmartHomeApi.Utils.

This situation is not acceptable so SmartHomeApi is able to support plugins of different previous versions providing backward compatibility.
In order to see which is `Minimal supported version` of plugins it's enough to run SmartHomeApi and find in logs something like:
`Minimal supported version of SmartHomeApi.Utils is 1.4.0.0.`

This feature will allow us to improve SmartHomeApi smoothly even with breaking changes.

For example let's say current version is 1.0.0 and we are going to introduce MethodB instead of MethodA. Currently all plugins use MethodA.

We introduce MethodB in release 1.1.0 and anounce MethodA as obsolete. Existing plugins with SmartHomeApi.Utils 1.0.0 will continue to work in SmartHomeApi 1.1.0 but when you upgrade your plugin with reference to SmartHomeApi.Utils 1.1.0 it will not be compiled and force you to replace usage of MethodA with MethodB.

When we are ready we could release SmartHomeApi 2.0.0, finally remove MethodA and set `Minimal supported version` as 1.1.0. Thus plugins which had been upgraded to 1.1.0 will continue working in 2.0.0 version.