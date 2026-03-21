async function loadTabs() {
    return new Promise(resolve => {
        chrome.storage.local.get(['goprompts_tabs'], async (result) => {
            if (result.goprompts_tabs) {
                resolve(result.goprompts_tabs);
            } else {
                try {
                    const url = chrome.runtime.getURL("data/tabs.json");
                    const data = await fetch(url).then(res => res.json());
                    chrome.storage.local.set({ 'goprompts_tabs': data });
                    resolve(data);
                } catch (e) {
                    console.error("Failed to load generic tabs json", e);
                    resolve({ tabs: [] });
                }
            }
        });
    });
}

async function loadCards(tabId) {
    return new Promise(resolve => {
        const key = `goprompts_cards_${tabId}`;
        chrome.storage.local.get([key], async (result) => {
            if (result[key]) {
                resolve(result[key]);
            } else {
                try {
                    const url = chrome.runtime.getURL(`data/${tabId}.json`);
                    const data = await fetch(url).then(res => res.json());
                    chrome.storage.local.set({ [key]: data });
                    resolve(data);
                } catch (e) {
                    console.error("Failed to load cards for tab", tabId);
                    resolve({ cards: [] });
                }
            }
        });
    });
}

function saveCards(tabId, data) {
    const key = `goprompts_cards_${tabId}`;
    return new Promise(resolve => {
        chrome.storage.local.set({ [key]: data }, () => {
            resolve();
        });
    });
}