# luci-podkop-subscribe

LuCI extension for Podkop with subscription import, manual proxy links, ping test, and auto-selection.

## Requirements

- OpenWrt with `podkop` or `luci-app-podkop` installed
- For XHTTP/REALITY in outbound runtime: `sing-box-extended`

Automatic installer for `sing-box-extended`:

https://github.com/EikeiDev/OpenWRT-sing-box-extended?tab=readme-ov-file

## Quick Install

```sh
wget -O /tmp/podkop-subscribe-install.sh https://raw.githubusercontent.com/AlexeDark/luci-podkop-subscribe/main/install.sh
sh /tmp/podkop-subscribe-install.sh
```

## Uninstall

```sh
wget -O /tmp/podkop-subscribe-uninstall.sh https://raw.githubusercontent.com/AlexeDark/luci-podkop-subscribe/main/uninstall.sh
sh /tmp/podkop-subscribe-uninstall.sh
```

## Main Features

- Subscribe import for Podkop modes:
  - `url`
  - `urltest`
  - `selector`
  - `outbound`
- Multi-subscribe support:
  - main `Subscribe URL`
  - `Extra Subscribe URLs` (DynamicList, with `+`)
- Manual links support:
  - `Manual Config Links` (DynamicList, with `+`)
  - supports `vless://`, `ss://`, `trojan://`, `hy2://`, `socks://`
- Per-config actions in list:
  - `Set`
  - `Block/Unblock`
- Ping workflow:
  - `Ping Test` button (no apply)
  - optional `Ping All Configs` mode (checks full list, may be slower)
  - counter near Ping Test button: `tested/total`
  - ping shown per row
  - timeout shown as `timeout`
- List UX:
  - sort toggle (`by ping` / `original order`)
  - `Only alive` filter
- Auto update:
  - interval: `15m/30m/1h/3h/6h/12h/24h`
  - cron trigger every 5 minutes
  - best config auto-selected by latency from all enabled sources
  - blocked links are excluded from auto-selection

## Outbound Mode

- Clicking config row or `Set` converts selected `vless://` into outbound JSON and writes it to Podkop `Outbound Configuration`.
- `Update Now` in outbound mode also applies best config JSON automatically.
- For XHTTP/REALITY runtime, use `sing-box-extended`.

## Auto-Selection Logic

All configs are merged from:

- main subscribe URL
- extra subscribe URLs
- manual links

Then:

1. invalid entries are skipped
2. blocked entries are excluded
3. host ping is tested
4. entries are sorted by ping (lower is better)
5. mode action is applied:
   - `url`: best single config
   - `urltest`/`selector`: top configs list (limited by `Max Configs`)
   - `outbound`: best URL returned, JSON applied from LuCI flow

## Notes

- This project is file-based (not an `.ipk` package), so it will not appear in `opkg list-installed` as a dedicated package.
- Use browser hard refresh (`Ctrl+F5`) after frontend updates.
- If scripts were downloaded on Windows and transferred manually, ensure Unix line endings and no BOM.
