const svgMap = {
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    study: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
    debug: '<path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M2 12h2"/><path d="m4.93 19.07 1.41-1.41"/><path d="M12 22v-2"/><path d="m17.66 17.66 1.41 1.41"/><path d="M22 12h-2"/><path d="m17.66 6.34 1.41-1.41"/><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="m19.07 19.07-1.41-1.41"/><path d="m4.93 19.07 1.41-1.41"/><path d="m4.93 4.93 1.41 1.41"/>',
    Coding: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    Exam: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/>',
    promptlab: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M12 3v2"/><path d="M12 19v2"/><path d="M21 12h-2"/><path d="M5 12h2"/>', 
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    pencil: '<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>',
    trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
    coffee: '<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
    clip: '<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
    cloud: '<path d="M17.5 19a5.5 5.5 0 0 0 1.5-10.8V8a4.5 4.5 0 1 0-9 0v.2A5.5 5.5 0 1 0 11.5 19H17.5Z"/>',
    cpu: '<rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>',
    edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
    filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
    gift: '<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>',
    globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
    key: '<path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3L13.39 9.39z"/>',
    lamp: '<path d="M8 2h8l4 10H4L8 2Z"/><path d="M12 12v6"/><path d="M8 22h8"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
    map: '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>',
    mic: '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>',
    music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    play: '<polygon points="5 3 19 12 5 21 5 3"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
    zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    video: '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>'
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