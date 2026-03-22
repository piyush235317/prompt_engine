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
        <div class="header-title" style="pointer-events: none; display: flex; align-items: center; gap: 6px;">
            Promptly
            <svg id="api-status-dot" title="API Status Unknown" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: #808080; margin-top: 2px; transition: all 0.3s ease; filter: drop-shadow(0 0 4px rgba(0,0,0,0.1)); cursor: help;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
        </div>
        <div class="header-controls">
          <button id="pin-btn" class="mac-control-btn" title="Pin to Right Mid Point">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-2.115a2 2 0 0 0-.586-1.414L15.328 10.38a2 2 0 0 1-.586-1.414V4.5A1.5 1.5 0 0 0 13.242 3h-2.485A1.5 1.5 0 0 0 9.27 4.5v4.465a2 2 0 0 1-.586 1.414l-3.086 3.091a2 2 0 0 0-.586 1.414V17Z"/></svg>
          </button>
          <button id="minimize-btn" class="mac-close-btn" title="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>

      <div class="app-container">
        <div id="sidebar" class="browser-sidebar">
          <div id="sidebar-scroll"></div>
          <div id="sidebar-footer"></div>
        </div>
        <div id="tabs-container"></div>
      </div>
      <div class="resizer resizer-l"></div>
      <div class="resizer resizer-b"></div>
      <div class="resizer resizer-lb"></div>
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

    // Load saved theme
    if (localStorage.getItem('goprompts-theme') === 'dark') {
        panel.classList.add('dark-mode');
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
            
            // Re-apply pinning if saved
            if (localStorage.getItem('goprompts-pinned') === 'true') {
                pinPanel();
            }
        });
    });

    // 4. Pinning Logic
    const pinBtn = panel.querySelector('#pin-btn');
    function pinPanel() {
        panel.style.transition = 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        panel.style.left = (window.innerWidth - panel.offsetWidth) + 'px';
        panel.style.top = (window.innerHeight / 2 - panel.offsetHeight / 2) + 'px';
        panel.style.right = '0';
        panel.style.bottom = 'auto'; // ensure it's not sticking to bottom
        panel.classList.add('pinned');
        localStorage.setItem('goprompts-pinned', 'true');
        localStorage.setItem('goprompts-pos-x', panel.style.left);
        localStorage.setItem('goprompts-pos-y', panel.style.top);
        
        // Reset transition after animation
        setTimeout(() => { panel.style.transition = ''; }, 400);
    }

    function unpinPanel() {
        panel.classList.remove('pinned');
        localStorage.setItem('goprompts-pinned', 'false');
    }

    if (pinBtn) {
        pinBtn.addEventListener('click', () => {
            if (panel.classList.contains('pinned')) {
                unpinPanel();
            } else {
                pinPanel();
            }
        });
    }

    // 5. Minimize Logic
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
        if (panel.classList.contains('pinned')) return; // Disable dragging when pinned
        
        isDraggingBox = true;
        boxDragStartX = e.clientX;
        boxDragStartY = e.clientY;
        
        const rect = panel.getBoundingClientRect();
        boxInitialLeft = rect.left;
        boxInitialTop = rect.top;
        
        header.style.cursor = 'grabbing';
        panel.style.transition = 'none';
        // unpinPanel(); // PREVIOUSLY: Unpin on drag. NOW: Disable dragging instead.
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

    // 6. Resizing logic for the Prompt Box
    function initResizer(resizer, direction) {
        let startX, startY, startWidth, startHeight, startLeft;

        resizer.addEventListener('mousedown', (e) => {
            if (panel.classList.contains('pinned')) return; // Prevent resizing when pinned
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(document.defaultView.getComputedStyle(panel).width, 10);
            startHeight = parseInt(document.defaultView.getComputedStyle(panel).height, 10);
            startLeft = panel.offsetLeft;
            
            const onMouseMove = (e) => {
                if (direction.includes('l')) {
                    const dx = e.clientX - startX;
                    const newWidth = startWidth - dx;
                    if (newWidth > 300) { // Check min-width
                        panel.style.width = newWidth + 'px';
                        panel.style.left = (startLeft + dx) + 'px';
                    }
                }
                if (direction.includes('b')) {
                    panel.style.height = (startHeight + e.clientY - startY) + 'px';
                }
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                panel.style.transition = ''; 
                
                // If we were resizing and pinned, we might want to stay pinned but update storage
                if (panel.classList.contains('pinned')) {
                    // Update left position to ensure it's still at the right edge if width changed
                    panel.style.left = (window.innerWidth - panel.offsetWidth) + 'px';
                }
                
                localStorage.setItem('goprompts-pos-x', panel.style.left);
                localStorage.setItem('goprompts-pos-y', panel.style.top);
            };

            panel.style.transition = 'none'; 
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            e.preventDefault();
        });
    }

    initResizer(panel.querySelector('.resizer-l'), 'l');
    initResizer(panel.querySelector('.resizer-b'), 'b');
    // Corner handle for bottom-left resizing
    initResizer(panel.querySelector('.resizer-lb'), 'lb');

    // 7. Sliding logic for tabs and prompts
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
    
    makeScrollable(panel.querySelector('#sidebar-scroll'));
    makeScrollable(panel.querySelector('#tabs-container'));
}

function updateApiStatus() {
    const dot = document.getElementById("api-status-dot");
    if (!dot) return;
    
    // Set to "checking" state initially
    dot.style.color = "#ffd60a"; // Yellow
    dot.style.filter = "drop-shadow(0 0 6px rgba(255, 214, 10, 0.4))";
    dot.title = "Verifying Connection...";

    chrome.runtime.sendMessage({ type: "PING_PROVIDER" }, (res) => {
        if (res && res.success) {
            dot.style.color = "#34C759"; // Green
            dot.style.filter = "drop-shadow(0 0 8px rgba(52, 199, 89, 0.6))";
            dot.title = res.message || "Pipeline: Online";
        } else {
            dot.style.color = "#FF3B30"; // Red
            dot.style.filter = "drop-shadow(0 0 8px rgba(255, 59, 48, 0.4))";
            dot.title = res?.error || "Pipeline: Offline";
        }
    });
}

// Listen for storage changes to update dot
chrome.storage.onChanged.addListener((changes) => {
    if (changes.goprompts_api_key || changes.goprompts_ai_provider) {
        updateApiStatus();
    }
});