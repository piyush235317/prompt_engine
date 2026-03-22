function renderCards(cards, tabId, categoryName = "") {
    const container = document.getElementById("tabs-container");
    container.innerHTML = "";

    if (!cards) cards = [];

    // --- Pill-style Add System (Top) ---
    const addSystem = document.createElement("div");
    addSystem.className = "library-add-system";
    
    const addNormal = document.createElement("div");
    addNormal.className = "add-pill";
    addNormal.innerHTML = `<span>+</span> Normal`;
    addNormal.onclick = () => showCardModal(cards, tabId, null, categoryName);
    
    const addInput = document.createElement("div");
    addInput.className = "add-pill input-based";
    addInput.innerHTML = `<span>⚡</span> Input Based`;
    addInput.onclick = () => showCardModal(cards, tabId, { title: "", content: "{{input}}" }, categoryName);

    addSystem.appendChild(addNormal);
    addSystem.appendChild(addInput);
    container.appendChild(addSystem);

    cards.forEach((card, index) => {
        const cardEl = document.createElement("div");
        cardEl.className = "card";
        cardEl.setAttribute("draggable", "true");

        const displayTitle = card.title || "Untitled Prompt";
        const hasTemplateBadge = (card.content && card.content.includes("{{input}}")) 
            ? `<span class="badge badge-template">⚡ Uses input</span>` 
            : '';
        const hasAiBadge = (card.content && card.content.includes("{{ai}}")) 
            ? `<span class="badge badge-ai">🤖 AI Powered</span>` 
            : '';

        let displayContent = card.content || "";
        
        // Live Input Capture & Preview Injection
        let liveInputString = "";
        try {
            if (typeof platformAdapters !== "undefined") {
                const adapter = platformAdapters.find(a => a.match());
                if (adapter) {
                    const editor = adapter.getEditor();
                    if (editor) {
                        liveInputString = (adapter.getValue(editor) || "").trim();
                    }
                }
            }
        } catch (e) {
            console.warn("GoPrompts: Live capture warn", e);
        }

        if (displayContent.includes("{{input}}") || displayContent.includes("{{ai}}")) {
            if (liveInputString) {
                let previewStr = liveInputString.length > 50 ? liveInputString.substring(0, 50) + "..." : liveInputString;
                const safeStr = previewStr.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                displayContent = displayContent.replace(/\{\{input\}\}/g, `<span class="live-preview-span" data-type="input" style="color: #0A84FF; font-weight: 600;">${safeStr}</span>`);
                displayContent = displayContent.replace(/\{\{ai\}\}/g, `<span class="live-preview-span" data-type="ai" style="color: #bf5af2; font-weight: 600;">${safeStr}</span>`);
            } else {
                let emptySpan = `<span class="live-preview-span" data-type="input" style="color: var(--text-color); opacity: 0.45; font-style: italic;">input</span>`;
                displayContent = displayContent.replace(/\{\{input\}\}/g, emptySpan);
                displayContent = displayContent.replace(/\{\{ai\}\}/g, emptySpan.replace('data-type="input"', 'data-type="ai"').replace('input', 'ai'));
            }
        }

        cardEl.innerHTML = `
            <div class="card-title">${displayTitle}${hasTemplateBadge}${hasAiBadge}</div>
            <div class="card-content-wrapper">
                <div class="card-content">${displayContent}</div>
            </div>
            <!-- Secretly store the true un-interpolated content so inject.js still performs variable execution correctly -->
            <div class="hidden-raw-content" style="display:none;">${card.content || ""}</div>
        `;

        cardEl.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showCardContextMenu(e, card, cards, tabId);
        });

        cardEl.addEventListener('click', () => handleUse(cardEl));

        // Drag and Drop
        cardEl.addEventListener("dragstart", (e) => {
            cardEl.classList.add("dragging");
            e.dataTransfer.setData("text/plain", index);
        });
        cardEl.addEventListener("dragend", () => {
            cardEl.classList.remove("dragging");
            document.querySelectorAll(".card").forEach(c => c.classList.remove("drag-over"));
        });
        cardEl.addEventListener("dragover", (e) => {
            e.preventDefault();
            const draggingCard = document.querySelector(".dragging");
            if (draggingCard && draggingCard !== cardEl) cardEl.classList.add("drag-over");
        });
        cardEl.addEventListener("dragleave", () => cardEl.classList.remove("drag-over"));
        cardEl.addEventListener("drop", async (e) => {
            e.preventDefault();
            const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
            const toIndex = index;
            if (fromIndex !== toIndex) {
                const movedCard = cards.splice(fromIndex, 1)[0];
                cards.splice(toIndex, 0, movedCard);
                await saveCards(tabId, { cards });
                renderCards(cards, tabId);
            }
        });

        container.appendChild(cardEl);
    });

}

function showCardContextMenu(e, card, cards, tabId) {
    if (window.gpActiveMenu) window.gpActiveMenu.remove();

    const container = document.getElementById("prompt-box");
    const rect = container.getBoundingClientRect();

    const menu = document.createElement("div");
    menu.className = "context-menu";
    menu.style.display = "block";
    menu.style.left = `${e.clientX - rect.left}px`;
    menu.style.top = `${e.clientY - rect.top}px`;

    menu.innerHTML = `
        <div class="context-menu-item" id="menu-edit">📝 Edit</div>
        <div class="context-menu-divider"></div>
        <div class="context-menu-item danger" id="menu-delete">🗑️ Delete</div>
    `;

    container.appendChild(menu);
    window.gpActiveMenu = menu;

    menu.querySelector("#menu-edit").onclick = () => {
        menu.remove();
        window.gpActiveMenu = null;
        showCardModal(cards, tabId, card);
    };

    menu.querySelector("#menu-delete").onclick = async () => {
        menu.remove();
        window.gpActiveMenu = null;
        if (confirm(`Delete the prompt "${card.title}"?`)) {
            const index = cards.indexOf(card);
            if (index > -1) {
                cards.splice(index, 1);
                await saveCards(tabId, { cards });
                renderCards(cards, tabId, categoryName);
            }
        }
    };

    const closeMenu = () => {
        menu.remove();
        window.removeEventListener("click", closeMenu);
    };
    setTimeout(() => window.addEventListener("click", closeMenu), 10);
}

function showCardModal(cards, tabId, existingCard = null, categoryName = "") {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    
    overlay.innerHTML = `
        <div class="modal-content">
            <div class="modal-title">${existingCard ? 'Edit Prompt' : 'Create Prompt'}</div>
            
            <div class="modal-field">
                <label class="modal-label">Title</label>
                <input type="text" id="modal-card-title" class="modal-input" value="${existingCard ? existingCard.title : ''}" placeholder="e.g. Code Reviewer...">
            </div>

            <div class="modal-field">
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 6px;">
                    <label class="modal-label" style="margin-bottom: 0;">Prompt Content</label>
                </div>
                <textarea id="modal-card-content" class="modal-textarea" placeholder="Paste your prompt here...">${existingCard ? existingCard.content : ''}</textarea>
            </div>

            <div class="modal-actions">
                <button class="btn-secondary" id="modal-cancel">Cancel</button>
                <button class="btn-primary" id="modal-save">${existingCard ? 'Update' : 'Add Prompt'}</button>
            </div>
        </div>
    `;

    const container = document.getElementById("prompt-box");
    container.appendChild(overlay);

    const contentInput = overlay.querySelector("#modal-card-content");

    overlay.querySelector("#modal-cancel").onclick = () => overlay.remove();
    
    overlay.querySelector("#modal-save").onclick = async () => {
        const title = overlay.querySelector("#modal-card-title").value.trim();
        const content = overlay.querySelector("#modal-card-content").value.trim();
        if (!content) return alert("Prompt content cannot be empty.");

        if (existingCard) {
            existingCard.title = title || "Untitled Prompt";
            existingCard.content = content;
        } else {
            cards.push({ title: title || "Untitled Prompt", content });
        }
        
        await saveCards(tabId, { cards });
        overlay.remove();
        renderCards(cards, tabId, categoryName);
    };
}

// Setup real-time dynamic preview polling for cards
if (!window.gpPreviewInterval) {
    window.gpPreviewInterval = setInterval(() => {
        const previewSpans = document.querySelectorAll('.live-preview-span');
        if (previewSpans.length === 0) return;
        
        let liveStr = "";
        try {
            if (typeof platformAdapters !== "undefined") {
                const adapter = platformAdapters.find(a => a.match());
                if (adapter) {
                    const editor = adapter.getEditor();
                    if (editor) {
                        liveStr = (adapter.getValue(editor) || "").trim();
                        // Prevent feedback loop: If the current editor content matches exactly what was just injected, use the original captured input for the preview instead!
                        if (window.lastInjectedState && window.lastInjectedState.injectedText && liveStr === window.lastInjectedState.injectedText.trim()) {
                            liveStr = window.lastInjectedState.originalInput;
                        }
                    }
                }
            }
        } catch(e) {}
        
        const isEmpt = liveStr === "";
        let displayStr = liveStr.length > 35 ? liveStr.substring(0, 35) + "..." : liveStr;
        const safeStr = displayStr.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        
        previewSpans.forEach(span => {
            if (isEmpt) {
                span.innerHTML = span.dataset.type === "ai" ? "ai" : "input";
                span.style.color = "var(--text-color)";
                span.style.opacity = "0.45";
                span.style.border = "none";
                span.style.background = "transparent";
                span.style.fontStyle = "italic";
                span.style.fontWeight = "normal";
                span.style.textDecoration = "underline";
                span.style.textDecorationStyle = "dotted";
                span.style.textUnderlineOffset = "3px";
                span.style.padding = "0";
            } else {
                span.innerHTML = safeStr;
                span.style.opacity = "1";
                span.style.border = "none";
                span.style.fontStyle = "normal";
                span.style.fontWeight = "600";
                span.style.textDecoration = "none";
                span.style.background = "transparent";
                span.style.padding = "0";
                
                if (span.dataset.type === "ai") {
                    span.style.color = "#bf5af2";
                } else {
                    span.style.color = "#0A84FF";
                }
            }
        });
    }, 500);
}