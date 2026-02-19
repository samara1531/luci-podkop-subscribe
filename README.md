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
- Auto-update can periodically refresh subscription and re-evaluate servers by latency.

## Auto Update + Priorities

New per-section options in LuCI:

- `Auto Update Subscribe` - enable background updates.
- `Update Interval` - 15m/30m/1h/3h/6h/12h/24h.
- `Priority Rules` - `keyword=score` pairs, comma-separated.
- `Exclude Keywords` - comma-separated keywords to ignore.
- `Max Configs` - cap for URLTest/Selector auto-filled lists.

How it works:

- Scheduler runs every 5 minutes via cron.
- For sections with enabled auto-update:
  - Downloads subscription.
  - Parses configs.
  - Excludes configs by keywords.
  - Pings config hosts.
  - Applies priority score + latency sorting.
  - Updates Podkop section:
    - `url` mode: picks best single config.
    - `urltest`/`selector`: writes sorted top configs.
    - `outbound`: currently only refreshes state; JSON apply remains manual in LuCI.
