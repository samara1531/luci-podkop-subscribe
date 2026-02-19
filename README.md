# luci-podkop-subscribe

![luci-podkop-subscribe](img.png)

LuCI extension for Podkop with Subscribe URL support.

## What changed

- Outbound mode now fills Podkop `Outbound Configuration` directly with parsed JSON.
- For XHTTP/REALITY use `sing-box-extended`.

## sing-box-extended (required for XHTTP/REALITY runtime)

Automatic installer and docs:

https://github.com/EikeiDev/OpenWRT-sing-box-extended?tab=readme-ov-file

## Quick install

```bash
sh <(wget -O - https://raw.githubusercontent.com/mr-Abdrahimov/luci-podkop-subscribe/main/install.sh)
```

## Uninstall

```bash
sh <(wget -O - https://raw.githubusercontent.com/mr-Abdrahimov/luci-podkop-subscribe/main/uninstall.sh)
```

## Supported modes

- Connection URL
- Outbound Config
- URLTest
- Selector

## Notes

- In `Outbound Config`, selecting an item from Subscribe list writes generated JSON to `Outbound Configuration`.
- Then click `Save & Apply` in LuCI.
