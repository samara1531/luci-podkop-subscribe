# luci-podkop-subscribe

Расширение LuCI для Podkop с импортом подписок, ручными ссылками, пинг-тестом и автовыбором лучших конфигов.

## Требования

- OpenWrt `24.10`-`25.12` с установленным оригинальным  [podkop](https://github.com/itdoginfo/podkop) и `luci-app-podkop`
- Для XHTTP/REALITY в runtime outbound нужен `sing-box-extended`
- После установки обязательно почистите кеш браузера, что-бы корректно отобразились новые настройки.

Автоматический установщик `sing-box-extended`:

https://github.com/EikeiDev/OpenWRT-sing-box-extended?tab=readme-ov-file

## Быстрая установка wrt 24.10

```sh
rm -f /tmp/podkop-subscribe-install.sh
wget -O /tmp/podkop-subscribe-install.sh https://raw.githubusercontent.com/samara1531/luci-podkop-subscribe/main/install.sh
sh /tmp/podkop-subscribe-install.sh
```
## Быстрая установка wrt 25.12
```sh
rm -f /tmp/podkop-subscribe-install.sh
wget -O /tmp/podkop-subscribe-install.sh https://raw.githubusercontent.com/samara1531/luci-podkop-subscribe/main/25.12-install.sh
sh /tmp/podkop-subscribe-install.sh
```

## Удаление wrt 24.10-25.12

```sh
wget -O /tmp/podkop-subscribe-uninstall.sh https://raw.githubusercontent.com/samara1531/luci-podkop-subscribe/main/25.12-uninstall.sh
sh /tmp/podkop-subscribe-uninstall.sh
```

## Основные возможности

- Импорт подписок для режимов Podkop:
  - `url`
  - `urltest`
  - `selector`
  - `outbound`
- Поддержка нескольких подписок:
  - основной `Subscribe URL`
  - `Extra Subscribe URLs` (DynamicList, кнопка `+`)
  - поддерживаются как классические base64-подписки, так и plain-text списки URL
- Поддержка ручных ссылок:
  - `Manual Config Links` (DynamicList, кнопка `+`)
  - поддерживаются `vless://`, `ss://`, `trojan://`, `hy2://`, `socks://`
- Действия для каждого конфига в списке:
  - `Set`
  - `Block/Unblock`
  - `Set` мгновенно применяет конфиг для режимов `url` и `outbound` через backend (без ручного `Save & Apply`)
- Пинг-логика:
  - кнопка `Ping Test` (без применения)
  - кнопка `Ping Test All` (проверка полного списка, может работать дольше; выполняется в фоне с polling статуса)
  - счетчик рядом с `Ping Test`: `tested/total`
  - пинг отображается у каждой строки
  - таймаут отображается как `timeout`
- UX списка:
  - сортировка (`by ping` / `original order`)
  - фильтр `Only alive`
- Автообновление:
  - интервалы: `15m/30m/1h/3h/6h/12h/24h`
  - cron-триггер каждые 5 минут
  - автоматический выбор лучшего конфига по задержке из всех включенных источников
  - заблокированные ссылки исключаются из автоселекта

## Режим Outbound

- При клике по строке конфига или `Set` выбранный `vless://` конвертируется в outbound JSON и записывается в `Outbound Configuration`.
- `Update Now` в режиме outbound также может автоматически применить лучший конфиг.
- Для runtime XHTTP/REALITY используйте `sing-box-extended`.

## Логика автоселекта

Все конфиги объединяются из:

- основного subscribe URL
- дополнительных subscribe URL
- ручных ссылок

Далее:

1. невалидные записи отбрасываются
2. заблокированные записи исключаются
3. выполняется пинг хостов
4. записи сортируются по задержке (меньше = лучше)
5. применяется действие для режима:
   - `url`: лучший один конфиг
   - `urltest`/`selector`: список лучших конфигов (с ограничением `Max Configs`)
   - `outbound`: возвращается лучший URL, JSON применяется из LuCI

## Примечания

- Проект файловый (не `.ipk`), поэтому как отдельный пакет в `opkg list-installed` он не отображается.
- После обновления frontend-файлов делайте жесткое обновление браузера (`Ctrl+F5`).
- Если скрипты скачивались на Windows и переносились вручную, проверьте Unix line endings и отсутствие BOM.
- Поле `Outbound Configuration` автоматически форматируется в pretty JSON при загрузке страницы (только визуально).

## Changelog (2026-02)

- UI/Theme:
  - Fixed dark theme (Argon) compatibility for subscribe list colors and hover states (removed white fallbacks).
  - Limited subscribe list width and improved responsive behavior on mobile.

- Blocking / Auto-update:
  - `Update Now` now uses current blocked list from UI (works even before manual Save).
  - Block list storage supports `enc:<urlencoded>` with backward compatibility.
  - Blocked matching improved: full URL + normalized `scheme://host:port` key to handle rotating params (`sni/sid/...`).

- Sources / Ping:
  - `Update Now`, `Ping Test`, and `Ping Test All` now use live sources from current UI form, including `Manual Config Links`.
  - Manual links are added before `Max Configs` truncation so they are not silently dropped from ping candidates.
  - Backend URL scheme parsing for manual links is case-insensitive (`VLESS://` is accepted).

- Stability:
  - Removed auto `Save & Apply` trigger after `Update Now` to avoid repeated loop runs on some LuCI pages.

- Localization:
  - Added Russian translations for new subscribe UI labels, hints, notifications, and status log texts.
