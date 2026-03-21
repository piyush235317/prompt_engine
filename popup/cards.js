// Close any open dropdowns when clicking outside
document.addEventListener('click', () => {
    document.querySelectorAll('.menu-dropdown').forEach(d => {
        d.style.display = 'none';
    });
});

function renderCards(cards, tabId) {
    const container = document.getElementById("tabs-container");
    container.innerHTML = "";

    if (!cards) cards = [];

    cards.forEach((card, index) => {
        const cardEl = document.createElement("div");
        cardEl.classList.add("card");

        cardEl.innerHTML = `
            <div class="card-content">${card.content || ""}</div>
        `;

        container.appendChild(cardEl);
    });

    // Add Prompt Button
    const addBtnContainer = document.createElement("div");
    addBtnContainer.style.textAlign = "center";
    addBtnContainer.style.marginTop = "15px";
    
    const addBtn = document.createElement("button");
    addBtn.innerText = "+ Add Prompt";
    addBtn.style.cssText = "padding: 10px 20px; cursor: pointer; border-radius: 8px; border: 1px dashed var(--border-light); background: transparent; color: inherit; font-size: 14px; transition: all 0.2s ease;";
    
    addBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const newText = prompt("Enter new prompt:");
        if (newText && newText.trim() !== '') {
            cards.push({ content: newText });
            await saveCards(tabId, { cards: cards });
            renderCards(cards, tabId);
        }
    });

    addBtnContainer.appendChild(addBtn);
    container.appendChild(addBtnContainer);
}