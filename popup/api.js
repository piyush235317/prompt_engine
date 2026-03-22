async function loadTabs() {
    return new Promise(resolve => {
        chrome.storage.local.get(['goprompts_tabs'], async (result) => {
            if (result.goprompts_tabs) {
                // ARCHITECTURE HOTFIX: Force-inject the new Settings module for legacy users
                const hasSettings = result.goprompts_tabs.tabs.some(t => t.id === 'settings');

                // Hotfix: Inject Prompt Lab
                const hasPromptLab = result.goprompts_tabs.tabs.some(t => t.id === 'promptlab');

                let needsUpdate = false;
                if (!hasSettings) {
                    result.goprompts_tabs.tabs.push({ id: 'settings', name: 'Settings', icon: '⚙️' });
                    needsUpdate = true;
                }

                // CHATBOT REMOVAL HOXFIX: Strip out ONLY the chatbot-associated research/Ideation tabs
                const initialCount = result.goprompts_tabs.tabs.length;
                result.goprompts_tabs.tabs = result.goprompts_tabs.tabs.filter(t => 
                    t.id !== 'research' && t.name !== 'Ideation'
                );
                if (result.goprompts_tabs.tabs.length < initialCount) {
                    needsUpdate = true;
                }

                if (!hasPromptLab) {
                    const promptLabTab = { id: 'promptlab', name: 'Prompt Lab', icon: '🔬' };
                    // Insert at index 1
                    result.goprompts_tabs.tabs.splice(1, 0, promptLabTab);
                    needsUpdate = true;
                }

                // UI CLEANUP HOTFIX: If the user has more than 12 tabs, they are suffering from "Tab Bloat". Clear it!
                if (result.goprompts_tabs.tabs.length > 12) {
                    chrome.storage.local.remove('goprompts_tabs', () => loadTabs().then(resolve));
                    return;
                }

                if (needsUpdate) {
                    chrome.storage.local.set({ 'goprompts_tabs': result.goprompts_tabs });
                }
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
            // ARCHITECTURE HOTFIX: If the AI cards are missing or empty, force a re-fetch of our new default ai.json!
            if (result[key] && result[key].cards && result[key].cards.length > 0) {
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