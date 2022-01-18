---
sidebar_position: 10
---

# What's next?

There are plans to implement some features which could provide better usability and reliability of your automation system.

## Plugins manager

Currently there is only one way to install plugins - put them manually into Plugins folder of SmartHomeApi data directory. It's not very convenient way so it would be nice feature to implement plugins manager which will download plugins and install them.

## Multi-instance

It would be great possibility to run more than one SmartHomeApi instance and work with them as with one instance, i.e. Instance A knows state of Instance B and can work with its Items, Instance B knows state of Instance A and can work with its Items too (currently you can run several instances but they will not operate like single system).

Additionally this feature will allow to run some external plugins in another instance in case if you want to test new plugin but don't want to do it in the same OS process as other plugins.

At last it will allow to use new versions of SmartHomeApi and keep old ones in case if some obsolete plugins are not supported by new versions due to major changes.

## Hot standby feature

Do you want to update OS/upgrade computer which hosts SmartHomeApi but don't want automation to stop working? Hot standby feature should help to create reliable fault-tolerant systems.