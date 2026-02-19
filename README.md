# luci-podkop-subscribe

Расширение LuCI для Podkop с импортом подписок, ручными ссылками, пинг-тестом и автовыбором лучших конфигов.

## Требования

- OpenWrt с установленным `podkop` или `luci-app-podkop`
- Для XHTTP/REALITY в runtime outbound нужен `sing-box-extended`

Автоматический установщик `sing-box-extended`:

https://github.com/EikeiDev/OpenWRT-sing-box-extended?tab=readme-ov-file

## Быстрая установка

```sh
wget -O /tmp/podkop-subscribe-install.sh https://raw.githubusercontent.com/AlexeDark/luci-podkop-subscribe/main/install.sh
sh /tmp/podkop-subscribe-install.sh
```

## Удаление

```sh
wget -O /tmp/podkop-subscribe-uninstall.sh https://raw.githubusercontent.com/AlexeDark/luci-podkop-subscribe/main/uninstall.sh
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
