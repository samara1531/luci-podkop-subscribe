#!/bin/sh
# Installation script for luci-podkop-subscribe (sing-box oriented)

set -e

REPO_URL="https://raw.githubusercontent.com/AlexeDark/luci-podkop-subscribe/main"
BASE_URL="${REPO_URL}/files"

echo "=========================================="
echo "Install: luci-app-podkop-subscribe"
echo "=========================================="

if [ "$(id -u)" -ne 0 ]; then
  echo "Error: run as root"
  exit 1
fi

if ! opkg list-installed | grep -qE "^(podkop|luci-app-podkop) "; then
  echo "Error: Podkop is not installed"
  echo "Install first: opkg install podkop"
  exit 1
fi

if ! command -v wget >/dev/null 2>&1; then
  echo "Installing wget..."
  opkg update >/dev/null 2>&1 || true
  opkg install wget
fi

mkdir -p /www/cgi-bin
mkdir -p /www/luci-static/resources/view/podkop
mkdir -p /usr/share/rpcd/acl.d
mkdir -p /usr/bin

if [ -f /www/luci-static/resources/view/podkop/section.js ] && [ ! -f /www/luci-static/resources/view/podkop/section.js.backup ]; then
  cp /www/luci-static/resources/view/podkop/section.js /www/luci-static/resources/view/podkop/section.js.backup
fi

echo "Downloading plugin files..."

wget -q -O /www/cgi-bin/podkop-subscribe "${BASE_URL}/www/cgi-bin/podkop-subscribe"
chmod +x /www/cgi-bin/podkop-subscribe

wget -q -O /www/cgi-bin/podkop-configs-cache "${BASE_URL}/www/cgi-bin/podkop-configs-cache"
chmod +x /www/cgi-bin/podkop-configs-cache

wget -q -O /www/cgi-bin/podkop-subscribe-refresh "${BASE_URL}/www/cgi-bin/podkop-subscribe-refresh"
chmod +x /www/cgi-bin/podkop-subscribe-refresh

wget -q -O /www/cgi-bin/podkop-subscribe-ping "${BASE_URL}/www/cgi-bin/podkop-subscribe-ping"
chmod +x /www/cgi-bin/podkop-subscribe-ping

wget -q -O /www/luci-static/resources/view/podkop/section.js "${BASE_URL}/www/luci-static/resources/view/podkop/section.js"
chmod 644 /www/luci-static/resources/view/podkop/section.js

wget -q -O /www/luci-static/resources/view/podkop/subscribe.js "${BASE_URL}/www/luci-static/resources/view/podkop/subscribe.js"
chmod 644 /www/luci-static/resources/view/podkop/subscribe.js

wget -q -O /www/luci-static/resources/view/podkop/subscribe-loader.js "${BASE_URL}/www/luci-static/resources/view/podkop/subscribe-loader.js" || true
chmod 644 /www/luci-static/resources/view/podkop/subscribe-loader.js 2>/dev/null || true

wget -q -O /usr/share/rpcd/acl.d/luci-app-podkop-subscribe.json "${BASE_URL}/usr/share/rpcd/acl.d/luci-app-podkop-subscribe.json"

wget -q -O /usr/bin/podkop-subscribe-autoupdate "${BASE_URL}/usr/bin/podkop-subscribe-autoupdate"
chmod +x /usr/bin/podkop-subscribe-autoupdate

CRON_LINE="*/5 * * * * /usr/bin/podkop-subscribe-autoupdate >/dev/null 2>&1"
CRON_FILE="/etc/crontabs/root"
if [ -f "$CRON_FILE" ]; then
  grep -Fq "/usr/bin/podkop-subscribe-autoupdate" "$CRON_FILE" || echo "$CRON_LINE" >> "$CRON_FILE"
else
  echo "$CRON_LINE" > "$CRON_FILE"
fi
/etc/init.d/cron restart >/dev/null 2>&1 || true

/etc/init.d/uhttpd restart >/dev/null 2>&1 || true

echo ""
echo "=========================================="
echo "Installed successfully"
echo "=========================================="
echo ""
echo "For XHTTP/REALITY in Outbound mode install sing-box-extended:"
echo "https://github.com/EikeiDev/OpenWRT-sing-box-extended?tab=readme-ov-file"
echo ""
echo "Auto-update scheduler installed:"
echo "- Cron: every 5 minutes"
echo "- Real interval and priorities are configured per section in LuCI"
echo ""
echo "Open LuCI: Services -> Podkop"
echo ""
