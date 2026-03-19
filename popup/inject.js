function handleUse(card) {
    const text = card.querySelector('.card-content')?.innerText;
    if (!text) return;

    let editor = null;

    // ChatGPT
    if (location.hostname.includes("chatgpt.com")) {
        editor = document.querySelector('#prompt-textarea') || document.querySelector('textarea');
    } 
    // Gemini
    else if (location.hostname.includes("gemini.google.com")) {
        editor = document.querySelector('.ql-editor.textarea');
    } 
    // Claude
    else if (location.hostname.includes("claude.ai")) {
        editor = document.querySelector('div.ProseMirror');
    }

    if (!editor) {
        alert("Editor not found");
        return;
    }

    editor.focus();

    document.execCommand("selectAll");
    document.execCommand("delete");
    document.execCommand("insertText", false, text);

    editor.dispatchEvent(new Event('input', { bubbles: true }));
}

// Global click handler
document.addEventListener("click", function (e) {
    const card = e.target.closest(".card");
    if (card) {
        handleUse(card);
    }
});