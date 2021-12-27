---
sidebar_position: 1
---

# Installation

## Prerequisites

[Download](/download) zip with application for your OS and extract it.

## Windows

1. Put `SmartHomeApi.WebApi.exe` into directory where you want SmartHomeApi to run, for example `C:\SmartHomeApi`.
2. Run `SmartHomeApi.WebApi.exe`. Message `appsettings.json not found so run installer` will appear and then SmartHomeApi will lead you through simple initial configuration workflow.
3. After configuration you can either select `Exit CLI and run SmartHomeApi` or `Generate install/uninstall service scripts`. `Scripts` directory will contain Readme and two `.bat` files for installing SmartHomeApi as Windows service and for uninstalling.
4. Run `InstallWindowsService.bat` in `C:\SmartHomeApi\Scripts` directory with Administrator privileges. SmartHomeApi will be installed as Windows service and started.

:::info

In case if you skipped `Generate install/uninstall service scripts` and exited SmartHomeApi you always can enter CLI mode running SmartHomeApi with `cli` parameter and generate scripts later.

:::

## Linux

This instruction is for Ubuntu, for other systems it can be different.

1. Open terminal.
2. Execute `sudo nautilus`.
3. Create `SmartHomeApi` directory in `bin/` directory.
4. Put `SmartHomeApi.WebApi` into `bin/SmartHomeApi` directory. 
5. Right click on `SmartHomeApi.WebApi`, then Properties -> Permissions and check `Allow executing file as program`.
6. Open another terminal. Run `cd /` in order to get root directory, then execute `cd bin/SmartHomeApi` and then `sudo ./SmartHomeApi.WebApi`. Message `appsettings.json not found so run installer` will appear and then SmartHomeApi will lead you through simple initial configuration workflow.
7. After configuration you can select `Generate install/uninstall service scripts`. `Scripts` directory will contain Readme and `smarthomeapi.service` file for installing SmartHomeApi as daemon.
8. Copy `smarthomeapi.service` to `/etc/systemd/system` directory.
9. Open terminal and execute "sudo systemctl daemon-reload".
10. Execute "sudo systemctl start smarthomeapi".
11. Execute "sudo systemctl enable smarthomeapi" if you want a service to be launched at system startup.

:::info

In case if you skipped `Generate install/uninstall service scripts` and exited SmartHomeApi you always can enter CLI mode running SmartHomeApi with `cli` parameter and generate scripts later.

:::