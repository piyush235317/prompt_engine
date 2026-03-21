// Create UI first
createPanel();

// Init app
(async function () {
    try {
        const tabsData = await loadTabs();

        renderSidebar(tabsData, async (tabId) => {
            const data = await loadCards(tabId);
            renderCards(data.cards, tabId);
        });

        // default first tab
        const firstTab = tabsData.tabs[0];
        const data = await loadCards(firstTab.id);

        renderCards(data.cards, firstTab.id);

    } catch (e) {
        console.error("ERROR:", e);
    }
})();