# Apex AdBlocker Privacy Policy — publication draft

**Status: draft for publisher review and publication at a public HTTPS address.**

Publisher: **Konrad Woźniak**
Privacy contact: **konrad.wozniak.1996@gmail.com**
Last updated: **30 October 2026**

This policy describes Apex AdBlocker version 1.0.0. Its single main purpose is blocking advertisements and tracking mechanisms while browsing websites. The extension operates in the browser, requires no account, and has no publisher-operated backend or telemetry.

## Data needed for the extension to work

The extension locally accesses the addresses and domains of open pages and network-request information needed to apply blocking rules and display protection status. It also inspects selected page elements, including CSS selectors, class names, element identifiers and text, to hide advertisements. The element picker uses the element selected by the user to create a filter.

Selected bundled filters can locally modify page-script behavior and network responses. They may also read, set or remove cookies and localStorage/sessionStorage entries accessible to the website when a filter requires this. These operations support filtering and page compatibility. The extension does not use this information to create an advertising profile or send it to the publisher. It does not use Chrome's separate browsing-history or cookies API to read browser-wide history or all cookies.

Apex AdBlocker has no feature that collects passwords, payment information or account details for a publisher service. Page-content access is used to apply filters, not to conduct user analytics.

## Information retained in the browser

The browser profile stores settings, primarily domains where protection is disabled, custom filter text and the automatic-page-reload preference. Custom filters may contain domains, URLs or other information the user enters.

The extension also keeps local component status and a bounded log of up to 50 errors, including timestamps, component names and messages. This information helps diagnose extension failures. It does not maintain a separate record of browsing history.

YouTube diagnostics temporarily retain playback status, page type and short problem reasons in memory. Reports do not retain the full video URL or video identifier. They are associated with a tab and frame, expire after 60 seconds without an update, and are removed on relevant navigation or tab closure.

Optional performance measurements are disabled by default. When enabled, local measurements can include the page domain, frame identifier, counters and timings. The current list is limited to 30 reports. Aggregated scriptlet measurements and a startup profile can be held in browser-session memory. Turning performance measurements off clears the accumulated performance reports in the extension.

## Transmission and sharing

Apex AdBlocker does not transmit the information described above to the publisher. It has no integrated analytics or publisher service storing user data. It does not sell data or share it with advertisers.

Websites can still communicate with their own servers and third parties. The blocker does not guarantee that every such connection is blocked. Websites and browser services are governed by their respective providers' policies.

Filter lists and executable extension code are included in the extension package. Developer tools may download updated lists before preparing a release; this is not transmission of browsing data by the installed extension.

## User-initiated exports

Settings export downloads a local file containing disabled domains and custom filter text, together with format, extension-version and export-time metadata. It can contain sensitive information if the user included it in custom filters. The user chooses where to keep the file and whether to share it.

A diagnostics report is generated locally and copied only at the user's request. It includes the extension version, component status, synchronization outcomes and a limited description of errors. Sanitization removes recognized addresses, tokens and other potentially identifying information from report text. Automatic sanitization cannot guarantee detection of every possible sensitive item; review the report before sharing it.

Neither export is automatically sent to the publisher. If the user independently shares a file or report outside the extension, the chosen recipient receives its contents. If the user independently emails the contact address, the publisher receives the message, sender details and any attachments in order to respond; this is not automatic extension telemetry.

## Data controls

Disabled domains and custom filters can be edited in Options. Error logs can be cleared, and performance measurements can be disabled or reset in Diagnostics. Extension data in the browser profile can be removed by uninstalling the extension or deleting the relevant browser-profile data. Previously exported files must be deleted separately.

The extension does not use `chrome.storage.sync` to transmit settings. Browser-profile or system backups made by the user or other software are outside the extension's control.

## Permissions

**declarativeNetRequest** — Chrome applies the packaged network rules, custom rules and site exceptions.

**scripting** — Runs packaged filtering scripts, inserts cosmetic CSS and starts the element picker.

**storage** — Saves user settings and bounded diagnostics locally; settings are not sent through storage.sync.

**activeTab** — Enables actions and available blocking statistics for the tab selected by the user when opening the popup.

**Access to all sites (<all_urls>)** — Allows local filtering across supported pages and frames. Protected browser pages remain subject to Chrome restrictions.

## Changes and contact

This policy should be updated when data-handling behavior changes, especially before introducing communication with a publisher service. Privacy questions can be sent to the contact address above.
