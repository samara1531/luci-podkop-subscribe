#!/bin/sh
# Uninstallation script for luci-app-podkop-subscribe

set +e

echo "=========================================="
echo "luci-app-podkop-subscribe Uninstallation"
echo "=========================================="
echo ""

if [ "$(id -u)" -ne 0 ]; then
    echo "Error: This script must be run as root"
    exit 1
fi

echo "Step 1: Removing plugin files..."

PLUGIN_REMOVED=0

for f in \
  /www/cgi-bin/podkop-subscribe \
  /www/cgi-bin/podkop-configs-cache \
  /www/cgi-bin/podkop-subscribe-refresh \
  /www/luci-static/resources/view/podkop/subscribe.js \
  /www/luci-static/resources/view/podkop/subscribe-loader.js \
  /usr/share/rpcd/acl.d/luci-app-podkop-subscribe.json \
  /usr/bin/podkop-subscribe-autoupdate
 do
  if [ -f "$f" ]; then
    rm -f "$f"
    echo "  removed: $f"
    PLUGIN_REMOVED=1
  fi
 done

if [ "$PLUGIN_REMOVED" -eq 0 ]; then
    echo "  no plugin files found"
fi

if [ -f /etc/crontabs/root ]; then
  grep -v '/usr/bin/podkop-subscribe-autoupdate' /etc/crontabs/root > /tmp/crontab.root.$$ 2>/dev/null
  mv /tmp/crontab.root.$$ /etc/crontabs/root 2>/dev/null
  /etc/init.d/cron restart >/dev/null 2>&1 || true
fi

echo ""
echo "Step 2: Cleaning subscribe options in /etc/config/podkop..."

UCI_CLEANED=0
if command -v uci >/dev/null 2>&1 && [ -f /etc/config/podkop ]; then
  for key in $(uci show podkop 2>/dev/null | grep -E '\.subscribe_url=|\.subscribe_url_outbound=|\.subscribe_auto_update=|\.subscribe_update_interval=|\.subscribe_priority_rules=|\.subscribe_exclude_keywords=|\.subscribe_max_configs=' | cut -d'=' -f1); do
    [ -n "$key" ] || continue
    uci delete "$key" 2>/dev/null && UCI_CLEANED=1
  done
  if [ "$UCI_CLEANED" -eq 1 ]; then
    uci commit podkop 2>/dev/null
    echo "  subscribe options cleaned"
  else
    echo "  no subscribe options found"
  fi
else
  echo "  uci or /etc/config/podkop not available"
fi

echo ""
echo "Step 3: Restoring original Podkop section.js..."

RESTORED=0
if [ -f /www/luci-static/resources/view/podkop/section.js.backup ]; then
  cp /www/luci-static/resources/view/podkop/section.js.backup /www/luci-static/resources/view/podkop/section.js
  echo "  restored from backup"
  RESTORED=1
elif [ -f /rom/www/luci-static/resources/view/podkop/section.js ]; then
  cp /rom/www/luci-static/resources/view/podkop/section.js /www/luci-static/resources/view/podkop/section.js
  echo "  restored from /rom"
  RESTORED=1
fi

if [ "$RESTORED" -eq 0 ]; then
  echo "  warning: section.js not restored automatically"
fi

echo ""
echo "Step 4: Cleaning cache..."
rm -rf /tmp/podkop-subscribe-cache 2>/dev/null
rm -rf /tmp/podkop-subscribe-autoupdate* 2>/dev/null

echo ""
echo "Step 5: Restarting services..."
/etc/init.d/uhttpd restart >/dev/null 2>&1 || true

echo ""
echo "=========================================="
echo "Uninstallation finished"
echo "=========================================="
echo "Please clear browser cache (Ctrl+F5)."
