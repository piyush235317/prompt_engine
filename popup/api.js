function loadTabs() {
    const url = chrome.runtime.getURL("data/tabs.json");
    return fetch(url).then(res => res.json());
}

function loadCards(tabId) {
    const url = chrome.runtime.getURL(`data/${tabId}.json`);
    return fetch(url).then(res => res.json());
}