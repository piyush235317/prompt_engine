// Create UI first
createPanel();
updateApiStatus();

// Init app
(async function () {
    try {
        const tabsData = await loadTabs();

        // --- TAB ORCHESTRATION ---
        // Initialize Sidebar and Default View
        renderSidebar(tabsData, async (tabId, name) => {
            if (tabId === 'settings') {
                renderSettingsUI(name);
            } else if (tabId === 'promptlab') {
                renderPromptLabUI();
            } else {
                const data = await loadCards(tabId);
                renderCards(data.cards, tabId, name);
            }
        });

        // Set initial state
        if (tabsData.tabs && tabsData.tabs.length > 0) {
            const firstTab = tabsData.tabs[0];
            if (firstTab.id === 'settings') {
                renderSettingsUI(firstTab.name);
            } else if (firstTab.id === 'promptlab') {
                renderPromptLabUI();
            } else {
                const data = await loadCards(firstTab.id);
                renderCards(data.cards, firstTab.id, firstTab.name);
            }
        }

    } catch (e) {
        console.error("ERROR:", e);
    }
})();

 // The rest of the setup functions have been moved to settings.js and chat.js