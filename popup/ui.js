function createPanel() {
    // 1. Create the floating action button (FAB)
    const fabButton = document.createElement("div");
    fabButton.id = "fab-button";
    fabButton.innerHTML = `🚀`;
    fabButton.style.fontSize = "36px";
    document.body.appendChild(fabButton);

    // 2. Create the main panel
    const panel = document.createElement("div");
    panel.id = "prompt-box";

    panel.innerHTML = `
      <div class="header">
        GoPrompts
        <button id="minimize-btn" class="theme-btn" style="right: 12px; font-weight: bold;" title="Close">✕</button>
        <button id="theme-toggle" class="theme-btn" style="right: 34px;" title="Toggle Theme">🌙</button>
      </div>

      <div class="app-container">
        <div id="sidebar"></div>
        <div id="tabs-container"></div>
      </div>
    `;

    document.body.appendChild(panel);

    // Load saved size
    const savedWidth = localStorage.getItem('goprompts-width');
    const savedHeight = localStorage.getItem('goprompts-height');
    if (savedWidth) panel.style.width = savedWidth;
    if (savedHeight) panel.style.height = savedHeight;

    // Observe size changes and save
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.target.style.width) {
                localStorage.setItem('goprompts-width', entry.target.style.width);
                localStorage.setItem('goprompts-height', entry.target.style.height);
            }
        }
    });
    resizeObserver.observe(panel);

    // Theme toggle logic
    const themeToggle = panel.querySelector('#theme-toggle');
    themeToggle.addEventListener('click', () => {
        panel.classList.toggle('dark-mode');
        if (panel.classList.contains('dark-mode')) {
            themeToggle.innerHTML = '☀️';
            localStorage.setItem('goprompts-theme', 'dark');
        } else {
            themeToggle.innerHTML = '🌙';
            localStorage.setItem('goprompts-theme', 'light');
        }
    });

    // Load saved theme
    if (localStorage.getItem('goprompts-theme') === 'dark') {
        panel.classList.add('dark-mode');
        themeToggle.innerHTML = '☀️';
    }

    // 3. FAB Click Logic (Hide FAB, Show Panel)
    fabButton.addEventListener('click', () => {
        fabButton.style.display = 'none';

        // Load position or default
        const savedLeft = localStorage.getItem('goprompts-pos-x');
        const savedTop = localStorage.getItem('goprompts-pos-y');
        if (savedLeft && savedTop) {
            panel.style.left = savedLeft;
            panel.style.top = savedTop;
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
            panel.style.transformOrigin = 'center';
        } else {
            panel.style.top = '20px';
            panel.style.right = '20px';
            panel.style.left = 'auto';
            panel.style.bottom = 'auto';
            panel.style.transformOrigin = 'right top';
        }

        requestAnimationFrame(() => {
            panel.classList.add('active');
        });
    });

    // 4. Minimize Logic
    const minimizeBtn = panel.querySelector('#minimize-btn');
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
            panel.classList.remove('active');
            
            // Show FAB after animation completes
            setTimeout(() => {
                fabButton.style.display = 'flex';
            }, 300);
        });
    }

    // 5. Dragging logic for the Prompt Box
    const header = panel.querySelector('.header');
    let isDraggingBox = false;
    let boxDragStartX = 0;
    let boxDragStartY = 0;
    let boxInitialLeft = 0;
    let boxInitialTop = 0;

    header.style.cursor = 'grab';

    header.addEventListener('mousedown', (e) => {
        if (e.target.tagName.toLowerCase() === 'button') return;
        
        isDraggingBox = true;
        boxDragStartX = e.clientX;
        boxDragStartY = e.clientY;
        
        const rect = panel.getBoundingClientRect();
        boxInitialLeft = rect.left;
        boxInitialTop = rect.top;
        
        header.style.cursor = 'grabbing';
        panel.style.transition = 'none';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDraggingBox) return;
        
        let newLeft = boxInitialLeft + (e.clientX - boxDragStartX);
        let newTop = boxInitialTop + (e.clientY - boxDragStartY);

        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - panel.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - panel.offsetHeight));

        panel.style.left = newLeft + 'px';
        panel.style.top = newTop + 'px';
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
        if (isDraggingBox) {
            isDraggingBox = false;
            header.style.cursor = 'grab';
            panel.style.transition = '';
            
            localStorage.setItem('goprompts-pos-x', panel.style.left);
            localStorage.setItem('goprompts-pos-y', panel.style.top);
        }
    });

    // 6. Sliding logic for tabs and prompts
    function makeScrollable(ele) {
        if (!ele) return;
        let isDown = false;
        let startY;
        let scrollTop;
        let hasDragged = false;

        ele.addEventListener('mousedown', (e) => {
            if (['button', 'input', 'textarea'].includes(e.target.tagName.toLowerCase())) return;
            if (e.target.closest('.card-header')) return;
            
            isDown = true;
            hasDragged = false;
            ele.style.cursor = 'grabbing';
            startY = e.pageY - ele.offsetTop;
            scrollTop = ele.scrollTop;
        });

        ele.addEventListener('mouseleave', () => {
            isDown = false;
            ele.style.cursor = '';
        });

        ele.addEventListener('mouseup', () => {
            isDown = false;
            ele.style.cursor = '';
        });

        ele.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const y = e.pageY - ele.offsetTop;
            const walk = (y - startY);
            if (Math.abs(walk) > 3) hasDragged = true;
            ele.scrollTop = scrollTop - walk;
        });
        
        ele.addEventListener('click', (e) => {
            if (hasDragged) {
                e.stopPropagation();
                e.preventDefault();
                hasDragged = false;
            }
        }, true);
    }

    makeScrollable(panel.querySelector('#sidebar'));
    makeScrollable(panel.querySelector('#tabs-container'));
}