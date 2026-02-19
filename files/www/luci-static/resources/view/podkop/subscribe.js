"use strict";

"require form";
"require ui";
"require dom";
"require baseclass";
"require view.podkop.main as main";

// Inject CSS styles for theming support
function injectSubscribeStyles() {
  if (document.getElementById("podkop-subscribe-styles")) return;

  var style = document.createElement("style");
  style.id = "podkop-subscribe-styles";
  style.textContent = `
    .podkop-subscribe-loading {
      padding: 10px;
      background: var(--primary-color-low, #e3f2fd);
      border: 1px solid var(--primary-color-high, #2196f3);
      border-radius: 4px;
      color: var(--primary-color-high, #1976d2);
    }
    .podkop-subscribe-error {
      padding: 10px;
      background: #dc3545;
      border: 1px solid #c82333;
      border-radius: 4px;
      color: #ffffff;
      font-weight: 500;
    }
    .podkop-subscribe-error-small {
      margin-top: 5px;
      padding: 5px;
      background: #dc3545;
      border: 1px solid #c82333;
      border-radius: 4px;
      color: #ffffff;
      font-size: 12px;
      font-weight: 500;
    }
    .podkop-subscribe-success {
      margin-top: 5px;
      padding: 5px;
      background: #28a745;
      border: 1px solid #1e7e34;
      border-radius: 4px;
      color: #ffffff;
      font-size: 12px;
      font-weight: 500;
    }
    .podkop-subscribe-warning {
      margin-top: 5px;
      padding: 5px;
      background: var(--warn-color-low, #fff3cd);
      border: 1px solid var(--warn-color-medium, #ffc107);
      border-radius: 4px;
      color: var(--warn-color-high, #856404);
      font-size: 12px;
    }
    .podkop-subscribe-title {
      margin-bottom: 10px;
      font-size: 14px;
      color: var(--text-color-medium, #666);
    }
    .podkop-subscribe-list {
      max-height: 300px;
      overflow-y: auto;
      padding: 15px;
      border: 1px solid var(--background-color-low, #ddd);
      border-radius: 4px;
      background: var(--background-color-high, #f9f9f9);
    }
    .podkop-subscribe-item {
      margin: 8px 0;
      padding: 10px;
      border: 1px solid var(--background-color-low, #ccc);
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
      background: var(--background-color-high, white);
    }
    .podkop-subscribe-item:hover {
      background: var(--primary-color-low, #e8f4f8);
      border-color: var(--primary-color-high, #0078d4);
    }
    .podkop-subscribe-item.selected {
      background: var(--success-color-low, #d4edda);
      border-color: var(--success-color-medium, #28a745);
    }
    .podkop-subscribe-item.blocked {
      opacity: 0.7;
      border-style: dashed;
    }
    .podkop-subscribe-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
    }
    .podkop-subscribe-item-main {
      min-width: 0;
      flex: 1 1 auto;
    }
    .podkop-subscribe-item-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      flex: 0 0 auto;
    }
    .podkop-subscribe-ping {
      font-size: 12px;
      padding: 2px 6px;
      border-radius: 10px;
      background: var(--background-color-low, #e5e5e5);
      white-space: nowrap;
    }
    .podkop-subscribe-ping.bad {
      background: #dc3545;
      color: #fff;
    }
    .podkop-subscribe-btn {
      border: 1px solid var(--background-color-low, #999);
      border-radius: 4px;
      padding: 3px 8px;
      font-size: 12px;
      cursor: pointer;
      background: var(--background-color-high, #fff);
    }
    .podkop-subscribe-btn.apply {
      border-color: var(--primary-color-high, #2196f3);
    }
    .podkop-subscribe-btn.block {
      border-color: #dc3545;
      color: #dc3545;
    }
    .podkop-subscribe-item-title {
      font-weight: bold;
      margin-bottom: 3px;
      font-size: 13px;
      color: var(--text-color-high, inherit);
    }
    .podkop-subscribe-item-protocol {
      display: inline-block;
      padding: 1px 5px;
      margin-left: 8px;
      font-size: 10px;
      font-weight: 500;
      border-radius: 3px;
      background: transparent;
      border: 1px solid currentColor;
      opacity: 0.7;
      text-transform: uppercase;
    }
    .podkop-subscribe-label {
      width: 200px;
      padding-right: 10px;
      display: inline-block;
      vertical-align: top;
    }
    .podkop-subscribe-field {
      display: inline-block;
      width: calc(100% - 220px);
    }
    .podkop-subscribe-item.urltest-selected {
      background: var(--primary-color-low, #e3f2fd);
      border-color: var(--primary-color-high, #2196f3);
      position: relative;
    }
    .podkop-subscribe-item.urltest-selected::after {
      content: "✓";
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--primary-color-high, #2196f3);
      font-weight: bold;
      font-size: 16px;
    }
    .podkop-subscribe-item.xhttp-disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--error-color-low, #ffebee);
      border-color: var(--error-color-medium, #f44336);
    }
    .podkop-subscribe-item.xhttp-disabled:hover {
      background: var(--error-color-low, #ffebee);
      border-color: var(--error-color-medium, #f44336);
    }
    .podkop-subscribe-xhttp-badge {
      display: inline-block;
      padding: 1px 5px;
      margin-left: 8px;
      font-size: 10px;
      font-weight: 500;
      border-radius: 3px;
      background: #dc3545;
      border: 1px solid #c82333;
      color: #ffffff;
      text-transform: uppercase;
    }
    .podkop-subscribe-urltest-counter {
      display: inline-block;
      margin-left: 10px;
      padding: 2px 8px;
      background: var(--primary-color-high, #2196f3);
      color: white;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 500;
    }
  `;
  document.head.appendChild(style);
}

var sectionPingCache = {};

function normalizePingTitle(title) {
  return String(title || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

// Remove config lists when connection type or proxy_config_type changes
function removeConfigLists() {
  // Find all config lists by ID prefix pattern and remove them from DOM
  var allLists = document.querySelectorAll('[id^="podkop-subscribe-config-list"]');
  allLists.forEach(function(list) {
    if (list.parentNode) {
      list.parentNode.removeChild(list);
    }
  });
  // Also remove loading indicators
  var allLoading = document.querySelectorAll('[id^="podkop-subscribe-loading"]');
  allLoading.forEach(function(loading) {
    if (loading.parentNode) {
      loading.parentNode.removeChild(loading);
    }
  });
}

// Extract section_id from element ID (e.g., "cbid.podkop.cfg123.proxy_config_type" -> "cfg123")
function getSectionIdFromElement(el) {
  if (!el || !el.id) return null;
  var match = el.id.match(/podkop\.([^.]+)\./);
  return match ? match[1] : null;
}

// Refetch configs for a section when proxy_config_type changes
function refetchConfigsForSection(select) {
  var section_id = getSectionIdFromElement(select);
  if (!section_id) return;

  var newType = select.value;

  // Only refetch for url/urltest/selector modes
  if (newType !== "url" && newType !== "urltest" && newType !== "selector") {
    removeConfigLists();
    return;
  }

  // Find subscribe_url input for this section
  var subscribeInput = document.querySelector(
    'input[id*="' + section_id + '"][id*="subscribe_url"]'
  );
  if (!subscribeInput) {
    subscribeInput = document.getElementById("widget.cbid.podkop." + section_id + ".subscribe_url");
  }

  var subscribeUrl = subscribeInput ? subscribeInput.value : "";

  // Remove old lists first
  removeConfigLists();

  // Try to load from cache first, or fetch if we have a URL
  autoLoadCachedConfigs(section_id, newType);
  
  // If we have a URL, we could also refetch (but cache should be enough)
  // Uncomment below if you want to always refetch when changing modes
  /*
  if (subscribeUrl && subscribeUrl.length > 0) {
    var subscribeContainer = subscribeInput.closest(".cbi-value") ||
                             subscribeInput.closest(".cbi-section") ||
                             subscribeInput.parentElement;

    var isUrltest = (newType === "urltest");
    var isSelector = (newType === "selector");
    var listId = isUrltest
      ? "podkop-subscribe-config-list-urltest-" + section_id
      : (isSelector ? "podkop-subscribe-config-list-selector-" + section_id : "podkop-subscribe-config-list-" + section_id);

    fetchConfigs(subscribeUrl, subscribeContainer, listId, false, section_id, isUrltest, isSelector);
  }
  */
}

// Initialize change handlers for dropdowns
function initConfigListHandlers() {
  var connectionTypeSelect = document.querySelector(
    'select[id*="connection_type"]'
  );
  if (!connectionTypeSelect) {
    connectionTypeSelect = document.querySelector(
      'select[name*="connection_type"]'
    );
  }

  if (connectionTypeSelect && !connectionTypeSelect._podkopSubscribeHandler) {
    var handler = function () {
      removeConfigLists();
    };
    connectionTypeSelect.addEventListener("change", handler);
    connectionTypeSelect._podkopSubscribeHandler = handler;
  }

  // Find ALL proxy_config_type selects (for multiple sections)
  var proxyConfigTypeSelects = document.querySelectorAll(
    'select[id*="proxy_config_type"]'
  );

  proxyConfigTypeSelects.forEach(function(select) {
    if (!select._podkopSubscribeHandler) {
      var handler = function () {
        refetchConfigsForSection(select);
      };
      select.addEventListener("change", handler);
      select._podkopSubscribeHandler = handler;
    }
  });
}

// Create error message element
function createErrorMessage(text, small) {
  var div = document.createElement("div");
  div.className = small ? "podkop-subscribe-error-small" : "podkop-subscribe-error";
  if (!small) {
    div.style.marginTop = "10px";
  }
  div.textContent = text;
  return div;
}

// Create success message element
function createSuccessMessage(text) {
  var div = document.createElement("div");
  div.className = "podkop-subscribe-success";
  div.textContent = text;
  return div;
}

function decodeComponent(value) {
  if (value == null) return "";
  try {
    return decodeURIComponent(String(value).replace(/\+/g, "%20"));
  } catch (e) {
    return String(value);
  }
}

function parseVlessConfigUrl(vlessUrl) {
  if (!vlessUrl || typeof vlessUrl !== "string") {
    throw new Error(_("Empty config URL"));
  }
  if (!/^vless:\/\//i.test(vlessUrl)) {
    throw new Error(_("Only vless:// URLs are supported for outbound conversion"));
  }

  var parsed = new URL(vlessUrl);
  var params = parsed.searchParams;

  var uuid = decodeComponent(parsed.username || "");
  var server = decodeComponent(parsed.hostname || "");
  var port = parseInt(parsed.port || "443", 10);
  var tag = decodeComponent((parsed.hash || "").replace(/^#/, "")) || _("VLESS outbound");

  if (!uuid) {
    throw new Error(_("UUID was not found in URL"));
  }
  if (!server) {
    throw new Error(_("Server was not found in URL"));
  }
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error(_("Invalid server port"));
  }

  var transportType = decodeComponent(params.get("type") || "tcp");
  var security = decodeComponent(params.get("security") || "none");
  var sni = decodeComponent(params.get("sni") || server);
  var hostParam = decodeComponent(params.get("host") || sni || server);
  var pathParam = decodeComponent(params.get("path") || "/");
  var modeParam = decodeComponent(params.get("mode") || "auto");
  var fingerprint = decodeComponent(params.get("fp") || "");
  var publicKey = decodeComponent(params.get("pbk") || "");
  var shortId = decodeComponent(params.get("sid") || "");
  var flow = decodeComponent(params.get("flow") || "");
  var packetEncoding = decodeComponent(params.get("packetEncoding") || "");
  var alpn = decodeComponent(params.get("alpn") || "");

  var outbound = {
    type: "vless",
    tag: tag,
    server: server,
    server_port: port,
    uuid: uuid,
    flow: flow
  };

  if (security === "tls" || security === "reality") {
    var tls = {
      enabled: true,
      server_name: sni || server
    };

    if (alpn) {
      tls.alpn = alpn.split(",").map(function(item) {
        return item.trim();
      }).filter(function(item) {
        return item.length > 0;
      });
    } else {
      tls.alpn = ["h2", "http/1.1"];
    }

    if (security === "reality") {
      tls.reality = {
        enabled: true,
        public_key: publicKey,
        short_id: shortId
      };
    }

    if (fingerprint) {
      tls.utls = {
        enabled: true,
        fingerprint: fingerprint
      };
    }

    outbound.tls = tls;
  }

  if (packetEncoding) {
    outbound.packet_encoding = packetEncoding;
  }

  if (transportType === "xhttp") {
    outbound.transport = {
      type: "xhttp",
      path: pathParam || "/",
      host: hostParam || server,
      mode: modeParam || "auto"
    };
  } else if (transportType === "ws") {
    outbound.transport = {
      type: "ws",
      path: pathParam || "/"
    };
    if (hostParam) {
      outbound.transport.headers = { Host: hostParam };
    }
  } else if (transportType && transportType !== "tcp") {
    outbound.transport = { type: transportType };
  }

  return outbound;
}

function findOutboundTextarea(section_id) {
  return (
    document.getElementById("widget.cbid.podkop." + section_id + ".outbound_json") ||
    document.getElementById("cbid.podkop." + section_id + ".outbound_json") ||
    document.querySelector('textarea[id*="podkop.' + section_id + '.outbound_json"]')
  );
}

function setOutboundTextareaValue(section_id, outboundData) {
  var outboundTextarea = findOutboundTextarea(section_id);
  if (!outboundTextarea) {
    throw new Error(_("Could not find Outbound Configuration field"));
  }

  outboundTextarea.value = JSON.stringify(outboundData, null, 2);
  if (outboundTextarea.dispatchEvent) {
    outboundTextarea.dispatchEvent(new Event("change", { bubbles: true }));
    outboundTextarea.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

// Create warning/loading message element
function createWarningMessage(text) {
  var div = document.createElement("div");
  div.className = "podkop-subscribe-warning";
  div.textContent = text;
  return div;
}

// Find subscribe input field for specific section
function findSubscribeInput(ev, section_id, fieldName) {
  var subscribeInput = null;

  // First try: find by exact section_id in element ID (with widget prefix)
  subscribeInput = document.querySelector(
    "#widget.cbid.podkop." + section_id + "." + fieldName
  );
  if (subscribeInput) return subscribeInput;

  // Second try: without widget prefix
  subscribeInput = document.querySelector(
    "#cbid.podkop." + section_id + "." + fieldName
  );
  if (subscribeInput) return subscribeInput;

  // Third try: via button's closest section-node
  if (ev && ev.target) {
    var button = ev.target.closest("button") || ev.target;
    var sectionNode = button.closest(".cbi-section-node");
    if (sectionNode) {
      subscribeInput = sectionNode.querySelector(
        'input[id*="' + section_id + '"][id*="' + fieldName + '"]'
      );
      if (subscribeInput) return subscribeInput;

      subscribeInput = sectionNode.querySelector('input[id*="' + fieldName + '"]');
      if (subscribeInput) return subscribeInput;
    }
  }

  return null;
}

// Get subscribe URL value for specific section
function getSubscribeUrl(ev, section_id, fieldName) {
  // Use findSubscribeInput to get the correct input for this section
  var input = findSubscribeInput(ev, section_id, fieldName);
  if (input && input.value) {
    return input.value;
  }
  return "";
}

function getFieldInput(section_id, fieldName) {
  return (
    document.getElementById("widget.cbid.podkop." + section_id + "." + fieldName) ||
    document.getElementById("cbid.podkop." + section_id + "." + fieldName) ||
    document.querySelector('input[id*="podkop.' + section_id + "." + fieldName + '"]') ||
    document.querySelector('textarea[id*="podkop.' + section_id + "." + fieldName + '"]')
  );
}

function getBlockedUrls(section_id) {
  var input = getFieldInput(section_id, "subscribe_blocked_urls");
  if (!input || !input.value) return [];
  return input.value.split(",").map(function(v) { return v.trim(); }).filter(Boolean);
}

function setBlockedUrls(section_id, urls) {
  var input = getFieldInput(section_id, "subscribe_blocked_urls");
  if (!input) return;
  input.value = urls.join(",");
  if (input.dispatchEvent) {
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

function updateSectionPingCache(section_id, result) {
  if (!result) return;
  var byUrl = {};
  var byTitle = {};
  for (var i = 1; i <= 50; i++) {
    var url = result["top" + i + "_url"];
    var ping = result["top" + i + "_ping"];
    var title = result["top" + i + "_title"];
    if (url) byUrl[url] = ping;
    if (title) byTitle[normalizePingTitle(title)] = ping;
  }
  sectionPingCache[section_id] = {
    byUrl: byUrl,
    byTitle: byTitle
  };
}

function runImmediateAutoUpdate(section_id) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/cgi-bin/podkop-subscribe-refresh", true);
    xhr.setRequestHeader("Content-Type", "text/plain");

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status !== 200) {
        reject(new Error("HTTP " + xhr.status));
        return;
      }
      try {
        var result = JSON.parse(xhr.responseText);
        if (result && !result.error) {
          resolve(result);
        } else {
          reject(new Error(result && result.error ? result.error : "Unknown error"));
        }
      } catch (e) {
        reject(new Error("Invalid JSON response"));
      }
    };

    xhr.onerror = function () {
      reject(new Error("Network error"));
    };

    xhr.send(section_id);
  });
}

function runImmediatePingTest(section_id) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/cgi-bin/podkop-subscribe-ping", true);
    xhr.setRequestHeader("Content-Type", "text/plain");

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status !== 200) {
        reject(new Error("HTTP " + xhr.status));
        return;
      }
      try {
        var result = JSON.parse(xhr.responseText);
        if (result && !result.error) {
          resolve(result);
        } else {
          reject(new Error(result && result.error ? result.error : "Unknown error"));
        }
      } catch (e) {
        reject(new Error("Invalid JSON response"));
      }
    };

    xhr.onerror = function () {
      reject(new Error("Network error"));
    };

    xhr.send(section_id);
  });
}

function renderImmediateAutoUpdateLog(section_id, result, isError, ev) {
  var logId = "podkop-subscribe-runlog-" + section_id;
  var logEl = document.getElementById(logId);

  if (!logEl) {
    logEl = document.createElement("div");
    logEl.id = logId;
    logEl.style.marginTop = "8px";
    logEl.style.whiteSpace = "pre-line";
    logEl.className = "podkop-subscribe-warning";

    var anchor = null;
    if (ev && ev.target) {
      anchor = ev.target.closest(".cbi-value");
    }
    if (anchor && anchor.parentNode) {
      if (anchor.nextSibling) {
        anchor.parentNode.insertBefore(logEl, anchor.nextSibling);
      } else {
        anchor.parentNode.appendChild(logEl);
      }
    }
  }

  var lines = [];
  if (isError) {
    lines.push("Status: error");
    lines.push("Details: " + (result && result.message ? result.message : "failed"));
  } else {
    updateSectionPingCache(section_id, result);
    lines.push("Status: " + (result.status || "ok"));
    if (result.mode) lines.push("Mode: " + result.mode);
    if (result.total != null) lines.push("Found configs: " + result.total);
    if (result.eligible != null) lines.push("Eligible: " + result.eligible);
    if (result.excluded != null) lines.push("Excluded: " + result.excluded);
    if (result.best_title) lines.push("Best: " + result.best_title);
    if (result.changed != null) lines.push("Changed: " + (String(result.changed) === "1" ? "yes" : "no"));
    if (result.applied != null) lines.push("Applied entries: " + result.applied);
    if (result.note) lines.push("Note: " + result.note);
    if (result.reason) lines.push("Reason: " + result.reason);

    var topLines = [];
    for (var i = 1; i <= 5; i++) {
      var t = result["top" + i + "_title"];
      var p = result["top" + i + "_ping"];
      if (t) {
        topLines.push(i + ". " + t + (p ? " - " + p + " ms" : ""));
      }
    }
    if (topLines.length > 0) {
      lines.push("Top by ping:");
      lines = lines.concat(topLines);
    }
  }

  if (isError) {
    logEl.className = "podkop-subscribe-error-small";
  } else if (result && result.status === "skipped") {
    logEl.className = "podkop-subscribe-warning";
  } else {
    logEl.className = "podkop-subscribe-success";
  }
  logEl.textContent = lines.join("\n");
}

// Check if should show config list
function shouldShowConfigList() {
  try {
    var connectionTypeSelect = document.querySelector(
      'select[id*="connection_type"]'
    );
    if (!connectionTypeSelect) {
      connectionTypeSelect = document.querySelector(
        'select[name*="connection_type"]'
      );
    }
    if (connectionTypeSelect && connectionTypeSelect.value === "proxy") {
      return true;
    }
  } catch (e) {
    // ignore
  }
  return false;
}

// Check if config URL contains xhttp transport type
function isXhttpConfig(url) {
  if (!url || typeof url !== "string") return false;
  try {
    // Parse URL parameters
    var queryStart = url.indexOf("?");
    if (queryStart === -1) return false;

    var hashStart = url.indexOf("#");
    var queryString = hashStart > queryStart
      ? url.substring(queryStart + 1, hashStart)
      : url.substring(queryStart + 1);

    var params = queryString.split("&");
    for (var i = 0; i < params.length; i++) {
      var param = params[i].split("=");
      if (param[0] === "type" && param[1] === "xhttp") {
        return true;
      }
    }
  } catch (e) {
    // ignore parsing errors
  }
  return false;
}

// Get current proxy_config_type value
function getCurrentProxyConfigType(section_id) {
  var select = document.querySelector(
    'select[id*="' + section_id + '"][id*="proxy_config_type"]'
  );
  if (!select) {
    select = document.querySelector('select[id*="proxy_config_type"]');
  }
  if (!select) {
    select = document.querySelector('select[name*="proxy_config_type"]');
  }
  return select ? select.value : null;
}

// Create loading indicator
function createLoadingIndicator(id) {
  var loadingIndicator = document.createElement("div");
  loadingIndicator.id = id;
  loadingIndicator.className = "cbi-value";
  loadingIndicator.style.cssText = "margin-top: 10px; margin-bottom: 10px;";

  var loadingLabel = document.createElement("label");
  loadingLabel.className = "cbi-value-title podkop-subscribe-label";
  loadingLabel.textContent = "";
  loadingIndicator.appendChild(loadingLabel);

  var loadingContent = document.createElement("div");
  loadingContent.className = "cbi-value-field podkop-subscribe-field podkop-subscribe-loading";
  loadingContent.textContent = _("Получение конфигураций...");
  loadingIndicator.appendChild(loadingContent);

  return loadingIndicator;
}

// Create config list UI
function createConfigListUI(configs, listId, isOutbound, section_id, isUrltest, isSelector) {
  var configListContainer = document.createElement("div");
  configListContainer.id = listId;
  configListContainer.className = "cbi-value";

  var shouldShow = shouldShowConfigList();
  configListContainer.style.cssText =
    "margin-top: 15px; margin-bottom: 15px;"
    + (shouldShow ? "" : "display: none;");

  var labelContainer = document.createElement("label");
  labelContainer.className = "cbi-value-title podkop-subscribe-label";
  labelContainer.textContent = _("Доступные конфигурации");
  configListContainer.appendChild(labelContainer);

  var contentContainer = document.createElement("div");
  contentContainer.className = "cbi-value-field podkop-subscribe-field";

  var title = document.createElement("div");
  title.className = "podkop-subscribe-title";

  var titleText;
  if (isOutbound) {
    titleText = _("Нажмите на конфигурацию для применения в sing-box");
  } else if (isUrltest) {
    titleText = _("Нажмите на конфигурации для добавления в URLTest (повторный клик - удаление)");
  } else if (isSelector) {
    titleText = _("Нажмите на конфигурации для добавления в Selector (повторный клик - удаление)");
  } else {
    titleText = _("Нажмите на конфигурацию для выбора");
  }
  title.textContent = titleText + " (" + configs.length + ")";

  // Add counter for urltest/selector mode
  if (isUrltest || isSelector) {
    var counterIdSuffix = isSelector ? "selector" : "urltest";
    var counter = document.createElement("span");
    counter.className = "podkop-subscribe-urltest-counter";
    counter.id = "podkop-subscribe-" + counterIdSuffix + "-counter-" + section_id;
    counter.textContent = _("Выбрано: 0");
    title.appendChild(counter);
  }

  contentContainer.appendChild(title);

  var configList = document.createElement("div");
  configList.className = "podkop-subscribe-list";

  // Store for selected configs
  if (isUrltest) {
    configList._urltestSelected = [];
  } else if (isSelector) {
    configList._selectorSelected = [];
  }

  // For urltest/selector, get selected URLs from DynamicList
  var selectedUrls = [];
  if (isUrltest || isSelector) {
    var fieldName = isUrltest ? "urltest_proxy_links" : "selector_proxy_links";
    var baseId = "cbid.podkop." + section_id + "." + fieldName;
    var hiddenInputs = document.querySelectorAll('input[type="hidden"][name="' + baseId + '"]');
    hiddenInputs.forEach(function(input) {
      if (input.value && input.value.trim()) {
        selectedUrls.push(input.value.trim());
      }
    });
  }

  var blockedLookup = {};
  getBlockedUrls(section_id).forEach(function(url) {
    blockedLookup[url] = true;
  });

  // Function to render configs with current URL highlighting
  var renderConfigs = function(currentConfigUrl) {
    configs.forEach(function (config, index) {
    var configItem = document.createElement("div");
    configItem.className = "podkop-subscribe-item";
    if (blockedLookup[config.url]) {
      configItem.classList.add("blocked");
    }

    // Check if this is an xhttp config
    var isXhttp = isXhttpConfig(config.url);
    if (isXhttp && !isOutbound) {
      configItem.classList.add("xhttp-disabled");
    }
    
    // Highlight if this config is currently selected
    var isCurrentlySelected = false;
    if (isUrltest || isSelector) {
      // Check if URL is in selected list
      if (selectedUrls.indexOf(config.url) !== -1) {
        configItem.classList.add("urltest-selected");
        isCurrentlySelected = true;
        // Add to internal selected array
        if (isUrltest) {
          if (!configList._urltestSelected) configList._urltestSelected = [];
          if (configList._urltestSelected.indexOf(config.url) === -1) {
            configList._urltestSelected.push(config.url);
          }
        } else if (isSelector) {
          if (!configList._selectorSelected) configList._selectorSelected = [];
          if (configList._selectorSelected.indexOf(config.url) === -1) {
            configList._selectorSelected.push(config.url);
          }
        }
      }
    } else if (currentConfigUrl && config.url === currentConfigUrl) {
      configItem.classList.add("selected");
      isCurrentlySelected = true;
    }

    var configTitle = document.createElement("div");
    configTitle.className = "podkop-subscribe-item-title";

    var titleText = config.title || _("Конфигурация") + " " + (index + 1);
    configTitle.textContent = titleText;

    // Add protocol badge
    if (config.protocol) {
      var protocolBadge = document.createElement("span");
      protocolBadge.className = "podkop-subscribe-item-protocol";
      protocolBadge.textContent = config.protocol;
      configTitle.appendChild(protocolBadge);
    }

    // Add xhttp warning badge
    if (isXhttp && !isOutbound) {
      var xhttpBadge = document.createElement("span");
      xhttpBadge.className = "podkop-subscribe-xhttp-badge";
      xhttpBadge.textContent = "XHTTP";
      xhttpBadge.title = _("XHTTP не поддерживается по умолчанию");
      configTitle.appendChild(xhttpBadge);
    }

    var row = document.createElement("div");
    row.className = "podkop-subscribe-row";
    var mainCol = document.createElement("div");
    mainCol.className = "podkop-subscribe-item-main";
    mainCol.appendChild(configTitle);
    row.appendChild(mainCol);

    var actions = document.createElement("div");
    actions.className = "podkop-subscribe-item-actions";

    var pingLabel = document.createElement("span");
    pingLabel.className = "podkop-subscribe-ping";
    var pingCache = sectionPingCache[section_id] || {};
    var pingByUrl = pingCache.byUrl || {};
    var pingByTitle = pingCache.byTitle || {};
    var pingValue = pingByUrl[config.url];
    if (pingValue == null || pingValue === "") {
      pingValue = pingByTitle[normalizePingTitle(config.title)];
    }
    if (pingValue != null && pingValue !== "") {
      pingLabel.textContent = String(pingValue) === "999999" ? "timeout" : (pingValue + " ms");
      if (String(pingValue) === "999999") {
        pingLabel.classList.add("bad");
      }
    } else {
      pingLabel.textContent = "-";
    }
    actions.appendChild(pingLabel);

    var applyBtn = document.createElement("button");
    applyBtn.type = "button";
    applyBtn.className = "podkop-subscribe-btn apply";
    applyBtn.textContent = (isUrltest || isSelector) ? _("Выбрать") : _("Установить");
    actions.appendChild(applyBtn);

    var blockBtn = document.createElement("button");
    blockBtn.type = "button";
    blockBtn.className = "podkop-subscribe-btn block";
    blockBtn.textContent = blockedLookup[config.url] ? _("Разблокировать") : _("Блокировать");
    actions.appendChild(blockBtn);

    row.appendChild(actions);
    configItem.appendChild(row);

    // Store config data on element for urltest/selector
    configItem._configData = config;

    var applyHandler;
    if (isOutbound) {
      applyHandler = createOutboundClickHandlerEnhanced(config, configItem, configList, section_id);
    } else if (isUrltest) {
      applyHandler = createUrltestClickHandler(config, configItem, configList, section_id, isXhttp);
    } else if (isSelector) {
      applyHandler = createSelectorClickHandler(config, configItem, configList, section_id, isXhttp);
    } else {
      applyHandler = createUrlClickHandler(config, configItem, configList, section_id, isXhttp);
    }
    configItem.onclick = applyHandler;
    applyBtn.onclick = function(e) {
      e.stopPropagation();
      applyHandler(e);
    };
    blockBtn.onclick = function(e) {
      e.stopPropagation();
      if (blockedLookup[config.url]) {
        delete blockedLookup[config.url];
        configItem.classList.remove("blocked");
        blockBtn.textContent = _("Блокировать");
      } else {
        blockedLookup[config.url] = true;
        configItem.classList.add("blocked");
        blockBtn.textContent = _("Разблокировать");
      }
      setBlockedUrls(section_id, Object.keys(blockedLookup));
    };

      configList.appendChild(configItem);
    });
    
    // Update counter for urltest/selector with pre-selected count
    if (isUrltest || isSelector) {
      var counterIdSuffix = isSelector ? "selector" : "urltest";
      var counter = document.getElementById("podkop-subscribe-" + counterIdSuffix + "-counter-" + section_id);
      if (counter) {
        counter.textContent = _("Выбрано: ") + selectedUrls.length;
      }
    }
  };

  // Get current selected config for highlighting and render
  if (!isUrltest && !isSelector) {
    var mode = isOutbound ? "outbound" : "url";
    getCurrentConfigUrl(section_id, mode, function(currentUrl) {
      renderConfigs(currentUrl);
    });
  } else {
    // For urltest/selector, render immediately
    renderConfigs(null);
  }

  contentContainer.appendChild(configList);
  configListContainer.appendChild(contentContainer);

  return configListContainer;
}

// Click handler for URL mode
function createUrlClickHandler(config, configItem, configList, section_id, isXhttp) {
  return function (e) {
    e.stopPropagation();

    // Block xhttp configs
    if (isXhttp) {
      var errorDiv = createErrorMessage(_("XHTTP не поддерживается по умолчанию"), true);
      configItem.appendChild(errorDiv);
      setTimeout(function () {
        if (errorDiv.parentNode) {
          errorDiv.parentNode.removeChild(errorDiv);
        }
      }, 3000);
      return;
    }

    // Find proxy_string textarea for THIS section (section_id specific first)
    var proxyTextarea =
      document.getElementById("widget.cbid.podkop." + section_id + ".proxy_string") ||
      document.getElementById("cbid.podkop." + section_id + ".proxy_string") ||
      document.querySelector('textarea[id*="podkop." + section_id + ".proxy_string"]');

    if (proxyTextarea) {
      proxyTextarea.value = config.url;
      if (proxyTextarea.dispatchEvent) {
        proxyTextarea.dispatchEvent(new Event("change", { bubbles: true }));
        proxyTextarea.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }

    // Reset all items
    var allItems = configList.querySelectorAll(".podkop-subscribe-item");
    allItems.forEach(function (item) {
      item.classList.remove("selected");
    });

    // Mark selected
    configItem.classList.add("selected");

    var successDiv = createSuccessMessage(_("Конфигурация выбрана"));
    configItem.appendChild(successDiv);
    setTimeout(function () {
      if (successDiv.parentNode) {
        successDiv.parentNode.removeChild(successDiv);
      }
    }, 2000);
  };
}

// Click handler for URLTest mode (multi-select toggle)
function createUrltestClickHandler(config, configItem, configList, section_id, isXhttp) {
  return function (e) {
    e.stopPropagation();

    // Block xhttp configs
    if (isXhttp) {
      var errorDiv = createErrorMessage(_("XHTTP не поддерживается по умолчанию"), true);
      configItem.appendChild(errorDiv);
      setTimeout(function () {
        if (errorDiv.parentNode) {
          errorDiv.parentNode.removeChild(errorDiv);
        }
      }, 3000);
      return;
    }

    // Toggle selection
    var isCurrentlySelected = configItem.classList.contains("urltest-selected");

    if (isCurrentlySelected) {
      // Remove from selection
      configItem.classList.remove("urltest-selected");

      // Remove from array
      var idx = configList._urltestSelected.indexOf(config.url);
      if (idx > -1) {
        configList._urltestSelected.splice(idx, 1);
      }
    } else {
      // Add to selection
      configItem.classList.add("urltest-selected");

      // Add to array
      if (configList._urltestSelected.indexOf(config.url) === -1) {
        configList._urltestSelected.push(config.url);
      }
    }

    // Update counter
    var counter = document.getElementById("podkop-subscribe-urltest-counter-" + section_id);
    if (counter) {
      counter.textContent = _("Выбрано: ") + configList._urltestSelected.length;
    }

    // Update the urltest_proxy_links DynamicList field
    updateUrltestProxyLinks(section_id, configList._urltestSelected);
  };
}

// Click handler for Selector mode (multi-select toggle)
function createSelectorClickHandler(config, configItem, configList, section_id, isXhttp) {
  return function (e) {
    e.stopPropagation();

    // Block xhttp configs
    if (isXhttp) {
      var errorDiv = createErrorMessage(_("XHTTP не поддерживается по умолчанию"), true);
      configItem.appendChild(errorDiv);
      setTimeout(function () {
        if (errorDiv.parentNode) {
          errorDiv.parentNode.removeChild(errorDiv);
        }
      }, 3000);
      return;
    }

    // Toggle selection (reusing urltest-selected class for visual styling)
    var isCurrentlySelected = configItem.classList.contains("urltest-selected");

    if (isCurrentlySelected) {
      // Remove from selection
      configItem.classList.remove("urltest-selected");

      // Remove from array
      var idx = configList._selectorSelected.indexOf(config.url);
      if (idx > -1) {
        configList._selectorSelected.splice(idx, 1);
      }
    } else {
      // Add to selection
      configItem.classList.add("urltest-selected");

      // Add to array
      if (configList._selectorSelected.indexOf(config.url) === -1) {
        configList._selectorSelected.push(config.url);
      }
    }

    // Update counter
    var counter = document.getElementById("podkop-subscribe-selector-counter-" + section_id);
    if (counter) {
      counter.textContent = _("Выбрано: ") + configList._selectorSelected.length;
    }

    // Update the selector_proxy_links DynamicList field
    updateSelectorProxyLinks(section_id, configList._selectorSelected);
  };
}

// Update urltest_proxy_links DynamicList field with selected configs
function updateUrltestProxyLinks(section_id, selectedUrls) {
  var baseId = "cbid.podkop." + section_id + ".urltest_proxy_links";
  updateDynamicList(section_id, baseId, selectedUrls, "urltest_proxy_links");
}

// Update selector_proxy_links DynamicList field with selected configs
function updateSelectorProxyLinks(section_id, selectedUrls) {
  var baseId = "cbid.podkop." + section_id + ".selector_proxy_links";
  updateDynamicList(section_id, baseId, selectedUrls, "selector_proxy_links");
}

// Helper to update any DynamicList
function updateDynamicList(section_id, baseId, selectedUrls, fieldName) {
  // Find the DynamicList widget container
  var dynlistWidget = document.querySelector(
    '.cbi-dynlist input[name="' + baseId + '"]'
  );

  if (dynlistWidget) {
    dynlistWidget = dynlistWidget.closest('.cbi-dynlist');
  }

  if (!dynlistWidget) {
    // Try finding by ID
    var widgetId = "widget." + baseId;
    var node = document.getElementById(widgetId);
    if (node) {
      dynlistWidget = node.closest('.cbi-dynlist') || node.parentElement;
    }
  }

  if (!dynlistWidget) {
    console.warn("Could not find " + fieldName + " for section:", section_id);
    return;
  }

  // Find the text input used for adding items
  var addInput = dynlistWidget.querySelector('input[type="text"]');

  if (!addInput) {
    console.warn("Could not find add input in DynamicList");
    return;
  }

  // Step 1: Remove ALL existing items from DOM
  // Remove .item divs
  var existingItems = dynlistWidget.querySelectorAll('.item');
  existingItems.forEach(function(item) {
    item.parentNode.removeChild(item);
  });

  // Remove hidden inputs with our name
  var existingInputs = document.querySelectorAll('input[type="hidden"][name="' + baseId + '"]');
  existingInputs.forEach(function(input) {
    input.parentNode.removeChild(input);
  });

  // Also remove any inputs inside dynlist with our name
  var dynlistInputs = dynlistWidget.querySelectorAll('input[name="' + baseId + '"]');
  dynlistInputs.forEach(function(input) {
    if (input !== addInput && input.type !== 'text') {
      input.parentNode.removeChild(input);
    }
  });

  // Step 2: Add new items by simulating Enter key
  function addItem(url) {
    addInput.value = url;
    addInput.dispatchEvent(new Event('input', { bubbles: true }));
    addInput.dispatchEvent(new Event('change', { bubbles: true }));

    // Simulate Enter keypress
    var keydownEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true
    });
    addInput.dispatchEvent(keydownEvent);

    var keypressEvent = new KeyboardEvent('keypress', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true
    });
    addInput.dispatchEvent(keypressEvent);
  }

  // Add items with delay
  var delay = 100; // Start with small delay after clearing
  selectedUrls.forEach(function(url, index) {
    setTimeout(function() {
      addItem(url);
    }, delay);
    delay += 100;
  });

  // Clear input after all items added
  setTimeout(function() {
    addInput.value = '';
    // Trigger change to update form state
    dynlistWidget.dispatchEvent(new Event('change', { bubbles: true }));
  }, delay + 100);
}

// Click handler for Outbound mode
function createOutboundClickHandler(config, configItem, configList, section_id) {
  return createOutboundClickHandlerEnhanced(config, configItem, configList, section_id);
}
function createOutboundClickHandlerEnhanced(config, configItem, configList, section_id) {
  return function (e) {
    e.stopPropagation();

    var loadingText = createWarningMessage(_("Applying configuration..."));
    configItem.appendChild(loadingText);

    try {
      var outboundData = parseVlessConfigUrl(config.url);
      setOutboundTextareaValue(section_id, outboundData);
    } catch (parseErr) {
      if (loadingText.parentNode) {
        loadingText.parentNode.removeChild(loadingText);
      }
      var parseErrorDiv = createErrorMessage(
        _("Failed to convert URL to outbound JSON: ") + parseErr.message,
        true
      );
      configItem.appendChild(parseErrorDiv);
      setTimeout(function () {
        if (parseErrorDiv.parentNode) {
          parseErrorDiv.parentNode.removeChild(parseErrorDiv);
        }
      }, 6000);
      return;
    }

    if (loadingText.parentNode) {
      loadingText.parentNode.removeChild(loadingText);
    }

    var allItems = configList.querySelectorAll(".podkop-subscribe-item");
    allItems.forEach(function (item) {
      item.classList.remove("selected");
    });
    configItem.classList.add("selected");

    var messageNode = createSuccessMessage(_("Outbound JSON is filled."));
    configItem.appendChild(messageNode);
    setTimeout(function () {
      if (messageNode.parentNode) {
        messageNode.parentNode.removeChild(messageNode);
      }
    }, 5000);
  };
}

// Fetch configs handler
function fetchConfigs(subscribeUrl, subscribeContainer, listId, isOutbound, section_id, isUrltest, isSelector) {
  // Remove old list for this section
  var existingList = document.getElementById(listId);
  if (existingList && existingList.parentNode) {
    existingList.parentNode.removeChild(existingList);
  }

  // Remove old loading indicator for this section
  var loadingSuffix = isOutbound ? "-outbound" : (isUrltest ? "-urltest" : (isSelector ? "-selector" : ""));
  var loadingId = "podkop-subscribe-loading-" + section_id + loadingSuffix;
  var existingLoading = document.getElementById(loadingId);
  if (existingLoading && existingLoading.parentNode) {
    existingLoading.parentNode.removeChild(existingLoading);
  }

  // Show loading
  var loadingIndicator = null;
  if (subscribeContainer) {
    loadingIndicator = createLoadingIndicator(loadingId);

    if (subscribeContainer.nextSibling) {
      subscribeContainer.parentNode.insertBefore(
        loadingIndicator,
        subscribeContainer.nextSibling
      );
    } else {
      subscribeContainer.parentNode.appendChild(loadingIndicator);
    }
  }

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/cgi-bin/podkop-subscribe", true);
  xhr.setRequestHeader("Content-Type", "text/plain");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (loadingIndicator && loadingIndicator.parentNode) {
        loadingIndicator.parentNode.removeChild(loadingIndicator);
      }

      if (xhr.status === 200) {
        try {
          var result = JSON.parse(xhr.responseText);

          if (result.error) {
            showTemporaryError(subscribeContainer, result.error);
            return;
          }

          if (!result || !result.configs || result.configs.length === 0) {
            showTemporaryError(subscribeContainer, _("Конфигурации не найдены"));
            return;
          }

          var configs = result.configs;
          if (!subscribeContainer) return;

          // Determine mode for cache
          var mode = isOutbound ? "outbound" : (isUrltest ? "urltest" : (isSelector ? "selector" : "url"));
          
          // Save configs to cache
          saveConfigsToCache(section_id, mode, configs);

          var configListContainer = createConfigListUI(
            configs,
            listId,
            isOutbound,
            section_id,
            isUrltest,
            isSelector
          );

          if (subscribeContainer.nextSibling) {
            subscribeContainer.parentNode.insertBefore(
              configListContainer,
              subscribeContainer.nextSibling
            );
          } else {
            subscribeContainer.parentNode.appendChild(configListContainer);
          }

          setTimeout(function () {
            initConfigListHandlers();
          }, 100);
        } catch (e) {
          showTemporaryError(
            subscribeContainer,
            _("Ошибка при разборе ответа: ") + e.message
          );
        }
      } else {
        showTemporaryError(
          subscribeContainer,
          _("Ошибка при получении конфигураций: HTTP ") + xhr.status
        );
      }
    }
  };

  xhr.onerror = function () {
    if (loadingIndicator && loadingIndicator.parentNode) {
      loadingIndicator.parentNode.removeChild(loadingIndicator);
    }
    showTemporaryError(
      subscribeContainer,
      _("Ошибка сети при получении конфигураций")
    );
  };

  xhr.send(subscribeUrl);
}

// Show temporary error
function showTemporaryError(container, message) {
  var errorDiv = createErrorMessage(message, false);
  if (container && container.nextSibling) {
    container.parentNode.insertBefore(errorDiv, container.nextSibling);
  } else if (container) {
    container.parentNode.appendChild(errorDiv);
  }
  setTimeout(function () {
    if (errorDiv.parentNode) {
      errorDiv.parentNode.removeChild(errorDiv);
    }
  }, 5000);
}

// Save configs to cache
function saveConfigsToCache(section_id, mode, configs) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/cgi-bin/podkop-configs-cache", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  
  var data = {
    section_id: section_id,
    mode: mode,
    data: {
      configs: configs
    }
  };
  
  xhr.send(JSON.stringify(data));
}

// Load configs from cache
function loadConfigsFromCache(section_id, mode, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/cgi-bin/podkop-configs-cache?section_id=" + encodeURIComponent(section_id) + "&mode=" + encodeURIComponent(mode), true);
  
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          var result = JSON.parse(xhr.responseText);
          if (result && result.configs && result.configs.length > 0) {
            callback(result.configs);
          } else {
            callback(null);
          }
        } catch (e) {
          callback(null);
        }
      } else {
        callback(null);
      }
    }
  };
  
  xhr.send();
}

// Get currently selected config URL
function getCurrentConfigUrl(section_id, mode, callback) {
  if (mode === "url") {
    // For URL mode, get proxy_string value
    var proxyTextarea =
      document.getElementById("widget.cbid.podkop." + section_id + ".proxy_string") ||
      document.getElementById("cbid.podkop." + section_id + ".proxy_string");
    if (callback) {
      callback(proxyTextarea ? proxyTextarea.value : null);
    } else {
      return proxyTextarea ? proxyTextarea.value : null;
    }
  } else if (mode === "urltest" || mode === "selector") {
    // For urltest/selector, we'll highlight all selected items
    if (callback) callback(null);
    return null;
  } else if (mode === "outbound") {
    // Outbound now applies directly to the form field.
    if (callback) callback(null);
    return null;
  }
  if (!callback) return null;
}

// Auto-load cached configs for a section
function autoLoadCachedConfigs(section_id, mode) {
  loadConfigsFromCache(section_id, mode, function(configs) {
    if (!configs || configs.length === 0) {
      return; // No cached configs
    }
    
    // Find subscribe container based on mode
    var fieldName = (mode === "outbound") ? "subscribe_url_outbound" : "subscribe_url";
    var subscribeInput = document.getElementById("widget.cbid.podkop." + section_id + "." + fieldName) ||
                         document.getElementById("cbid.podkop." + section_id + "." + fieldName);
    
    if (!subscribeInput) {
      return; // Subscribe input not found
    }
    
    var subscribeContainer = subscribeInput.closest(".cbi-value") ||
                             subscribeInput.closest(".cbi-section") ||
                             subscribeInput.parentElement;
    
    if (!subscribeContainer) {
      return;
    }
    
    // Determine list ID and flags
    var isOutbound = (mode === "outbound");
    var isUrltest = (mode === "urltest");
    var isSelector = (mode === "selector");
    var listId = isOutbound
      ? "podkop-subscribe-config-list-outbound-" + section_id
      : (isUrltest ? "podkop-subscribe-config-list-urltest-" + section_id
        : (isSelector ? "podkop-subscribe-config-list-selector-" + section_id
          : "podkop-subscribe-config-list-" + section_id));
    
    // Remove any existing list
    var existingList = document.getElementById(listId);
    if (existingList && existingList.parentNode) {
      existingList.parentNode.removeChild(existingList);
    }
    
    // Create and display the cached config list
    var configListContainer = createConfigListUI(
      configs,
      listId,
      isOutbound,
      section_id,
      isUrltest,
      isSelector
    );
    
    if (subscribeContainer.nextSibling) {
      subscribeContainer.parentNode.insertBefore(
        configListContainer,
        subscribeContainer.nextSibling
      );
    } else {
      subscribeContainer.parentNode.appendChild(configListContainer);
    }
  });
}

// Initialize auto-load for all sections
function initAutoLoadCachedConfigs() {
  // Wait for DOM to be ready
  setTimeout(function() {
    // Find all proxy_config_type selects
    var proxyConfigTypeSelects = document.querySelectorAll('select[id*="proxy_config_type"]');
    
    proxyConfigTypeSelects.forEach(function(select) {
      var section_id = getSectionIdFromElement(select);
      if (!section_id) return;
      
      var currentMode = select.value;
      
      // Only auto-load for modes that use subscribe
      if (currentMode === "url" || currentMode === "urltest" || currentMode === "selector" || currentMode === "outbound") {
        autoLoadCachedConfigs(section_id, currentMode);
      }
    });
  }, 800);
}

function enhanceSectionWithSubscribe(section) {
  // Inject CSS styles
  injectSubscribeStyles();

  // Initialize handlers after DOM load
  setTimeout(function () {
    initConfigListHandlers();
    initAutoLoadCachedConfigs();
  }, 500);

  // Subscribe URL for proxy_config_type = "url", "urltest" and "selector"
  var o = section.option(
    form.Value,
    "subscribe_url",
    _("Subscribe URL"),
    _("Введите Subscribe URL для получения конфигураций")
  );
  o.depends("proxy_config_type", "url");
  o.depends("proxy_config_type", "urltest");
  o.depends("proxy_config_type", "selector");
  o.placeholder = "https://example.com/subscribe";
  o.rmempty = true;

  // Validation
  o.validate = function (section_id, value) {
    if (!value || value.length === 0) {
      return true;
    }
    var validation = main.validateUrl(value);
    if (validation.valid) {
      return true;
    }
    return validation.message;
  };

  // Auto update settings for subscribe-driven modes
  o = section.option(
    form.Flag,
    "subscribe_auto_update",
    _("Auto Update Subscribe"),
    _("Periodically refresh subscription, test latency and auto-select best configs")
  );
  o.depends("proxy_config_type", "url");
  o.depends("proxy_config_type", "urltest");
  o.depends("proxy_config_type", "selector");
  o.depends("proxy_config_type", "outbound");
  o.default = "0";
  o.rmempty = false;

  o = section.option(
    form.ListValue,
    "subscribe_update_interval",
    _("Update Interval"),
    _("How often to refresh configs and re-evaluate best server")
  );
  o.depends("subscribe_auto_update", "1");
  o.value("15m", _("Every 15 minutes"));
  o.value("30m", _("Every 30 minutes"));
  o.value("1h", _("Every 1 hour"));
  o.value("3h", _("Every 3 hours"));
  o.value("6h", _("Every 6 hours"));
  o.value("12h", _("Every 12 hours"));
  o.value("24h", _("Every 24 hours"));
  o.default = "1h";
  o.rmempty = false;

  o = section.option(
    form.Value,
    "subscribe_blocked_urls",
    _("Blocked Config URLs"),
    _("Managed by buttons in config list; do not edit manually")
  );
  o.depends("subscribe_auto_update", "1");
  o.rmempty = true;

  o = section.option(
    form.Value,
    "subscribe_max_configs",
    _("Max Configs"),
    _("Limit number of configs used by auto-update in URLTest/Selector")
  );
  o.depends("subscribe_auto_update", "1");
  o.default = "20";
  o.rmempty = false;
  o.validate = function (section_id, value) {
    if (!value || value.length === 0) return true;
    if (/^[0-9]+$/.test(value) && parseInt(value, 10) >= 1 && parseInt(value, 10) <= 200) {
      return true;
    }
    return _("Must be a number in range 1-200");
  };

  o = section.option(
    form.Button,
    "subscribe_run_now",
    _("Update Now"),
    _("Run subscription refresh, ping test and best-server selection immediately")
  );
  o.depends("proxy_config_type", "url");
  o.depends("proxy_config_type", "urltest");
  o.depends("proxy_config_type", "selector");
  o.depends("proxy_config_type", "outbound");
  o.inputtitle = _("Update Now");
  o.inputstyle = "apply";
  o.onclick = function (ev, section_id) {
    if (ev && ev.preventDefault) ev.preventDefault();
    if (ev && ev.stopPropagation) ev.stopPropagation();

    ui.addNotification(null, E("p", {}, _("Running immediate auto-update...")), "info");

    runImmediateAutoUpdate(section_id).then(function (result) {
      var mode = getCurrentProxyConfigType(section_id) || "url";
      var finalResult = result || {};
      var effectiveMode = finalResult.mode || mode;

      if (effectiveMode === "outbound" && finalResult.best_url) {
        try {
          var outboundData = parseVlessConfigUrl(finalResult.best_url);
          setOutboundTextareaValue(section_id, outboundData);
          finalResult.changed = "1";
          finalResult.applied = "1";
          finalResult.note = "outbound_best_applied_to_json";
        } catch (e) {
          finalResult.note = "outbound_best_found_but_json_apply_failed";
        }
      }

      renderImmediateAutoUpdateLog(section_id, finalResult, false, ev);
      autoLoadCachedConfigs(section_id, effectiveMode);
      ui.addNotification(null, E("p", {}, _("Auto-update completed.")), "info");
    }).catch(function (err) {
      renderImmediateAutoUpdateLog(section_id, { message: err.message }, true, ev);
      ui.addNotification(null, E("p", {}, _("Auto-update failed: ") + err.message), "warning");
    });

    return false;
  };

  o = section.option(
    form.Button,
    "subscribe_ping_now",
    _("Ping Test"),
    _("Test latency for all subscription configs without applying the best server")
  );
  o.depends("proxy_config_type", "url");
  o.depends("proxy_config_type", "urltest");
  o.depends("proxy_config_type", "selector");
  o.depends("proxy_config_type", "outbound");
  o.inputtitle = _("Ping Test");
  o.inputstyle = "action";
  o.onclick = function (ev, section_id) {
    if (ev && ev.preventDefault) ev.preventDefault();
    if (ev && ev.stopPropagation) ev.stopPropagation();

    ui.addNotification(null, E("p", {}, _("Running ping test...")), "info");

    runImmediatePingTest(section_id).then(function (result) {
      var mode = getCurrentProxyConfigType(section_id) || "url";
      var finalResult = result || {};
      var effectiveMode = finalResult.mode || mode;
      updateSectionPingCache(section_id, finalResult);
      autoLoadCachedConfigs(section_id, effectiveMode);
      ui.addNotification(null, E("p", {}, _("Ping test completed.")), "info");
    }).catch(function (err) {
      ui.addNotification(null, E("p", {}, _("Ping test failed: ") + err.message), "warning");
    });

    return false;
  };

  // Fetch button for URL mode
  o = section.option(
    form.Button,
    "subscribe_fetch",
    _("Получить конфигурации"),
    _("Получить конфигурации из Subscribe URL")
  );
  o.depends("proxy_config_type", "url");
  o.inputtitle = _("Получить");
  o.inputstyle = "add";

  o.onclick = function (ev, section_id) {
    if (ev && ev.preventDefault) ev.preventDefault();
    if (ev && ev.stopPropagation) ev.stopPropagation();

    var subscribeUrl = getSubscribeUrl(ev, section_id, "subscribe_url");

    if (!subscribeUrl || subscribeUrl.length === 0) {
      ui.addNotification(null, E("p", {}, _("Пожалуйста, введите Subscribe URL")));
      return false;
    }

    var subscribeInput = findSubscribeInput(ev, section_id, "subscribe_url");
    var subscribeContainer = null;
    if (subscribeInput) {
      subscribeContainer =
        subscribeInput.closest(".cbi-value") ||
        subscribeInput.closest(".cbi-section") ||
        subscribeInput.parentElement;
    }

    fetchConfigs(
      subscribeUrl,
      subscribeContainer,
      "podkop-subscribe-config-list-" + section_id,
      false,
      section_id,
      false,
      false
    );

    return false;
  };

  // Fetch button for URLTest mode
  o = section.option(
    form.Button,
    "subscribe_fetch_urltest",
    _("Получить конфигурации"),
    _("Получить конфигурации из Subscribe URL для выбора в URLTest")
  );
  o.depends("proxy_config_type", "urltest");
  o.inputtitle = _("Получить");
  o.inputstyle = "add";

  o.onclick = function (ev, section_id) {
    if (ev && ev.preventDefault) ev.preventDefault();
    if (ev && ev.stopPropagation) ev.stopPropagation();

    var subscribeUrl = getSubscribeUrl(ev, section_id, "subscribe_url");

    if (!subscribeUrl || subscribeUrl.length === 0) {
      ui.addNotification(null, E("p", {}, _("Пожалуйста, введите Subscribe URL")));
      return false;
    }

    var subscribeInput = findSubscribeInput(ev, section_id, "subscribe_url");
    var subscribeContainer = null;
    if (subscribeInput) {
      subscribeContainer =
        subscribeInput.closest(".cbi-value") ||
        subscribeInput.closest(".cbi-section") ||
        subscribeInput.parentElement;
    }

    fetchConfigs(
      subscribeUrl,
      subscribeContainer,
      "podkop-subscribe-config-list-urltest-" + section_id,
      false,
      section_id,
      true,
      false
    );

    return false;
  };

  // Fetch button for Selector mode
  o = section.option(
    form.Button,
    "subscribe_fetch_selector",
    _("Получить конфигурации"),
    _("Получить конфигурации из Subscribe URL для выбора в Selector")
  );
  o.depends("proxy_config_type", "selector");
  o.inputtitle = _("Получить");
  o.inputstyle = "add";

  o.onclick = function (ev, section_id) {
    if (ev && ev.preventDefault) ev.preventDefault();
    if (ev && ev.stopPropagation) ev.stopPropagation();

    var subscribeUrl = getSubscribeUrl(ev, section_id, "subscribe_url");

    if (!subscribeUrl || subscribeUrl.length === 0) {
      ui.addNotification(null, E("p", {}, _("Пожалуйста, введите Subscribe URL")));
      return false;
    }

    var subscribeInput = findSubscribeInput(ev, section_id, "subscribe_url");
    var subscribeContainer = null;
    if (subscribeInput) {
      subscribeContainer =
        subscribeInput.closest(".cbi-value") ||
        subscribeInput.closest(".cbi-section") ||
        subscribeInput.parentElement;
    }

    fetchConfigs(
      subscribeUrl,
      subscribeContainer,
      "podkop-subscribe-config-list-selector-" + section_id,
      false,
      section_id,
      false,
      true
    );

    return false;
  };

  // Subscribe URL for proxy_config_type = "outbound"
  o = section.option(
    form.Value,
    "subscribe_url_outbound",
    _("Subscribe URL"),
    _("Введите Subscribe URL для получения конфигураций")
  );
  o.depends("proxy_config_type", "outbound");
  o.placeholder = "https://example.com/subscribe";
  o.rmempty = true;

  o.validate = function (section_id, value) {
    if (!value || value.length === 0) {
      return true;
    }
    var validation = main.validateUrl(value);
    if (validation.valid) {
      return true;
    }
    return validation.message;
  };

  // Fetch button for Outbound mode
  o = section.option(
    form.Button,
    "subscribe_fetch_outbound",
    _("Получить конфигурации"),
    _("Получить конфигурации из Subscribe URL")
  );
  o.depends("proxy_config_type", "outbound");
  o.inputtitle = _("Получить");
  o.inputstyle = "add";

  o.onclick = function (ev, section_id) {
    if (ev && ev.preventDefault) ev.preventDefault();
    if (ev && ev.stopPropagation) ev.stopPropagation();

    var subscribeUrl = getSubscribeUrl(ev, section_id, "subscribe_url_outbound");

    if (!subscribeUrl || subscribeUrl.length === 0) {
      ui.addNotification(
        null,
        E("p", {}, _("Пожалуйста, введите Subscribe URL"))
      );
      return false;
    }

    var subscribeInput = findSubscribeInput(ev, section_id, "subscribe_url_outbound");
    var subscribeContainer = null;
    if (subscribeInput) {
      subscribeContainer =
        subscribeInput.closest(".cbi-value") ||
        subscribeInput.closest(".cbi-section") ||
        subscribeInput.parentElement;
    }

    fetchConfigs(
      subscribeUrl,
      subscribeContainer,
      "podkop-subscribe-config-list-outbound-" + section_id,
      true,
      section_id,
      false,
      false
    );

    return false;
  };
}

var EntryPoint = {
  enhanceSectionWithSubscribe: enhanceSectionWithSubscribe,
};

return baseclass.extend(EntryPoint);
