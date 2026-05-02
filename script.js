document.addEventListener('DOMContentLoaded', () => {
    const totalFrames = 9;
    let memory = new Array(totalFrames).fill(null);
    let currentPageIdx = 0;
    let mode = 'simple'; // 'simple' or 'demand'
    let isSimulating = false;

    const framesContainer = document.getElementById('frames-container');
    const freeFrameListEl = document.getElementById('free-frame-list');
    const freeFramesValEl = document.getElementById('free-frames-val');
    const pageTableBody = document.getElementById('page-table-body');
    const btnSimple = document.getElementById('btn-simple');
    const btnDemand = document.getElementById('btn-demand');
    const btnSimulate = document.getElementById('btn-simulate');
    const btnReset = document.getElementById('btn-reset');

    // Initialize Frames
    function initFrames() {
        framesContainer.innerHTML = '';
        for (let i = 0; i < totalFrames; i++) {
            const frame = document.createElement('div');
            frame.className = 'frame';
            frame.id = `frame-${i}`;
            frame.innerHTML = `
                <span class="frame-label">Frame ${i}</span>
                <span class="frame-content">-</span>
            `;
            framesContainer.appendChild(frame);
        }
    }

    function updateUI() {
        const freeFrames = memory.filter(f => f === null).length;
        const freeIndexes = memory.map((f, i) => f === null ? i : null).filter(i => i !== null);
        
        freeFramesValEl.textContent = freeFrames;
        freeFrameListEl.textContent = `[${freeIndexes.join(', ')}]`;

        // Update Frames
        memory.forEach((val, i) => {
            const frame = document.getElementById(`frame-${i}`);
            const content = frame.querySelector('.frame-content');
            if (val !== null) {
                frame.classList.add('occupied');
                content.textContent = `Page ${val}`;
            } else {
                frame.classList.remove('occupied');
                content.textContent = '-';
            }
        });

        // Update Page Table
        pageTableBody.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const frameIdx = memory.indexOf(i);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${i}</td>
                <td class="f-num">${frameIdx === -1 ? '-' : frameIdx}</td>
                <td><span class="status ${frameIdx !== -1 ? 'loaded' : ''}">${frameIdx !== -1 ? 'Loaded' : 'Not Loaded'}</span></td>
            `;
            pageTableBody.appendChild(row);
        }
    }

    async function simulateSimple() {
        if (isSimulating) return;
        isSimulating = true;
        btnSimulate.disabled = true;

        // Load all 3 pages into the first 3 free frames
        for (let i = 0; i < 3; i++) {
            await new Promise(r => setTimeout(r, 400));
            memory[i] = i;
            updateUI();
        }
        
        isSimulating = false;
    }

    async function simulateDemand() {
        if (isSimulating || currentPageIdx >= 3) return;
        isSimulating = true;
        btnSimulate.textContent = "Requesting Page...";
        
        // Load one page at a time (Demand)
        await new Promise(r => setTimeout(r, 800));
        memory[currentPageIdx] = currentPageIdx;
        currentPageIdx++;
        updateUI();

        if (currentPageIdx >= 3) {
            btnSimulate.disabled = true;
            btnSimulate.textContent = "All Pages Loaded";
        } else {
            btnSimulate.textContent = "Request Page " + currentPageIdx;
        }
        
        isSimulating = false;
    }

    btnSimple.addEventListener('click', () => {
        if (isSimulating) return;
        mode = 'simple';
        btnSimple.classList.add('active');
        btnDemand.classList.remove('active');
        reset();
    });

    btnDemand.addEventListener('click', () => {
        if (isSimulating) return;
        mode = 'demand';
        btnDemand.classList.add('active');
        btnSimple.classList.remove('active');
        reset();
    });

    btnSimulate.addEventListener('click', () => {
        if (mode === 'simple') {
            simulateSimple();
        } else {
            simulateDemand();
        }
    });

    function reset() {
        memory = new Array(totalFrames).fill(null);
        currentPageIdx = 0;
        isSimulating = false;
        btnSimulate.disabled = false;
        btnSimulate.textContent = mode === 'simple' ? "Simulate Allocation" : "Request Page 0";
        updateUI();
    }

    btnReset.addEventListener('click', reset);

    // Initial setup
    initFrames();
    updateUI();
});
