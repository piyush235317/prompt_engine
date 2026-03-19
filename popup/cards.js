function renderCards(cards) {
    const container = document.getElementById("tabs-container");
    container.innerHTML = "";

    if (!cards) {
        container.innerHTML = "No data found";
        return;
    }

    cards.forEach(card => {
        const cardEl = document.createElement("div");
        cardEl.classList.add("card");

        cardEl.innerHTML = `
            <div class="card-content">${card.content || ""}</div>
        `;

        container.appendChild(cardEl);
    });
}