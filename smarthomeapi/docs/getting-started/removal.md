---
sidebar_position: 2
---

# Removal

## Windows

Run `UninstallWindowsService.bat` in `Scripts` directory with Administrator privileges.

## Linux

This instruction is for Ubuntu, for other systems it can be different.

1. Open terminal and execute "sudo systemctl stop smarthomeapi" to stop service.
2. Open another terminal and execute "sudo nautilus".
3. Delete smarthomeapi.service file from "/etc/systemd/system".
4. Execute "sudo systemctl daemon-reload".