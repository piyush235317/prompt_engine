function renderPromptLabUI() {
    const container = document.getElementById("tabs-container");
    container.innerHTML = `
        <style>
            .apple-switch input:checked + .apple-slider { background-color: #34C759 !important; }
            .apple-switch input:checked ~ .apple-slider-knob { transform: translateX(14px); }
            #lab-draft-input:focus { border-color: var(--accent) !important; box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.1) !important; }
            
            .crafting-card { background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 14px; padding: 16px; margin-bottom: 20px; }
            .crafting-title { font-size: 15px; font-weight: 600; color: var(--text-color); margin: 0 0 4px 0; }
            .crafting-subtitle { font-size: 11px; font-weight: 500; color: var(--accent); opacity: 0.9; margin-bottom: 16px; display: block; }
            
            .param-group { margin-bottom: 16px; }
            .param-group:last-child { margin-bottom: 0; }
            .param-label { font-size: 13px; font-weight: 600; color: var(--text-color); margin-bottom: 8px; display: block; }

            #add-persona-btn:hover, #edit-persona-btn:hover { opacity: 1 !important; transform: scale(1.1); }
            #lab-persona-instruction:focus, #lab-persona-name-input:focus { border-color: var(--accent) !important; background: rgba(255,255,255,0.06) !important; }
            #cancel-persona-btn:hover { background: rgba(255,255,255,0.05) !important; opacity: 1 !important; }
            #save-persona-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0, 122, 255, 0.45); }
            #save-persona-btn:active { transform: translateY(0); }
            
            .segmented-control { display: flex; background: rgba(128,128,128,0.1); border-radius: 8px; padding: 2px; gap: 2px; }
            .segment { flex: 1; padding: 6px 4px; font-size: 11px; border: none; background: transparent; cursor: pointer; border-radius: 6px; color: var(--text-color); opacity: 0.6; transition: all 0.2s; white-space: nowrap; }
            .segment.active { background: var(--accent); color: white; opacity: 1; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }

            /* Custom Select Styles (Moving here for robustness) */
            .custom-select { position: relative; width: 100%; user-select: none; }
            .select-trigger { 
                display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; 
                background: rgba(128,128,128,0.1); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; 
                color: var(--text-color); font-size: 13px; cursor: pointer; transition: all 0.2s; 
            }
            .select-trigger:hover { border-color: var(--accent); background: rgba(128,128,128,0.15); }
            .select-trigger svg { transition: transform 0.3s; opacity: 0.6; }
            .custom-select.active .select-trigger svg { transform: rotate(180deg); }
            
            .select-options { 
                position: absolute; top: calc(100% + 6px); left: 0; right: 0; 
                background: #1c1c1e; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; 
                box-shadow: 0 10px 30px rgba(0,0,0,0.5); overflow: hidden; z-index: 10000; 
                display: none !important; animation: dropdownIn 0.2s cubic-bezier(0.16, 1, 0.3, 1); 
                max-height: 200px; overflow-y: auto; 
            }
            .custom-select.active .select-options { display: block !important; }
            .select-option { padding: 10px 14px; font-size: 13px; color: var(--text-color); cursor: pointer; transition: background 0.15s; }
            .select-option:hover { background: var(--accent); color: white; }
            .select-option.selected { background: rgba(10, 132, 255, 0.15); color: var(--accent); font-weight: 600; }
            
            @keyframes dropdownIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

            #lab-enhance-btn { background: linear-gradient(135deg, #0A84FF 0%, #0056D2 100%); border: none; box-shadow: 0 4px 12px rgba(10, 132, 255, 0.3); transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1); }
            #lab-enhance-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(10, 132, 255, 0.4); }
            #lab-enhance-btn:active { transform: translateY(0); }
        </style>
        <div class="prompt-lab-container no-scrollbar" style="display: flex; flex-direction: column; min-height: 100%; padding: 20px; box-sizing: border-box; overflow-y: auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <div style="margin-bottom: 20px; flex-shrink: 0;">
                <h2 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 700; display: flex; align-items: center; gap: 8px; color: var(--text-color); letter-spacing: -0.5px;">
                    Prompt Lab
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: #0A84FF;"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 0 0 0-1-1H9a1 0 0 0-1 1v3"/></svg>
                </h2>
                <p style="margin: 0; font-size: 13px; color: var(--text-color); opacity: 0.6; line-height: 1.4; font-weight: 400;">Pull text from your active tab, enhance it, and push it back seamlessly.</p>
            </div>

            <button id="lab-enhance-btn" class="btn-primary" style="width: 100%; padding: 14px; display: flex; justify-content: center; align-items: center; gap: 8px; margin-bottom: 16px; flex-shrink: 0;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                ✨ Magic Enhance & Push
            </button>

            <div class="lab-input-section" style="flex: 1; display: flex; flex-direction: column; min-height: 180px; margin-bottom: 20px; position: relative;">
                <textarea id="lab-draft-input" placeholder="Type your prompt here, or click 'Magic Enhance' to pull from page..." style="flex: 1; width: 100%; padding: 16px; border-radius: 14px; border: 1px solid var(--border-color); background: var(--bg-color); box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); color: var(--text-color); font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px; line-height: 1.6; resize: none; outline: none; transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);"></textarea>
            </div>

            <div class="crafting-card" style="margin-top: auto;">
                <h3 class="crafting-title">Crafting Parameters</h3>
                <span class="crafting-subtitle">Advanced Controls (Active)</span>
                
                <div class="param-group">
                    <span class="param-label">Response Size:</span>
                    <div id="size-control" class="segmented-control">
                        <button class="segment" data-val="Short">Short</button>
                        <button class="segment active" data-val="Standard">Standard</button>
                        <button class="segment" data-val="Long">Long</button>
                        <button class="segment" data-val="Mega">Mega</button>
                    </div>
                </div>

                <div class="param-group">
                    <span class="param-label">Expertise Level:</span>
                    <div id="expertise-control" class="segmented-control">
                        <button class="segment" data-val="Beginner">Beginner</button>
                        <button class="segment" data-val="Practitioner">Practitioner</button>
                        <button class="segment active" data-val="Expert">Expert</button>
                        <button class="segment" data-val="PhD">Ph.D. Level</button>
                    </div>
                </div>

                <div class="param-group">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span class="param-label" style="margin: 0;">Persona Archetype:</span>
                        <div style="display: flex; gap: 8px;">
                            <button id="add-persona-btn" title="Add New Persona" style="background: transparent; border: none; color: var(--accent); cursor: pointer; padding: 2px; opacity: 0.8;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                            <button id="edit-persona-btn" title="Edit Prompt" style="background: transparent; border: none; color: var(--accent); cursor: pointer; padding: 2px; opacity: 0.8;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></button>
                        </div>
                    </div>
                    <div id="persona-select-container" class="custom-select"></div>
                </div>

                <div id="persona-editor-area" style="display: none; margin-top: 12px; background: rgba(0,0,0,0.2); border-radius: 10px; padding: 12px; border: 1px solid rgba(255,255,255,0.05);">
                    <div id="persona-name-container" style="display: none; margin-bottom: 12px;">
                        <span style="font-size: 11px; text-transform: uppercase; color: var(--accent); font-weight: 700; margin-bottom: 6px; display: block;">New Persona Name</span>
                        <input type="text" id="lab-persona-name-input" placeholder="e.g. UX Researcher" style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--text-color); font-size: 13px; padding: 8px 10px; outline: none;">
                    </div>
                    
                    <span style="font-size: 11px; text-transform: uppercase; color: var(--accent); font-weight: 700; margin-bottom: 6px; display: block;">System Instruction (Prompt)</span>
                    <textarea id="lab-persona-instruction" placeholder="Describe how this persona should behave..." style="width: 100%; height: 90px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--text-color); font-size: 12px; font-family: ui-monospace, SFMono-Regular, monospace; padding: 10px; resize: none; outline: none; line-height: 1.4;"></textarea>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; gap: 10px;">
                        <button id="cancel-persona-btn" style="background: transparent; border: 1px solid rgba(255,255,255,0.1); color: var(--text-color); opacity: 0.6; padding: 6px 16px; border-radius: 8px; font-size: 12px; cursor: pointer; transition: all 0.2s;">Cancel</button>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div id="persona-save-status" style="font-size: 10px; color: var(--text-color); opacity: 0.4;">Waiting for save...</div>
                            <button id="save-persona-btn" style="background: var(--accent); border: none; color: white; padding: 6px 20px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);">Save Persona</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="lab-toolbar" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 0; background: rgba(128,128,128,0.05); border: 1px solid var(--border-light); border-radius: 12px; padding: 12px 14px;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <label class="apple-switch" style="position: relative; display: inline-block; width: 34px; height: 20px; margin: 0; flex-shrink: 0;">
                            <input type="checkbox" id="lab-context-btn" checked style="opacity: 0; width: 0; height: 0; position: absolute;">
                            <span class="apple-slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(128,128,128,0.3); transition: .3s; border-radius: 20px;"></span>
                            <span class="apple-slider-knob" style="position: absolute; content: ''; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: white; transition: .3s cubic-bezier(0.175, 0.885, 0.32, 1.275); border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></span>
                        </label>
                        <label for="lab-context-btn" style="font-size: 13px; cursor: pointer; color: var(--text-color); opacity: 0.9; font-weight: 500; margin: 0;">Page Context</label>
                    </div>
                    <div id="context-scope-container" class="custom-select" style="width: 125px;"></div>
                </div>
                
            </div>
        </div>
    `;

    const personaSelectContainer = container.querySelector("#persona-select-container");
    const scopeSelectContainer = container.querySelector("#context-scope-container");

    const personaEditor = container.querySelector("#persona-editor-area");
    const personaNameContainer = container.querySelector("#persona-name-container");
    const personaNameInput = container.querySelector("#lab-persona-name-input");
    const personaInstructionArea = container.querySelector("#lab-persona-instruction");
    const editPersonaBtn = container.querySelector("#edit-persona-btn");
    const addPersonaBtn = container.querySelector("#add-persona-btn");
    const cancelPersonaBtn = container.querySelector("#cancel-persona-btn");
    const savePersonaBtn = container.querySelector("#save-persona-btn");
    const saveStatus = container.querySelector("#persona-save-status");

    let personasData = [];
    let isAddingNew = false;

    // Helper: Create Custom Select Component
    const createCustomSelect = (element, options, defaultValue, onChange) => {
        let currentValue = defaultValue;
        
        const render = () => {
            const selectedOpt = options.find(o => o.value === currentValue) || options[0];
            element.innerHTML = `
                <div class="select-trigger">
                    <span>${selectedOpt.label}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
                <div class="select-options">
                    ${options.map(o => `
                        <div class="select-option ${o.value === currentValue ? 'selected' : ''}" data-value="${o.value}">
                            ${o.label}
                        </div>
                    `).join('')}
                </div>
            `;

            element.querySelector(".select-trigger").onclick = (e) => {
                e.stopPropagation();
                // Close all other dropdowns
                document.querySelectorAll(".custom-select").forEach(s => {
                    if (s !== element) s.classList.remove("active");
                });
                element.classList.toggle("active");
            };

            element.querySelectorAll(".select-option").forEach(opt => {
                opt.onclick = (e) => {
                    e.stopPropagation();
                    const val = opt.getAttribute("data-value");
                    currentValue = val;
                    element.classList.remove("active");
                    render();
                    if (onChange) onChange(val);
                };
            });
        };

        render();
        
        return {
            getValue: () => currentValue,
            setValue: (val) => { currentValue = val; render(); },
            refresh: (newOptions) => { options = newOptions; render(); }
        };
    };

    let personaSelect, scopeSelect;

    const loadPersonas = async () => {
        try {
            const response = await fetch(chrome.runtime.getURL('data/personas.json'));
            const baseData = await response.json();
            const settings = await new Promise(res => chrome.storage.local.get(['goprompts_custom_personas'], res));
            const customData = settings.goprompts_custom_personas || [];
            
            const merged = [...baseData.personas];
            customData.forEach(custom => {
                const idx = merged.findIndex(p => p.id === custom.id);
                if (idx !== -1) merged[idx] = custom;
                else merged.push(custom);
            });

            personasData = merged;
            
            const personaOptions = personasData.map(p => ({ label: p.name, value: p.id }));
            
            if (!personaSelect) {
                personaSelect = createCustomSelect(personaSelectContainer, personaOptions, 'senior_engineer', () => {
                    updatePersonaInstruction();
                    if (personaEditor.style.display === "block" && !isAddingNew) {
                        updatePersonaInstruction();
                    }
                });
            } else {
                personaSelect.refresh(personaOptions);
            }

            updatePersonaInstruction();
        } catch (err) {
            console.error("Error loading personas:", err);
        }
    };

    // Initialize Scope and Style selects
    scopeSelect = createCustomSelect(scopeSelectContainer, [
        { label: "Full Page", value: "Full Page" },
        { label: "Selection Only", value: "Selection Only" },
        { label: "Metadata Only", value: "Metadata Only" }
    ], "Full Page");

    const updatePersonaInstruction = () => {
        const selected = personasData.find(p => p.id === personaSelect.getValue());
        if (selected) {
            personaInstructionArea.value = selected.instruction;
        }
    };


    const savePersonas = async () => {
        // Find which personas are "customized" (different from defaults is hard to track, so we just save all that originated from custom or been edited)
        // For simplicity, we save any that have been changed in this session or were already in custom storage
        const customToSave = personasData.filter(p => {
            // Logic: if it's not a default or is modified, save it. 
            // Better: just save EVERYTHING that is currently in personasData to goprompts_custom_personas
            return true; 
        });
        await chrome.storage.local.set({ 'goprompts_custom_personas': customToSave });
    };

    loadPersonas();

    window.onclick = () => {
        document.querySelectorAll(".custom-select").forEach(s => s.classList.remove("active"));
    };

    editPersonaBtn.addEventListener("click", () => {
        if (isAddingNew) return; // Ignore if adding
        personaEditor.style.display = personaEditor.style.display === "none" ? "block" : "none";
        personaNameContainer.style.display = "none";
        editPersonaBtn.style.opacity = personaEditor.style.display === "block" ? "1" : "0.8";
        updatePersonaInstruction();
    });

    cancelPersonaBtn.addEventListener("click", () => {
        personaEditor.style.display = "none";
        personaNameContainer.style.display = "none";
        isAddingNew = false;
        editPersonaBtn.style.opacity = "0.8";
        loadPersonas(); // Refresh to discard unsaved name changes or restores
    });

    personaInstructionArea.addEventListener("input", () => {
        saveStatus.innerText = "Unsaved changes...";
        saveStatus.style.opacity = "0.7";
    });

    const handleSavePersona = async () => {
        if (isAddingNew) {
            const name = personaNameInput.value.trim();
            if (!name) {
                alert("Please enter a persona name.");
                return;
            }
            const id = name.toLowerCase().replace(/[^a-z0-9]/g, '_') + "_" + Date.now();
            const newPersona = { id, name, instruction: personaInstructionArea.value || `Act as a ${name}.` };
            personasData.push(newPersona);
            
            personasData = [...personasData]; // trigger refresh
            personaSelect.refresh(personasData.map(p => ({ label: p.name, value: p.id })));
            personaSelect.setValue(id);
        } else {
            const selected = personasData.find(p => p.id === personaSelect.getValue());
            if (selected) {
                selected.instruction = personaInstructionArea.value;
            }
        }

        await savePersonas();
        
        // Collapse and Reset
        personaEditor.style.display = "none";
        personaNameContainer.style.display = "none";
        isAddingNew = false;
        editPersonaBtn.style.opacity = "0.8";
        saveStatus.innerText = "Saved to storage";
        saveStatus.style.opacity = "0.4";
    };

    savePersonaBtn.addEventListener("click", handleSavePersona);

    addPersonaBtn.addEventListener("click", () => {
        isAddingNew = true;
        personaEditor.style.display = "block";
        personaNameContainer.style.display = "block";
        personaNameInput.value = "";
        personaInstructionArea.value = "";
        personaNameInput.focus();
        saveStatus.innerText = "Enter details to save";
    });

    personaNameInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && isAddingNew) {
            handleSavePersona();
        }
    });

    // Handle Segmented Controls
    container.querySelectorAll(".segmented-control .segment").forEach(btn => {
        btn.addEventListener("click", () => {
            const parent = btn.parentElement;
            parent.querySelectorAll(".segment").forEach(s => s.classList.remove("active"));
            btn.classList.add("active");
        });
    });

    const getSegmentValue = (id) => container.querySelector(`${id} .segment.active`)?.getAttribute("data-val") || "Standard";

    // Extract function for Pulling natively from the DOM
    const pullCurrentPromptText = () => {
        try {
            let result = "";
            const gptInput = document.querySelector('#prompt-textarea');
            if (gptInput) result = gptInput.tagName === 'TEXTAREA' ? gptInput.value : gptInput.innerText;
            
            if (!result) {
                const claudeInput = document.querySelector('div[contenteditable="true"]');
                if (claudeInput) result = claudeInput.innerText;
            }
            
            if (!result) {
                let active = document.activeElement;
                if (active && active.id !== 'lab-draft-input' && (active.tagName === 'TEXTAREA' || active.isContentEditable)) {
                    result = active.tagName === 'TEXTAREA' ? active.value : active.innerText;
                }
            }

            if (result && result.trim().length > 0) {
                draftInput.value = result.trim(); // Update the draft input with the pulled text
                return result.trim();
            }
        } catch(err) {
            console.error("Prompt Lab Pull Error:", err);
        }
        return "";
    };

    // Auto-pull on load to be helpful
    setTimeout(pullCurrentPromptText, 100);

    const extractSmartContext = () => {
        const clone = document.body.cloneNode(true);
        const noiseSelectors = ['nav', 'footer', 'script', 'style', 'noscript', 'iframe', 'svg', '[role="navigation"]', '[role="banner"]', '[role="contentinfo"]', 'header'];
        clone.querySelectorAll(noiseSelectors.join(',')).forEach(el => el.remove());
        const mainSelectors = ['article', 'main', '[role="main"]', '#content', '.content', '.post'];
        let contentText = "";
        for (let sel of mainSelectors) {
            const el = clone.querySelector(sel);
            if (el) {
                contentText = el.innerText.trim();
                if (contentText.length > 200) break;
            }
        }
        if (!contentText || contentText.length < 200) { contentText = clone.innerText.trim(); }
        const title = document.title;
        const desc = document.querySelector('meta[name="description"]')?.content || "";
        return `Title: ${title}\nDescription: ${desc}\n\nContent:\n${contentText}`.slice(0, 15000);
    };

    const pushToPage = (text) => {
        const simulateInput = (element, value) => {
            if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
                element.value = value;
            } else if (element.isContentEditable) {
                element.innerText = value;
            }
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
        };

        let pushed = false;
        try {
            const gptInput = document.querySelector('#prompt-textarea');
            if (gptInput) { simulateInput(gptInput, text); pushed = true; }
            else {
                const claudeInput = document.querySelector('div[contenteditable="true"]');
                if (claudeInput) { simulateInput(claudeInput, text); pushed = true; }
                else {
                    let active = document.activeElement;
                    if (active && active.id !== 'lab-draft-input' && (active.tagName === 'TEXTAREA' || active.isContentEditable)) {
                        simulateInput(active, text); pushed = true;
                    }
                }
            }
        } catch(err) {
            console.error("Prompt Lab Push Error:", err);
        }
        
        if (!pushed) {
            navigator.clipboard.writeText(text);
        }
        return pushed;
    };

    // Complexity Glow logic (Removed as we have a unified card now)
    const draftInput = container.querySelector("#lab-draft-input");
    const enhanceBtn = container.querySelector("#lab-enhance-btn");
    const contextToggle = container.querySelector("#lab-context-btn");

    enhanceBtn.addEventListener("click", () => {
        // 1. Auto-pull if empty
        let draft = draftInput.value.trim();
        if (!draft) {
            draft = pullCurrentPromptText();
        }

        if (!draft) {
            alert("Nothing to enhance! Please type a draft or ensure there's text in your AI input box.");
            return;
        }

        enhanceBtn.innerHTML = "⏳ Thinking...";
        enhanceBtn.style.opacity = "0.7";
        enhanceBtn.disabled = true;

        const finishEnhance = (finalContext) => {
            const selectedPersonaId = personaSelect.getValue();
            const personaObj = personasData.find(p => p.id === selectedPersonaId);
            const personaName = personaObj ? personaObj.name : selectedPersonaId;
            const personaInstruction = personaObj ? personaObj.instruction : `Act as a ${selectedPersonaId}.`;

            chrome.runtime.sendMessage({
                type: "OLLAMA_ENHANCE_REQUEST",
                draft: draft,
                context: finalContext,
                style: "Professional", // Defaulting to Professional since bar is removed
                persona: personaName,
                personaInstruction: personaInstruction,
                size: getSegmentValue("#size-control"),
                expertise: getSegmentValue("#expertise-control"),
                contextScope: scopeSelect.getValue()
            }, (response) => {
                if (response && response.success) {
                    const finalOutput = response.output.trim();
                    draftInput.value = finalOutput;
                    
                    // 2. Auto-push to page
                    const pushed = pushToPage(finalOutput);
                    
                    enhanceBtn.innerHTML = pushed ? "✨ Enhanced & Pushed!" : "✨ Enhanced & Copied!";
                    enhanceBtn.style.background = pushed ? "#10b981" : "#007AFF"; // Green for success, Blue for copy
                    
                    setTimeout(() => {
                        enhanceBtn.innerHTML = "✨ Magic Enhance & Push";
                        enhanceBtn.style.background = ""; // Restore original
                        enhanceBtn.style.opacity = "1";
                        enhanceBtn.disabled = false;
                    }, 2500);
                } else {
                    enhanceBtn.innerHTML = "✨ Magic Enhance & Push";
                    enhanceBtn.style.opacity = "1";
                    enhanceBtn.disabled = false;
                    alert("Enhancement Failed: " + (response?.error || 'Unknown'));
                }
            });
        };

        if (contextToggle.checked) {
            const isContentScript = typeof chrome === 'undefined' || !chrome.tabs;
            if (isContentScript) {
                finishEnhance(extractSmartContext());
            } else {
                finishEnhance(""); // Fail gracefully if outside context
            }
        } else {
            finishEnhance("");
        }
    });
}
