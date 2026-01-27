#!/bin/sh
# Скрипт установки luci-app-podkop-subscribe

set -e

REPO_URL="https://raw.githubusercontent.com/mr-Abdrahimov/luci-podkop-subscribe/main"
BASE_URL="${REPO_URL}/files"

echo "=========================================="
echo "Установка luci-app-podkop-subscribe"
echo "=========================================="
echo ""

# Проверка прав root
if [ "$(id -u)" -ne 0 ]; then
    echo "Ошибка: Скрипт должен быть запущен от имени root"
    exit 1
fi

# Проверка установки Podkop
if ! opkg list-installed | grep -qE "^(podkop|luci-app-podkop) "; then
    echo "Ошибка: Podkop не установлен"
    echo "Сначала установите Podkop: opkg install podkop"
    exit 1
fi

# Проверка наличия section.js
if [ ! -f /www/luci-static/resources/view/podkop/section.js ] && [ ! -f /overlay/upper/www/luci-static/resources/view/podkop/section.js ]; then
    echo "Предупреждение: Файл интерфейса Podkop LuCI не найден"
    echo "Плагин создаст section.js, но интерфейс Podkop может работать некорректно"
    echo "Убедитесь, что интерфейс Podkop LuCI установлен правильно"
fi

# Проверка установки wget
if ! command -v wget >/dev/null 2>&1; then
    echo "Установка wget..."
    opkg update >/dev/null 2>&1 || true
    opkg install wget || {
        echo "Ошибка: Не удалось установить wget"
        exit 1
    }
fi

echo "Шаг 1: Создание директорий..."
mkdir -p /www/cgi-bin
mkdir -p /www/luci-static/resources/view/podkop
mkdir -p /usr/share/rpcd/acl.d

echo "Шаг 2: Резервное копирование оригинальных файлов Podkop..."

# Вспомогательная функция для проверки наличия кода плагина
contains_plugin_code() {
    [ ! -f "$1" ] && return 1
    grep -q "podkop-subscribe-config-list\|podkop-subscribe-loading\|view.podkop.subscribe\|enhanceSectionWithSubscribe" "$1" 2>/dev/null
}

# Проверка существования резервной копии
if [ -f /www/luci-static/resources/view/podkop/section.js.backup ]; then
    if ! contains_plugin_code /www/luci-static/resources/view/podkop/section.js.backup; then
        echo "  ✓ Чистая резервная копия уже существует"
    else
        echo "  ⚠ Резервная копия содержит код плагина, попытка получить чистый оригинал..."
        # Попытка получить чистый оригинал из overlay
        if [ -f /overlay/upper/www/luci-static/resources/view/podkop/section.js ]; then
            if ! contains_plugin_code /overlay/upper/www/luci-static/resources/view/podkop/section.js; then
                cp /overlay/upper/www/luci-static/resources/view/podkop/section.js /www/luci-static/resources/view/podkop/section.js.backup
                echo "  ✓ Резервная копия пересоздана из overlay"
            fi
        fi
    fi
elif [ -f /www/luci-static/resources/view/podkop/section.js ]; then
    if ! contains_plugin_code /www/luci-static/resources/view/podkop/section.js; then
        # Текущий файл оригинальный, создаём резервную копию
        cp /www/luci-static/resources/view/podkop/section.js /www/luci-static/resources/view/podkop/section.js.backup
        echo "  ✓ Создана резервная копия: section.js.backup"
    else
        echo "  ℹ Текущий файл содержит код плагина (переустановка)"
        # Попытка найти оригинал в overlay
        if [ -f /overlay/upper/www/luci-static/resources/view/podkop/section.js ]; then
            if ! contains_plugin_code /overlay/upper/www/luci-static/resources/view/podkop/section.js; then
                cp /overlay/upper/www/luci-static/resources/view/podkop/section.js /www/luci-static/resources/view/podkop/section.js.backup
                echo "  ✓ Резервная копия создана из overlay"
            else
                echo "  ⚠ Чистый оригинал не найден для резервного копирования"
            fi
        else
            echo "  ⚠ Чистый оригинал не найден для резервного копирования"
        fi
    fi
else
    echo "  ⚠ Предупреждение: section.js не найден"
    # Попытка найти оригинал в overlay
    if [ -f /overlay/upper/www/luci-static/resources/view/podkop/section.js ]; then
        if ! contains_plugin_code /overlay/upper/www/luci-static/resources/view/podkop/section.js; then
            cp /overlay/upper/www/luci-static/resources/view/podkop/section.js /www/luci-static/resources/view/podkop/section.js.backup
            echo "  ✓ Резервная копия создана из overlay"
        fi
    fi
fi

echo "Шаг 3: Загрузка и установка файлов плагина..."

# Загрузка CGI скриптов
echo "  - Установка podkop-subscribe..."
wget -q -O /www/cgi-bin/podkop-subscribe "${BASE_URL}/www/cgi-bin/podkop-subscribe" || {
    echo "Ошибка: Не удалось загрузить podkop-subscribe"
    exit 1
}
chmod +x /www/cgi-bin/podkop-subscribe

echo "  - Установка podkop-xray-config..."
wget -q -O /www/cgi-bin/podkop-xray-config "${BASE_URL}/www/cgi-bin/podkop-xray-config" || {
    echo "Ошибка: Не удалось загрузить podkop-xray-config"
    exit 1
}
chmod +x /www/cgi-bin/podkop-xray-config

echo "  - Установка podkop-configs-cache..."
wget -q -O /www/cgi-bin/podkop-configs-cache "${BASE_URL}/www/cgi-bin/podkop-configs-cache" || {
    echo "Ошибка: Не удалось загрузить podkop-configs-cache"
    exit 1
}
chmod +x /www/cgi-bin/podkop-configs-cache

echo "  - Установка podkop-current-outbound..."
wget -q -O /www/cgi-bin/podkop-current-outbound "${BASE_URL}/www/cgi-bin/podkop-current-outbound" || {
    echo "Ошибка: Не удалось загрузить podkop-current-outbound"
    exit 1
}
chmod +x /www/cgi-bin/podkop-current-outbound

# Загрузка JavaScript файлов
echo "  - Установка section.js..."
wget -q -O /www/luci-static/resources/view/podkop/section.js "${BASE_URL}/www/luci-static/resources/view/podkop/section.js" || {
    echo "Ошибка: Не удалось загрузить section.js"
    exit 1
}
chmod 644 /www/luci-static/resources/view/podkop/section.js

echo "  - Установка subscribe.js..."
wget -q -O /www/luci-static/resources/view/podkop/subscribe.js "${BASE_URL}/www/luci-static/resources/view/podkop/subscribe.js" || {
    echo "Ошибка: Не удалось загрузить subscribe.js"
    exit 1
}
chmod 644 /www/luci-static/resources/view/podkop/subscribe.js

echo "  - Установка subscribe-loader.js..."
wget -q -O /www/luci-static/resources/view/podkop/subscribe-loader.js "${BASE_URL}/www/luci-static/resources/view/podkop/subscribe-loader.js" || {
    echo "Предупреждение: Не удалось загрузить subscribe-loader.js (опциональный файл)"
}
chmod 644 /www/luci-static/resources/view/podkop/subscribe-loader.js 2>/dev/null || true

# Загрузка ACL файла
echo "  - Установка конфигурации ACL..."
wget -q -O /usr/share/rpcd/acl.d/luci-app-podkop-subscribe.json "${BASE_URL}/usr/share/rpcd/acl.d/luci-app-podkop-subscribe.json" || {
    echo "Ошибка: Не удалось загрузить ACL файл"
    exit 1
}

echo ""
echo "=========================================="
echo "Установка Xray (опционально)"
echo "=========================================="
echo ""
echo "Xray необходим для поддержки протокола XHTTP в режиме Outbound Config."
echo ""
echo "Если вы планируете использовать режим 'Конфигурация Outbound' с XHTTP,"
echo "рекомендуется установить Xray. Для остальных режимов (Connection URL,"
echo "URLTest, Selector) Xray не требуется."
echo ""
echo "Установить Xray? (y/n)"
printf "Ваш выбор [y]: "

# Read user input with timeout
INSTALL_XRAY="y"
if read -t 30 user_input 2>/dev/null; then
    case "$user_input" in
        [Nn]|[Nn][Oo])
            INSTALL_XRAY="n"
            ;;
        *)
            INSTALL_XRAY="y"
            ;;
    esac
else
    echo ""
    echo "Тайм-аут ввода. Используется значение по умолчанию: да"
fi

if [ "$INSTALL_XRAY" = "y" ]; then
    echo ""
    echo "Шаг 4: Установка xray-core..."

    # Проверка установки xray-core
    if opkg list-installed | grep -q "^xray-core "; then
        echo "  ✓ xray-core уже установлен"
    else
        echo "  - Обновление списка пакетов..."
        opkg update >/dev/null 2>&1 || {
            echo "  ⚠ Предупреждение: Не удалось обновить список пакетов, продолжаем..."
        }
        
        echo "  - Установка xray-core..."
        opkg install xray-core || {
            echo "  ⚠ Предупреждение: Не удалось автоматически установить xray-core"
            echo "  Установите вручную: opkg update && opkg install xray-core"
        }
    fi

    echo "Шаг 5: Создание скрипта инициализации Xray..."

    # Проверка существования init скрипта xray
    if [ -f /etc/init.d/xray ]; then
        echo "  ✓ Скрипт инициализации Xray уже существует"
    else
        cat > /etc/init.d/xray << 'EOF'
#!/bin/sh /etc/rc.common

START=99
USE_PROCD=1
PROG=/usr/bin/xray

validate_config() {
    $PROG -test -config /etc/xray/config.json >/dev/null 2>&1
}

start_service() {
    validate_config || {
        echo "Xray: неверная конфигурация"
        return 1
    }
    procd_open_instance
    procd_set_param command $PROG -config /etc/xray/config.json
    procd_set_param respawn 60 5 5
    procd_set_param user root
    procd_set_param stdout 1
    procd_set_param stderr 1
    procd_close_instance
}
EOF

        chmod +x /etc/init.d/xray
        echo "  ✓ Скрипт инициализации Xray создан"
    fi

    echo "Шаг 6: Включение и запуск службы Xray..."

    # Включение службы xray
    /etc/init.d/xray enable >/dev/null 2>&1 && echo "  ✓ Служба Xray включена" || echo "  ⚠ Предупреждение: Не удалось включить службу Xray"

    # Создание директории конфигурации если не существует
    mkdir -p /etc/xray

    # Проверка существования конфигурации xray
    if [ ! -f /etc/xray/config.json ]; then
        echo "  ℹ Конфигурация Xray не найдена, пропускаем запуск службы"
        echo "  Примечание: Xray запустится автоматически после применения конфигурации"
    else
        # Попытка запуска службы xray
        /etc/init.d/xray start >/dev/null 2>&1 && {
            echo "  ✓ Служба Xray запущена"
            /etc/init.d/xray status >/dev/null 2>&1 && echo "  ✓ Xray работает" || echo "  ⚠ Статус Xray неизвестен"
        } || {
            echo "  ℹ Служба Xray не запущена (конфигурация может быть неверной или отсутствовать)"
        }
    fi
    
    XRAY_INSTALLED="yes"
else
    echo ""
    echo "Шаг 4-6: Установка Xray пропущена"
    echo "  ℹ Режим 'Конфигурация Outbound' не будет доступен"
    echo "  ℹ Вы можете установить Xray позже вручную: opkg install xray-core"
    XRAY_INSTALLED="no"
fi

echo ""
echo "Шаг 7: Перезапуск uhttpd..."
/etc/init.d/uhttpd restart >/dev/null 2>&1 || true

echo ""
echo "=========================================="
echo "Установка успешно завершена!"
echo "=========================================="
echo ""
echo "Плагин установлен. Пожалуйста:"
echo "1. Очистите кэш браузера (Ctrl+F5)"
echo "2. Перейдите в: LuCI -> Службы -> Podkop"
echo "3. Установите 'Тип подключения' в 'Proxy'"
echo "4. Установите 'Тип конфигурации' в 'Connection URL' или 'Outbound Config'"
echo "5. Вы увидите поле Subscribe URL"
echo ""
echo "Что было установлено:"
echo "  ✓ Плагин luci-app-podkop-subscribe"

if [ "$XRAY_INSTALLED" = "yes" ]; then
    echo "  ✓ Пакет xray-core"
    echo "  ✓ Скрипт инициализации Xray (/etc/init.d/xray)"
    echo "  ✓ Служба Xray включена"
else
    echo "  ⊘ Пакет xray-core (пропущен по выбору пользователя)"
fi

echo ""
echo "Возможности:"
echo "  - Режим Connection URL: Получение конфигураций и применение к Podkop"

if [ "$XRAY_INSTALLED" = "yes" ]; then
    echo "  - Режим Outbound Config: Получение конфигураций и применение напрямую к Xray"
else
    echo "  - Режим Outbound Config: Недоступен (требуется Xray)"
fi

echo "  - Режим URLTest: Автоматический выбор лучшего прокси по задержке"
echo "  - Режим Selector: Ручной выбор из нескольких прокси"
echo "  - Кнопка автозаполнения: Быстрая настройка Outbound"
echo "  - Кэширование конфигураций: Автоматическое сохранение и восстановление"
echo "  - Подсветка активных подключений во всех режимах"
echo "  - Поддержка протоколов: vless://, ss://, trojan://, hy2://, hysteria2://, socks://"
echo "  - Поддержка тем: Автоматическая адаптация к светлой/тёмной теме"
echo ""

if [ "$XRAY_INSTALLED" = "no" ]; then
    echo "Примечание:"
    echo "  Для использования режима 'Конфигурация Outbound' с XHTTP установите Xray:"
    echo "    opkg update && opkg install xray-core"
    echo "  Затем создайте init-скрипт или запустите установку плагина заново."
    echo ""
fi

echo "Для удаления запустите:"
echo "  sh <(wget -O - ${REPO_URL}/uninstall.sh)"
echo ""
