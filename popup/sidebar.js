function renderSidebar(tabsData, onTabClick) {
    const sidebar = document.getElementById("sidebar");
    sidebar.innerHTML = "";

    tabsData.tabs.forEach((tab, index) => {
        const tabEl = document.createElement("div");
        tabEl.classList.add("side-tab");

        tabEl.innerHTML = `
            <span>${tab.icon}</span>
            <div>${tab.name}</div>
        `;

        if (index === 0) tabEl.classList.add("active");

        tabEl.addEventListener("click", () => {
            document.querySelectorAll(".side-tab").forEach(t => t.classList.remove("active"));
            tabEl.classList.add("active");

            onTabClick(tab.id);
        });

        sidebar.appendChild(tabEl);
    });
}