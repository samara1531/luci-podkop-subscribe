#!/bin/sh
# OpenWrt 25.12 (apk) installer

set -e

REPO_URL="https://raw.githubusercontent.com/samara1531/luci-podkop-subscribe/main"
BASE_URL="${REPO_URL}/files"

echo "=========================================="
echo "Install: luci-app-podkop-subscribe (apk)"
echo "=========================================="

[ "$(id -u)" -ne 0 ] && {
  echo "Error: run as root"
  exit 1
}

# проверка podkop
if ! apk info | grep -qE "^(podkop|luci-app-podkop)$"; then
  echo "Error: Podkop is not installed"
  echo "Install first: apk add podkop"
  exit 1
fi

# wget
if ! command -v wget >/dev/null 2>&1; then
  echo "Installing wget..."
  apk add wget
fi

mkdir -p \
  /www/cgi-bin \
  /www/luci-static/resources/view/podkop \
  /usr/share/rpcd/acl.d \
  /usr/bin

chmod 755 \
  /www/cgi-bin \
  /www/luci-static/resources/view/podkop \
  /usr/share/rpcd/acl.d \
  /usr/bin

# backup
if [ -f /www/luci-static/resources/view/podkop/section.js ] && \
   [ ! -f /www/luci-static/resources/view/podkop/section.js.backup ]; then
  cp /www/luci-static/resources/view/podkop/section.js \
     /www/luci-static/resources/view/podkop/section.js.backup
fi

echo "Downloading plugin files..."

fetch() {
  wget -q -O "$1" "$2"
}

# CGI (пока оставляем, хоть и legacy)
fetch /www/cgi-bin/podkop-subscribe "${BASE_URL}/www/cgi-bin/podkop-subscribe"
chmod +x /www/cgi-bin/podkop-subscribe

fetch /www/cgi-bin/podkop-configs-cache "${BASE_URL}/www/cgi-bin/podkop-configs-cache"
chmod +x /www/cgi-bin/podkop-configs-cache

fetch /www/cgi-bin/podkop-subscribe-refresh "${BASE_URL}/www/cgi-bin/podkop-subscribe-refresh"
chmod +x /www/cgi-bin/podkop-subscribe-refresh

fetch /www/cgi-bin/podkop-subscribe-ping "${BASE_URL}/www/cgi-bin/podkop-subscribe-ping"
chmod +x /www/cgi-bin/podkop-subscribe-ping

fetch /www/cgi-bin/podkop-subscribe-apply "${BASE_URL}/www/cgi-bin/podkop-subscribe-apply"
chmod +x /www/cgi-bin/podkop-subscribe-apply

# LuCI
fetch /www/luci-static/resources/view/podkop/section.js \
      "${BASE_URL}/www/luci-static/resources/view/podkop/section.js"
chmod 644 /www/luci-static/resources/view/podkop/section.js

fetch /www/luci-static/resources/view/podkop/subscribe.js \
      "${BASE_URL}/www/luci-static/resources/view/podkop/subscribe.js"
chmod 644 /www/luci-static/resources/view/podkop/subscribe.js

wget -q -O /www/luci-static/resources/view/podkop/subscribe-loader.js \
  "${BASE_URL}/www/luci-static/resources/view/podkop/subscribe-loader.js" || true
chmod 644 /www/luci-static/resources/view/podkop/subscribe-loader.js 2>/dev/null || true

fetch /usr/share/rpcd/acl.d/luci-app-podkop-subscribe.json \
      "${BASE_URL}/usr/share/rpcd/acl.d/luci-app-podkop-subscribe.json"

# helper
fetch /usr/bin/podkop-subscribe-autoupdate \
      "${BASE_URL}/usr/bin/podkop-subscribe-autoupdate"
chmod +x /usr/bin/podkop-subscribe-autoupdate

# cron
CRON_LINE="*/5 * * * * /usr/bin/podkop-subscribe-autoupdate >/dev/null 2>&1"
CRON_FILE="/etc/crontabs/root"

grep -Fq "podkop-subscribe-autoupdate" "$CRON_FILE" 2>/dev/null || \
  echo "$CRON_LINE" >> "$CRON_FILE"

/etc/init.d/cron restart >/dev/null 2>&1 || true
/etc/init.d/uhttpd restart >/dev/null 2>&1 || true

echo ""
echo "=========================================="
echo "Installed successfully"
echo "=========================================="
echo ""
echo "Auto-update scheduler installed:"
echo "- Cron: every 5 minutes"
echo "- Real interval, sources and block list are configured per section in LuCI"
echo ""
echo "Please clear browser cache (Ctrl+F5)."
echo ""
