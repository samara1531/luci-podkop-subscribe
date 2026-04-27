#!/bin/sh
# OpenWrt 25.12 uninstall (fixed)

set +e

echo "=========================================="
echo "luci-app-podkop-subscribe Uninstallation"
echo "=========================================="
echo ""

[ "$(id -u)" -ne 0 ] && {
    echo "Error: run as root"
    exit 1
}

echo "Step 1: Removing plugin files..."

for f in \
  /www/cgi-bin/podkop-subscribe \
  /www/cgi-bin/podkop-configs-cache \
  /www/cgi-bin/podkop-subscribe-refresh \
  /www/cgi-bin/podkop-subscribe-apply \
  /www/cgi-bin/podkop-subscribe-ping \
  /www/luci-static/resources/view/podkop/subscribe.js \
  /www/luci-static/resources/view/podkop/subscribe-loader.js \
  /usr/share/rpcd/acl.d/luci-app-podkop-subscribe.json \
  /usr/libexec/rpcd/podkop-subscribe* \
  /usr/bin/podkop-subscribe-autoupdate
do
  [ -f "$f" ] && {
    rm -f "$f"
    echo "  removed: $f"
  }
done

# cleanup empty dirs (аккуратно)
rmdir /www/luci-static/resources/view/podkop 2>/dev/null || true

echo ""
echo "Step 2: Fixing cron..."

CRON_FILE="/etc/crontabs/root"

if [ -f "$CRON_FILE" ]; then
  tmp="/tmp/crontab.root.$$"
  grep -v 'podkop-subscribe-autoupdate' "$CRON_FILE" > "$tmp" 2>/dev/null

  if [ -s "$tmp" ]; then
    mv "$tmp" "$CRON_FILE"
  else
    rm -f "$tmp"
  fi

  /etc/init.d/cron restart >/dev/null 2>&1 || true
fi

echo ""
echo "Step 3: Cleaning UCI..."

if command -v uci >/dev/null 2>&1 && [ -f /etc/config/podkop ]; then
  uci show podkop 2>/dev/null | \
  grep -E '\.subscribe_' | \
  cut -d'=' -f1 | while read key; do
    uci delete "$key" 2>/dev/null
  done
  uci commit podkop 2>/dev/null
fi

echo ""
echo "Step 4: Restoring section.js..."

if [ -f /www/luci-static/resources/view/podkop/section.js.backup ]; then
  mv /www/luci-static/resources/view/podkop/section.js.backup \
     /www/luci-static/resources/view/podkop/section.js
  echo "  restored from backup"
elif [ -f /rom/www/luci-static/resources/view/podkop/section.js ]; then
  cp /rom/www/luci-static/resources/view/podkop/section.js \
     /www/luci-static/resources/view/podkop/section.js
  echo "  restored from /rom"
else
  echo "  warning: not restored"
fi

echo ""
echo "Step 5: Cleaning cache..."
rm -rf /tmp/podkop-subscribe-* 2>/dev/null

echo ""
echo "Step 6: Restarting services..."
/etc/init.d/uhttpd restart >/dev/null 2>&1 || true

echo ""
echo "=========================================="
echo "Uninstallation finished"
echo "=========================================="
echo "Please clear browser cache (Ctrl+F5)."


