function createPanel() {
    const panel = document.createElement("div");
    panel.id = "prompt-box";

    panel.innerHTML = `
      <div class="header">GoPrompts</div>

      <div class="app-container">
        <div id="sidebar"></div>
        <div id="tabs-container"></div>
      </div>
    `;

    document.body.appendChild(panel);
}