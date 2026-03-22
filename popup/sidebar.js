const svgMap = {
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    study: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
    debug: '<path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M2 12h2"/><path d="m4.93 19.07 1.41-1.41"/><path d="M12 22v-2"/><path d="m17.66 17.66 1.41 1.41"/><path d="M22 12h-2"/><path d="m17.66 6.34 1.41-1.41"/><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="m19.07 19.07-1.41-1.41"/><path d="m4.93 19.07 1.41-1.41"/><path d="m4.93 4.93 1.41 1.41"/>',
    Coding: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    Exam: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/>',
    promptlab: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M12 3v2"/><path d="M12 19v2"/><path d="M21 12h-2"/><path d="M5 12h2"/>', // Refined cleaner icon for Prompt Lab
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>'
};

function renderSidebar(tabsData, onTabClick) {
    const sidebar = document.getElementById("sidebar");
    const scrollArea = document.getElementById("sidebar-scroll");
    const footerArea = document.getElementById("sidebar-footer");
    
    if (scrollArea) scrollArea.innerHTML = "";
    if (footerArea) footerArea.innerHTML = "";

    // Separate draggable tabs from Settings
    let draggableTabs = tabsData.tabs.filter(t => t.id !== 'settings');
    const settingsTab = tabsData.tabs.find(t => t.id === 'settings') || { id: 'settings', name: 'Settings', icon: 'settings' };

    draggableTabs.forEach((tab, index) => {
        const tabEl = document.createElement("div");
        tabEl.classList.add("side-tab");
        tabEl.setAttribute("draggable", "true");

        // Use the precise SVG vector if it exists, otherwise fallback to emoji
        const svgPath = svgMap[tab.icon] || svgMap[tab.id];
        const iconContent = svgPath 
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${svgPath}</svg>`
            : tab.icon;

        tabEl.innerHTML = `
            <span>${iconContent}</span>
            <div class="tab-label">${tab.name}</div>
            <div class="tab-active-indicator"></div>
        `;
        tabEl.title = tab.name;

        // If nothing is active yet, set the first tab as active fallback
        if (index === 0 && !document.querySelector(".side-tab.active")) {
            tabEl.classList.add("active");
            // We'll let the initial load in popup.js handle the first render to avoid double-loading
        }

        tabEl.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            e.stopPropagation();
            showContextMenu(e, tab, tabsData, onTabClick);
        });

        tabEl.addEventListener("click", () => {
            document.querySelectorAll(".side-tab").forEach(t => t.classList.remove("active"));
            tabEl.classList.add("active");
            onTabClick(tab.id, tab.name);
        });

        // Drag and Drop implementation
        tabEl.addEventListener("dragstart", (e) => {
            tabEl.classList.add("dragging");
            e.dataTransfer.setData("text/plain", index);
        });

        tabEl.addEventListener("dragend", () => {
            tabEl.classList.remove("dragging");
            document.querySelectorAll(".side-tab").forEach(t => t.classList.remove("drag-over"));
        });

        tabEl.addEventListener("dragover", (e) => {
            e.preventDefault();
            tabEl.classList.add("drag-over");
        });

        tabEl.addEventListener("dragleave", () => {
            tabEl.classList.remove("drag-over");
        });

        tabEl.addEventListener("drop", async (e) => {
            e.preventDefault();
            const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
            const toIndex = index;

            if (fromIndex !== toIndex && !isNaN(fromIndex)) {
                const movedTab = draggableTabs.splice(fromIndex, 1)[0];
                draggableTabs.splice(toIndex, 0, movedTab);
                
                // Persist to local storage explicitly keeping settings at the end
                tabsData.tabs = [...draggableTabs, settingsTab];
                await chrome.storage.local.set({ 'goprompts_tabs': tabsData });
                renderSidebar(tabsData, onTabClick);
            }
        });
        
        if (scrollArea) scrollArea.appendChild(tabEl);
    });

    // 2. Add Tab Button (now in footer)
    const addTabEl = document.createElement("div");
    addTabEl.classList.add("side-tab", "add-tab-btn");
    // addTabEl.style.marginTop = "auto"; // No longer needed with fixed footer
    addTabEl.innerHTML = `
        <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></span>
        <div class="tab-label">Add</div>
    `;
    addTabEl.addEventListener("click", () => showAddTabModal(tabsData, onTabClick));
    if (footerArea) footerArea.appendChild(addTabEl);

    // 3. Render Settings statically (lowest)
    const settingsEl = document.createElement("div");
    settingsEl.classList.add("side-tab");
    const setSvg = svgMap[settingsTab.icon] || svgMap['settings'];
    settingsEl.innerHTML = `
        <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${setSvg}</svg></span>
        <div class="tab-label">${settingsTab.name}</div>
    `;
    settingsEl.addEventListener("click", () => {
        document.querySelectorAll(".side-tab").forEach(t => t.classList.remove("active"));
        settingsEl.classList.add('active');
        onTabClick('settings', settingsTab.name);
    });
    if (footerArea) footerArea.appendChild(settingsEl);
}

function showContextMenu(e, tab, tabsData, onTabClick) {
    if (window.gpActiveMenu) window.gpActiveMenu.remove();

    const container = document.getElementById("prompt-box") || document.body;
    const rect = container.getBoundingClientRect();

    const menu = document.createElement("div");
    menu.className = "context-menu";
    menu.style.display = "block";
    menu.style.left = `${e.clientX - rect.left}px`;
    menu.style.top = `${e.clientY - rect.top}px`;

    menu.innerHTML = `
        <div class="context-menu-item" id="menu-edit">📝 Edit</div>
        ${(tab.id !== 'home' && tab.id !== 'settings') ? `
            <div class="context-menu-divider"></div>
            <div class="context-menu-item danger" id="menu-delete">🗑️ Delete</div>
        ` : ''}
    `;

    container.appendChild(menu);
    window.gpActiveMenu = menu;

    menu.querySelector("#menu-edit").onclick = () => {
        menu.remove();
        window.gpActiveMenu = null;
        showAddTabModal(tabsData, onTabClick, tab);
    };

    if (menu.querySelector("#menu-delete")) {
        menu.querySelector("#menu-delete").onclick = async () => {
            menu.remove();
            window.gpActiveMenu = null;
            if (confirm(`Delete the tab "${tab.name}"?`)) {
                tabsData.tabs = tabsData.tabs.filter(t => t.id !== tab.id);
                await chrome.storage.local.set({ 'goprompts_tabs': tabsData });
                renderSidebar(tabsData, onTabClick);
            }
        };
    }

    // Close when clicking away
    const closeMenu = () => {
        menu.remove();
        window.gpActiveMenu = null;
        window.removeEventListener("click", closeMenu);
    };
    setTimeout(() => window.addEventListener("click", closeMenu), 10);
}

function showAddTabModal(tabsData, onTabClick, existingTab = null) {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    
    let selectedIcon = existingTab ? existingTab.icon : "home";

    overlay.innerHTML = `
        <div class="modal-content">
            <div class="modal-title">${existingTab ? 'Edit Tab' : 'Create New Tab'}</div>
            
            <div class="modal-field">
                <label class="modal-label">Tab Name</label>
                <input type="text" id="modal-tab-name" class="modal-input" value="${existingTab ? existingTab.name : ''}" placeholder="e.g. Work, Ideas...">
            </div>

            <div class="modal-field">
                <label class="modal-label">Description (Optional)</label>
                <input type="text" id="modal-tab-desc" class="modal-input" value="${existingTab ? (existingTab.description || '') : ''}" placeholder="What is this category for?">
            </div>

            <label class="modal-label">Choose Icon</label>
            <div class="icon-grid" id="modal-icon-grid"></div>

            <div class="modal-actions">
                <button class="btn-secondary" id="modal-cancel">Cancel</button>
                <button class="btn-primary" id="modal-add">${existingTab ? 'Save Changes' : 'Create Tab'}</button>
            </div>
        </div>
    `;

    const container = document.getElementById("prompt-box") || document.body;
    container.appendChild(overlay);

    const grid = overlay.querySelector("#modal-icon-grid");
    Object.keys(svgMap).forEach(key => {
        const opt = document.createElement("div");
        opt.className = `icon-option ${key === selectedIcon ? 'selected' : ''}`;
        opt.title = key.charAt(0).toUpperCase() + key.slice(1);
        opt.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${svgMap[key]}</svg>`;
        
        opt.onclick = () => {
            overlay.querySelectorAll(".icon-option").forEach(o => o.classList.remove("selected"));
            opt.classList.add("selected");
            selectedIcon = key;
        };
        grid.appendChild(opt);
    });

    overlay.querySelector("#modal-cancel").onclick = () => overlay.remove();
    
    overlay.querySelector("#modal-add").onclick = async () => {
        const name = overlay.querySelector("#modal-tab-name").value.trim();
        const desc = overlay.querySelector("#modal-tab-desc").value.trim();
        if (!name) return alert("Please enter a name");

        if (existingTab) {
            // Update existing
            existingTab.name = name;
            existingTab.description = desc;
            existingTab.icon = selectedIcon;
        } else {
            // Add new
            const newId = name.toLowerCase().replace(/[^a-z0-0]/g, '_') + '_' + Date.now();
            tabsData.tabs.push({ 
                id: newId, 
                name: name, 
                icon: selectedIcon,
                description: desc 
            });
        }
        
        await chrome.storage.local.set({ 'goprompts_tabs': tabsData });
        overlay.remove();
        renderSidebar(tabsData, onTabClick);
    };
}