function renderSettingsUI() {
    const container = document.getElementById("tabs-container");
    container.innerHTML = "";
    
    const isDarkMode = localStorage.getItem('goprompts-theme') === 'dark';

    // 1. Initial UI with Appearance (using direct localStorage)
    container.innerHTML = `
        <style>
            .apple-switch input:checked + .apple-slider { background-color: #34C759 !important; }
            .apple-switch input:checked ~ .apple-slider-knob { transform: translateX(14px); }
        </style>
        <div class="settings-container">
            <h3 style="margin-top: 0; margin-bottom: 24px; font-weight: 600; font-size: 16.5px; letter-spacing: -0.3px; text-align: center;">Appearance</h3>
            
            <div class="settings-group" style="display: flex; align-items: center; justify-content: space-between; background: rgba(128,128,128,0.06); padding: 12px 16px; border-radius: 12px; margin-bottom: 30px; border: 1px solid var(--border-color);">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 18px;">🌙</span>
                    <label style="font-size: 14px; font-weight: 500; color: var(--text-color); margin: 0;">Dark Mode</label>
                </div>
                <label class="apple-switch" style="position: relative; display: inline-block; width: 34px; height: 20px; margin: 0;">
                    <input type="checkbox" id="setting-theme-toggle" ${isDarkMode ? 'checked' : ''} style="opacity: 0; width: 0; height: 0; position: absolute;">
                    <span class="apple-slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(128,128,128,0.3); transition: .3s; border-radius: 20px;"></span>
                    <span class="apple-slider-knob" style="position: absolute; content: ''; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: white; transition: .3s cubic-bezier(0.175, 0.885, 0.32, 1.275); border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></span>
                </label>
            </div>

            <div id="ai-settings-dynamic-root">
                <div style="text-align: center; padding: 40px; opacity: 0.5;">Loading configurations...</div>
            </div>
        </div>
    `;

    // Initialize theme listener immediately
    const themeToggle = container.querySelector('#setting-theme-toggle');
    themeToggle.addEventListener('change', () => {
        const panel = document.getElementById('prompt-box');
        if (themeToggle.checked) {
            panel.classList.add('dark-mode');
            localStorage.setItem('goprompts-theme', 'dark');
        } else {
            panel.classList.remove('dark-mode');
            localStorage.setItem('goprompts-theme', 'light');
        }
    });

    // 2. Async Load AI Target Configs
    chrome.storage.local.get(['goprompts_ai_provider', 'goprompts_api_key', 'goprompts_ai_model'], (settings) => {
        const provider = settings.goprompts_ai_provider || 'ollama';
        const apiKey = settings.goprompts_api_key || '';
        const model = settings.goprompts_ai_model || (provider === 'xai' ? 'grok-4-1-fast-non-reasoning' : 'llama3');
        
        const dynamicRoot = document.getElementById("ai-settings-dynamic-root");
        if (!dynamicRoot) return;

        dynamicRoot.innerHTML = `
            <h3 style="margin-top: 10px; margin-bottom: 24px; font-weight: 600; font-size: 16.5px; letter-spacing: -0.3px; text-align: center;">AI Processing Target</h3>
            
            <div class="settings-group">
                <label class="settings-label">Inference Provider</label>
                <select id="setting-provider" class="settings-input">
                    <option value="ollama" ${provider === 'ollama' ? 'selected' : ''}>Local: Ollama (Free/Offline)</option>
                    <option value="xai" ${provider === 'xai' ? 'selected' : ''}>Cloud: xAI API (Premium)</option>
                </select>
            </div>

            <div id="ai-model-container" class="settings-group" style="display: block;">
                <label class="settings-label">Target Model ID</label>
                <input type="text" id="setting-model" value="${model}" placeholder="grok-2 or llama3" class="settings-input" style="font-family: ui-monospace, monospace;">
            </div>

            <div id="api-key-container" class="settings-group" style="${provider === 'ollama' ? 'display: none;' : 'display: block;'}">
                <label class="settings-label">Network Authorization Key</label>
                <input type="password" id="setting-key" value="${apiKey}" placeholder="Key goes here..." class="settings-input" style="font-family: ui-monospace, SFMono-Regular, monospace; letter-spacing: -0.5px;">
            </div>

            <div class="settings-group" style="background: rgba(128,128,128,0.06); padding: 12px 16px; border-radius: 12px; margin-bottom: 24px; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; flex-direction: column; gap: 2px;">
                    <label class="settings-label" style="margin: 0; opacity: 1; font-size: 13px;">Pipeline Status</label>
                    <span id="ai-status-desc" style="font-size: 11px; opacity: 0.6;">Checking connectivity...</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div id="ai-status-dot" style="width: 10px; height: 10px; border-radius: 50%; background: #8e8e93; transition: all 0.3s; box-shadow: 0 0 0 rgba(0,0,0,0);"></div>
                </div>
            </div>

            <button id="save-settings-btn" style="width: 100%; padding: 12px; cursor: pointer; border-radius: 8px; border: none; background: #0a84ff; color: white; font-weight: 600; font-size: 14.5px; transition: all 0.2s ease;">Save Configuration</button>
            <div class="settings-hint">API keys are heavily isolated and stored exclusively inside Chrome's offline memory structure.</div>
        `;

        const statusDot = dynamicRoot.querySelector('#ai-status-dot');
        const statusDesc = dynamicRoot.querySelector('#ai-status-desc');

        const checkAIStatus = () => {
            statusDot.style.background = '#ffd60a'; // Yellow for checking
            statusDot.style.boxShadow = '0 0 8px rgba(255, 214, 10, 0.4)';
            statusDesc.innerText = 'Pinging AI Provider...';

            chrome.runtime.sendMessage({ type: "PING_PROVIDER" }, (res) => {
                if (res && res.success) {
                    statusDot.style.background = '#32d74b'; // Green
                    statusDot.style.boxShadow = '0 0 10px rgba(50, 215, 75, 0.5)';
                    statusDesc.innerText = res.message || 'System Online';
                } else {
                    statusDot.style.background = '#ff453a'; // Red
                    statusDot.style.boxShadow = '0 0 10px rgba(255, 69, 58, 0.5)';
                    statusDesc.innerText = res?.error || 'Connection Failed';
                }
            });
        };

        // Initial Check
        checkAIStatus();

        const providerSelect = dynamicRoot.querySelector('#setting-provider');
        const keyContainer = dynamicRoot.querySelector('#api-key-container');
        
        providerSelect.addEventListener('change', (e) => {
            keyContainer.style.display = e.target.value === 'ollama' ? 'none' : 'block';
        });

        dynamicRoot.querySelector('#save-settings-btn').addEventListener('click', (e) => {
            const btn = e.target;
            btn.innerText = 'Locking Data...';
            btn.style.opacity = '0.7';
            
            const newProvider = providerSelect.value;
            const newKey = dynamicRoot.querySelector('#setting-key').value.trim();
            const newModel = dynamicRoot.querySelector('#setting-model').value.trim() || (newProvider === 'xai' ? 'grok-2' : 'llama3');

            chrome.storage.local.set({
                goprompts_ai_provider: newProvider,
                goprompts_api_key: newKey,
                goprompts_ai_model: newModel
            }, () => {
                // Re-check status after save
                checkAIStatus();
                
                setTimeout(() => {
                    btn.innerText = 'Routing Synced!';
                    btn.style.background = '#32d74b';
                    btn.style.opacity = '1';
                    setTimeout(() => {
                        btn.innerText = 'Save Configuration';
                        btn.style.background = '#0a84ff';
                    }, 2200);
                }, 300);
            });
        });
    });
}
