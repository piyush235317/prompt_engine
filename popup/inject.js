/**
 * Site Adapter Pattern for Prompt Injection
 * This isolates the delicate DOM interactions for each specific 
 * platform into modular, easily updatable functions.
 */
const platformAdapters = [
    {
        name: "ChatGPT",
        match: () => location.hostname.includes("chatgpt.com"),
        getEditor: () => document.querySelector('#prompt-textarea') || document.querySelector('div[contenteditable="true"]'),
        getValue: (el) => el.tagName.toLowerCase() === 'textarea' ? el.value : el.innerText,
        setValue: (el, text) => {
            el.focus();
            
            // If it's still a textarea, bypass React natively
            if (el.tagName.toLowerCase() === 'textarea') {
                const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
                nativeSetter.call(el, text);
                el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            } else {
                // Otherwise (if it's a contenteditable div), safely use selection Range and execCommand
                const sel = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(el);
                sel.removeAllRanges();
                sel.addRange(range);
                document.execCommand("delete");
                document.execCommand("insertText", false, text);
                el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    },
    {
        name: "Claude",
        match: () => location.hostname.includes("claude.ai"),
        getEditor: () => document.querySelector('div.ProseMirror') || document.querySelector('[contenteditable="true"]'),
        getValue: (el) => el.innerText,
        setValue: (el, text) => {
            el.focus();
            const sel = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(el);
            sel.removeAllRanges();
            sel.addRange(range);
            document.execCommand("delete");
            document.execCommand("insertText", false, text);
            el.dispatchEvent(new Event('input', { bubbles: true }));
        }
    },
    {
        name: "Gemini",
        match: () => location.hostname.includes("gemini.google.com"),
        getEditor: () => document.querySelector('.ql-editor') || document.querySelector('rich-textarea div'),
        getValue: (el) => el.innerText || el.textContent,
        setValue: (el, text) => {
            el.focus();
            const sel = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(el);
            sel.removeAllRanges();
            sel.addRange(range);
            document.execCommand("delete");
            document.execCommand("insertText", false, text);
            el.dispatchEvent(new Event('input', { bubbles: true }));
        }
    },
    {
        name: "Generic Fallback",
        match: () => true, // Runs if nothing else matched
        getEditor: () => document.querySelector('textarea, [contenteditable="true"]'),
        getValue: (el) => (el.tagName.toLowerCase() === 'textarea' || el.tagName.toLowerCase() === 'input') ? el.value : el.innerText,
        setValue: (el, text) => {
            el.focus();
            if (el.tagName.toLowerCase() === 'textarea' || el.tagName.toLowerCase() === 'input') {
                el.value = text;
                el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            } else {
                const sel = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(el);
                sel.removeAllRanges();
                sel.addRange(range);
                document.execCommand("delete");
                document.execCommand("insertText", false, text);
                el.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    }
];

// Global memory to prevent templates from swallowing previous templates if clicked back-to-back
window.lastInjectedState = {
    injectedText: "",
    originalInput: "",
    wasTemplate: false
};

const lastInjectedState = window.lastInjectedState;

function handleUse(card) {
    // SECURITY UX UPGRADE: Use textContent instead of innerText
    // innerText forces the browser to calculate the CSS box-model (causing a massive lag spike on complex sites like ChatGPT). textContent reads the raw string instantly!
    const text = (card.querySelector('.hidden-raw-content') || card.querySelector('.card-content'))?.textContent;
    if (!text) return;

    // Find the adapter for the current website
    const adapter = platformAdapters.find(a => a.match());
    
    if (!adapter) {
        console.warn("GoPrompts: No compatible platform adapter found.");
        return;
    }

    // Try to find the editor DOM node
    const editor = adapter.getEditor();
    if (!editor) {
        alert(`GoPrompts: Could not locate the chat box for ${adapter.name}. The website may have updated its layout!`);
        return;
    }

    // Safely inject the text using the platform-specific logic
    try {
        let finalText = text;
        const hasTemplateArgs = text.includes("{{input}}");
        const hasAiArgs = text.includes("{{ai}}");
        
        // Dynamically apply templating architecture if invoked
        if (hasTemplateArgs || hasAiArgs) {
            let userInput = "";
            if (typeof adapter.getValue === "function") {
                userInput = adapter.getValue(editor) || "";
            }
            
            // Strip out whitespaces for comparison because React textareas and ProseMirror often distort native line-breaks
            const cleanUser = userInput.replace(/\s+/g, '');
            const cleanLast = lastInjectedState.injectedText.replace(/\s+/g, '');
            
            // If the last thing injected was a template AND the chatbox text natively matches it still, intelligently swap back to the original unmodified keyword!
            if (lastInjectedState.wasTemplate && lastInjectedState.injectedText && cleanUser === cleanLast) {
                userInput = lastInjectedState.originalInput;
            } else {
                lastInjectedState.originalInput = userInput; // Capture fresh text
            }
            
            if (userInput.trim() !== "") {
                if (hasAiArgs) {
                    finalText = text.replace(/\{\{ai\}\}/g, userInput);
                } else {
                    finalText = text.replace(/\{\{input\}\}/g, userInput);
                }
            }
            lastInjectedState.wasTemplate = true;
        } else {
            lastInjectedState.wasTemplate = false;
        }
        
        // --- NEW AI ROUTING LOGIC ---
        if (hasAiArgs) {
            const loadingText = "🤖 AI Thinking...";
            lastInjectedState.injectedText = loadingText;
            adapter.setValue(editor, loadingText);

            chrome.runtime.sendMessage({ type: "OLLAMA_REQUEST", prompt: finalText }, (res) => {
                let aiOutput = "⚠️ AI Error: Could not reach Ollama (localhost:11434). Please ensure the local server is running!";
                if (res && res.success) {
                    aiOutput = res.output;
                } else if (res && res.error) {
                    aiOutput = "⚠️ AI Error: " + res.error;
                }
                
                lastInjectedState.injectedText = aiOutput;
                adapter.setValue(editor, aiOutput);
            });
            return; // Exit stringently here because normal injection runs natively async!
        }
        
        lastInjectedState.injectedText = finalText;
        adapter.setValue(editor, finalText);
    } catch (err) {
        console.error(`GoPrompts: Failed to inject prompt into ${adapter.name}.`, err);
    }
}

// Global click handler mapping
// SECURITY / SPEED UPGRADE: Passing `true` forces the browser into the "Capture Phase". 
// This forces our click listener to execute before ChatGPT or Claude's heavy React DOM queues get a chance to process the click, eliminating all bubbling lag!
document.addEventListener("click", function (e) {
    const card = e.target.closest(".card");
    // Ensure we aren't clicking an action button (Edit/Delete)
    const isActionButton = e.target.closest('.edit-btn') || e.target.closest('.delete-btn');
    
    if (card && !isActionButton) {
        handleUse(card);
    }
}, true);