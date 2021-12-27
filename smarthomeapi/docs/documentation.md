---
sidebar_position: 1
---

# Introduction

## What is SmartHomeApi?

SmartHomeApi is cross-platform plugin-based system for home automation that is run on .NET platform.
The main goal of SmartHomeApi is to give possibility to implement any logic - from simplest to the most complex and at the same time keeping possibility to debug it like normal .NET application.

## Does SmartHomeApi have user interface?

Currently not. It might be possible in future but now we concentrate on implementing things which should make SmartHomeApi more powerful and provide some useful features out of box. Refer [What's next](/whats-next) section for details.

Nevertheless SmartHomeApi can easily interact with any existing systems like openHAB, Home Assistant and others via HTTP API, MQTT or other protocols which can be implemented in SmartHomeApi plugins. So you can use your favorite system as UI for SmartHomeApi!

## What are the advantages of SmartHomeApi?

SmartHomeApi is designed to be as flexible as possible - it's just minimal core and functionality is extended with plugins. Even some system features are intended to be replaceable with implementations from custom plugins! 

SmartHomeApi is created on .NET 6 platform that gives great opportunities:
- Good performance
- Easy installation - SmartHomeApi is delivered as just one executable file and nothing else is required to run it
- Possibility to cover logic of your plugins with unit tests