// ==========================================
// 1. 寿司图鉴配置
// ==========================================
const SUSHI_DB = [
    { id: "sake", name: "Sake (Salmon)", mat: "Atlantic Salmon", colors: { 'A': '#f97316', 'B': '#fdba74' }, pixels: ["000011111111110000","0001AAAAAAAAAAB100","001ABAAAAAAAABAA10","01AABAAAAAAABAAAA1","1AAABAAAAAABAAAAA1","111111111111111111","01rrrrrrrrrrrrrs10","01rrrrrrrrrrrsss10","001rrrrrrrrrsss100","000111111111111000"] },
    { id: "ebi", name: "Ebi (Shrimp)", mat: "Boiled Tiger Shrimp", colors: { 'A': '#fff', 'B': '#ef4444', 'C': '#f97316' }, pixels: ["000111111110000000","001BABABABA1011000","01ABABABABA11CC100","1BABABABAAB1CCCC10","1ABABABABAB1CCCC10","111111111111111110","01rrrrrrrrrrs10000","01rrrrrrrrrss10000","001rrrrrrrrs100000","000111111111000000"] },
    { id: "tamago", name: "Tamago (Egg)", mat: "Sweet Rolled Omelet", colors: { 'A': '#fef08a', 'B': '#eab308' }, pixels: ["000111111111110000","001AAAAAAAAAAB1000","01AAAAAAAAAAAB1000","1BBAAAAAAAAABB1000","1nn111111111nn1000","1nn1rrrrrrrrnn1110","1nn1rrrrrrrrnns100","1nn1rrrrrrrnns1000","011111111111110000"] },
    { id: "uni", name: "Uni (Urchin)", mat: "Premium Urchin", colors: { 'A': '#eab308', 'B': '#ca8a04' }, pixels: ["00011111100000","011BABAAB11000","1BAABABABBAB10","1nnnnnnnnnnnn1","1nAAAAAAAAAAn1","1nnnnnnnnnnnn1","1nrrrrrrrrrsn1","1nrrrrrrrrssn1","1nrrrrrrrsssn1","01111111111110"] },
    { id: "tako", name: "Tako (Octopus)", mat: "Boiled Tentacle", colors: { 'A': '#fecdd3', 'B': '#be123c', 'C': '#fff' }, pixels: ["0000111111100000","0001BBBBBBB10000","001C1BAAAB1C1000","01C11BAAAB11C100","11111BAAAB111110","1AAABAAAAABAAA10","1111111111111110","01rrrrrrrrrrs100","01rrrrrrrrss1000","0011111111110000"] },
    { id: "maguro", name: "Maguro (Tuna)", mat: "Bluefin Tuna Akami", colors: { 'A': '#dc2626', 'B': '#991b1b' }, pixels: ["0000111111111100","0001AAAAAAAAAB10","001AAAAAAAAAAB10","01AAAAAAAAAAAB10","1AAAAAAAAAAABB10","1111111111111110","01rrrrrrrrrrrs10","01rrrrrrrrrsss10","0011111111111100"] },
    { id: "unagi", name: "Unagi (Eel)", mat: "Grilled Eel, Soy Tare", colors: { 'A': '#78350f', 'B': '#451a03', 'C': '#fcd34d' }, pixels: ["0001111111111000","001BBBBBBBBBB100","01ACAAABAAABAA10","1BABABABABABAB10","1nn111111111nn10","1nn1rrrrrrrrnn10","1nn1rrrrrrrnns10","0111111111111100"] }
];

function generateSushiImage(sDef, withPlate = false) {
    const cvs = document.createElement('canvas'); const ctx = cvs.getContext('2d');
    const scale = withPlate ? 4 : 2; cvs.width = 24 * scale; cvs.height = 20 * scale;
    if(withPlate) {
        ctx.fillStyle = "#111"; ctx.fillRect(2*scale, 16*scale, 20*scale, 4*scale);
        ctx.fillStyle = ["#ef4444", "#3b82f6", "#eab308", "#f8fafc"][Math.floor(Math.random()*4)];
        ctx.fillRect(3*scale, 15*scale, 18*scale, 3*scale);
        ctx.fillStyle = "#fff"; ctx.fillRect(18*scale, 15*scale, 2*scale, scale);
    }
    const cMap = { '0':null, '1':'#111', 'r':'#fff', 's':'#cbd5e1', 'n':'#1f2937', ...sDef.colors };
    const oX = Math.floor((24 - sDef.pixels[0].length)/2); const oY = withPlate ? 5 : 2;
    for(let y=0; y<sDef.pixels.length; y++) for(let x=0; x<sDef.pixels[y].length; x++) {
        if(cMap[sDef.pixels[y][x]]) { ctx.fillStyle=cMap[sDef.pixels[y][x]]; ctx.fillRect((x+oX)*scale, (y+oY)*scale, scale, scale); }
    }
    return cvs.toDataURL();
}
const TILE_CACHE = {}; const BELT_CACHE = {};
SUSHI_DB.forEach(s => { TILE_CACHE[s.id] = generateSushiImage(s, false); BELT_CACHE[s.id] = generateSushiImage(s, true); });

function getPixelTrophy() {
    const cvs = document.createElement('canvas'); const ctx = cvs.getContext('2d');
    cvs.width = 24; cvs.height = 24;
    const pxls = [
        "000000000000",
        "011111111110",
        "110111111011",
        "110111111011",
        "011111111110",
        "000111111000",
        "000011110000",
        "000001100000",
        "000011110000",
        "000111111000",
        "000000000000"
    ];
    for(let y=0; y<pxls.length; y++) for(let x=0; x<pxls[y].length; x++) {
        if(pxls[y][x]==='1') { ctx.fillStyle = '#fde047'; ctx.fillRect(x*2, y*2, 2, 2); }
        if(pxls[y][x]==='0') { ctx.fillStyle = '#000'; ctx.fillRect(x*2, y*2, 2, 2); }
    }
    return cvs.toDataURL();
}
document.getElementById('lb-btn').innerHTML = `<img src="${getPixelTrophy()}" style="width:24px; height:24px; image-rendering:pixelated;">`;

// ==========================================
// 2. 猫主厨与吃客动画
// ==========================================
const CHEF_LIST = [
    { id: 'bamo', name: 'BAMO', colors: { 'W': '#f8fafc', 'S': '#f8fafc' } }, 
    { id: 'coffee', name: 'COFFEE', colors: { 'W': '#9ca3af', 'S': '#4b5563' } },
    { id: 'mango', name: 'MANGO', colors: { 'W': '#fcd34d', 'S': '#ea580c' } }
];
let currentChefIdx = 0;

document.getElementById('prev-chef').addEventListener('click', () => {
    if(gamePhase === 'PLAYING') return; 
    currentChefIdx = (currentChefIdx - 1 + CHEF_LIST.length) % CHEF_LIST.length;
    document.getElementById('chef-badge').innerText = CHEF_LIST[currentChefIdx].name;
});
document.getElementById('next-chef').addEventListener('click', () => {
    if(gamePhase === 'PLAYING') return;
    currentChefIdx = (currentChefIdx + 1) % CHEF_LIST.length;
    document.getElementById('chef-badge').innerText = CHEF_LIST[currentChefIdx].name;
});

const chefCvs = document.getElementById('chefCanvas'); const cCtx = chefCvs.getContext('2d');
const custCvs = document.getElementById('customerCanvas'); const custCtx = custCvs.getContext('2d');
const PXL = 3; chefCvs.width = 100 * PXL; chefCvs.height = 60 * PXL;
custCvs.width = 80; custCvs.height = 70;

let gamePhase = 'IDLE'; 
let isCustomerEating = false;
let renderTick = 0;

const ANIM = {
    chef_idle: ["........#........#........",".......#W#......#W#.......","......#EWW######WWE#......","......#WSWSWWWWWSWS#......",".....#HHHHHHHHHHHHHH#.....",".....#WWWWWWWWWWWWWW#.....",".....#W##WWWWWWWW##W#.....",".....#WWWWWWWWWWWWWW#.....","......#WWSWW##WWSWW#......",".......##WWWWWWWW##.......",".........#CCCCCC#.........","........#CCCCCCCC#........",".......#CCCCCCCCCC#......."],
    chef_make: ["........#........#........",".......#W#......#W#.......","......#EWW######WWE#......","......#WSWSWWWWWSWS#......",".....#HHHHHHHHHHHHHH#.....",".....#WWWWWWWWWWWWWW#.....",".....#W#W#WWWWWW#W#W#.....",".....#WWWWWWWWWWWWWW#.....","......#WWSWW##WWSWW#......",".......##WWWWWWWW##.......",".........#CCCCCC#.........","........#CC....CC#........",".......#CCW....WCC#......."],
    cust_wait: [".....##......##.....","....#EE#....#EE#....","...#WEEW####WEEW#...","..#WWWWWWWWWWWWWW#..",".#WWSKWWWWWWWSKWW#.",".#WWWWWWWWWWWWWWWW#.",".#WWWWWWKWWKWWWWWW#.",".#WWWWWKWWWWKWWWWW#.","..#WWWW######WWWW#..","...#WWWWWWWWWWWW#...","....############...."],
    cust_eat: [".....##......##.....","....#EE#....#EE#....","...#WEEW####WEEW#...","..#WWWWWWWWWWWWWW#..",".#WWSSKWWWWWSSKWW#.",".#WWWWWWWWWWWWWWWW#.",".#WWWWWWKWWKWWWWWW#.",".#WWWWWKPPPPKWWWWW#.","..#WWWW#PPPP#WWWW#..","...#WWWW####WWWW#...","....############...."]
};

function drawCanvases() {
    cCtx.clearRect(0, 0, chefCvs.width, chefCvs.height); custCtx.clearRect(0,0,80,70);
    
    const isMaking = gamePhase === 'PLAYING';
    const chefFrame = isMaking && (Math.floor(renderTick / 10) % 2 === 0) ? ANIM.chef_make : ANIM.chef_idle;
    const baseColors = {'#':'#111', 'E':'#fca5a5', 'H':'#ef4444', 'C':'#1e293b'};
    const activeColors = { ...baseColors, ...CHEF_LIST[currentChefIdx].colors };

    for (let y=0; y<chefFrame.length; y++) for (let x=0; x<chefFrame[y].length; x++) {
        if (activeColors[chefFrame[y][x]]) { cCtx.fillStyle = activeColors[chefFrame[y][x]]; cCtx.fillRect((x+37)*PXL, (y+15)*PXL, PXL, PXL); }
    }
    if (isMaking && Math.random() > 0.6) { cCtx.fillStyle = "#fff"; cCtx.fillRect((42+Math.random()*15)*PXL, (22+Math.random()*5)*PXL, PXL, PXL); }
    cCtx.fillStyle = "#92400e"; cCtx.fillRect(0, 38*PXL, chefCvs.width, 22*PXL); cCtx.fillStyle = "#d97706"; cCtx.fillRect(0, 38*PXL, chefCvs.width, 3*PXL); cCtx.fillStyle = "#000"; cCtx.fillRect(0, 41*PXL, chefCvs.width, PXL);
    
    const custFrame = isCustomerEating ? ANIM.cust_eat : ANIM.cust_wait;
    const custColors = {'#':'#111', 'W':'#f97316', 'S':'#c2410c', 'E':'#fca5a5', 'K':'#111', 'P':'#f472b6'};
    for(let y=0; y<custFrame.length; y++) for(let x=0; x<custFrame[y].length; x++) {
        if(custColors[custFrame[y][x]]) { custCtx.fillStyle = custColors[custFrame[y][x]]; custCtx.fillRect((x+2)*3, (y+5)*3, 3, 3); }
    }
    renderTick++; requestAnimationFrame(drawCanvases);
}
drawCanvases();

// ==========================================
// 3. 生存与中场休息逻辑 
// ==========================================
let leaderboard = JSON.parse(localStorage.getItem('nekoSushiRankings')) || [];

const boardEl = document.getElementById('board');
const trayEl = document.getElementById('tray');
const beltEl = document.getElementById('belt-items');
const tooltip = document.getElementById('tooltip');
const startBtn = document.getElementById('start-btn');
const statusMsg = document.getElementById('status-msg');

let tilesData = [], trayArray = [];
let level = 1, score = 0;
let survivalTimer = null;
let graceTime = 0; 

startBtn.addEventListener('click', () => {
    if (gamePhase === 'IDLE' || gamePhase === 'OVER') {
        level = 1; score = 0; 
        document.getElementById('score-display').innerText = `000`;
    } else if (gamePhase === 'INTERMISSION') {
        level++;
    }
    
    document.getElementById('level-display').innerText = level;
    startBtn.disabled = true; startBtn.innerText = "WORKING...";
    document.getElementById('lb-btn').disabled = true; 
    document.querySelectorAll('.chef-arrow').forEach(a => a.style.display = 'none'); 
    
    document.getElementById('chef-text').innerText = `${CHEF_LIST[currentChefIdx].name}: "Shift started! Feed the orange cat!"`;
    gamePhase = 'PLAYING';
    
    generateLevel(level);
    graceTime = 7.0; 
    
    clearInterval(survivalTimer);
    survivalTimer = setInterval(() => {
        if(gamePhase !== 'PLAYING') return;
        
        if (graceTime > 0) {
            graceTime -= 0.1;
            statusMsg.innerText = `HURRY: ${Math.ceil(graceTime)}s`;
            statusMsg.style.color = '#fca5a5';
        } else {
            statusMsg.innerText = `KEEP FEEDING!`;
            statusMsg.style.color = '#10b981';
            
            const sushiOnBelt = document.querySelectorAll('.sliding-sushi').length;
            if(sushiOnBelt === 0) gameOver(false);
        }
    }, 100);
});

// 🌟 修复恶性死局 BUG 的核心位置 🌟
function generateLevel(lvl) {
    tilesData = []; trayArray = []; boardEl.innerHTML = ''; trayEl.innerHTML = '';
    
    // 组数 = (12 + (lvl -1) * 3) 
    let groups = 12 + (lvl - 1) * 3;
    let deck = [];
    for(let i=0; i<groups; i++) {
        const type = SUSHI_DB[Math.floor(Math.random() * SUSHI_DB.length)];
        deck.push(type, type, type); // 每次塞入3张，保证总是3的倍数
    }
    deck.sort(() => Math.random() - 0.5);

    const layers = 4 + Math.floor(lvl/2);
    
    // 不再用 itemsThisLayer 截断，而是把 deck 里的每一张牌都精准分配到各个 Z 轴层！
    for(let i=0; i<deck.length; i++) {
        const z = i % layers; // 均匀分配到各个层，防止 Math.floor 吞掉尾数
        const x = 20 + Math.random() * 370; 
        const y = 20 + Math.random() * 110;
        createTile(i, deck[i], x, y, z);
    }
    
    updateBoard();
}

function createTile(id, sDef, x, y, z) {
    const el = document.createElement('div'); el.className = 'tile';
    el.style.left = x + 'px'; el.style.top = y + 'px'; el.style.zIndex = z;
    const img = document.createElement('img'); img.src = TILE_CACHE[sDef.id]; el.appendChild(img);
    const tileObj = { id, sDef, x, y, z, element: el };
    tilesData.push(tileObj);
    el.addEventListener('click', () => handleTileClick(tileObj));
    boardEl.appendChild(el);
}

function updateBoard() {
    tilesData.forEach(t1 => {
        let blocked = false;
        for(let t2 of tilesData) {
            if(t2.z > t1.z && !(t1.x+44-2 <= t2.x+2 || t1.x+2 >= t2.x+44-2 || t1.y+52-2 <= t2.y+2 || t1.y+2 >= t2.y+52-2)) {
                blocked = true; break;
            }
        }
        blocked ? t1.element.classList.add('blocked') : t1.element.classList.remove('blocked');
    });
}

// ==========================================
// 4. 消除、传送与 休息(Intermission) 判定
// ==========================================
function handleTileClick(tile) {
    if(tile.element.classList.contains('blocked') || trayArray.length >= 7) return;
    tilesData = tilesData.filter(t => t.id !== tile.id);
    trayArray.push(tile);
    trayArray.sort((a,b) => a.sDef.id.localeCompare(b.sDef.id));
    renderTray(); updateBoard();
    setTimeout(checkMatches, 150);
}

function renderTray() {
    trayEl.innerHTML = '';
    trayArray.forEach(t => { trayEl.appendChild(t.element); });
}

function checkMatches() {
    const counts = {}; trayArray.forEach(t => counts[t.sDef.id] = (counts[t.sDef.id] || 0) + 1);
    let matchedId = Object.keys(counts).find(id => counts[id] >= 3);

    if (matchedId) {
        const toRemove = trayArray.filter(t => t.sDef.id === matchedId).slice(0,3);
        const sDef = toRemove[0].sDef;
        toRemove.forEach(t => t.element.classList.add('pop-out'));
        
        setTimeout(() => {
            trayArray = trayArray.filter(t => !toRemove.includes(t));
            renderTray(); serveToBelt(sDef); 
            
            if(tilesData.length===0 && trayArray.length===0) {
                gamePhase = 'INTERMISSION'; 
                document.getElementById('chef-text').innerText = `${CHEF_LIST[currentChefIdx].name}: "Board Cleared! Take a breather."`;
                statusMsg.innerText = "RESTING...";
                statusMsg.style.color = '#fde047';
                
                startBtn.disabled = false;
                startBtn.innerText = "NEXT LEVEL";
                document.getElementById('lb-btn').disabled = false;
                document.querySelectorAll('.chef-arrow').forEach(a => a.style.display = 'block'); 
            }
        }, 400);
    } else if (trayArray.length === 7) {
        gameOver(true);
    }
}

function serveToBelt(sDef) {
    const img = document.createElement('img'); img.src = BELT_CACHE[sDef.id]; img.className = 'sliding-sushi';
    img.addEventListener('mouseenter', () => { document.getElementById('tt-name').innerText = sDef.name; document.getElementById('tt-mat').innerText = sDef.mat; tooltip.classList.remove('hidden'); });
    img.addEventListener('mousemove', e => { tooltip.style.left = e.pageX + 15 + 'px'; tooltip.style.top = e.pageY + 15 + 'px'; });
    img.addEventListener('mouseleave', () => tooltip.classList.add('hidden'));
    beltEl.appendChild(img);

    setTimeout(() => {
        if(img.parentNode) img.parentNode.removeChild(img);
        tooltip.classList.add('hidden');
        
        if(gamePhase === 'OVER' || gamePhase === 'IDLE') return;

        score += 1; 
        document.getElementById('score-display').innerText = score.toString().padStart(3, '0');

        isCustomerEating = true;
        document.getElementById('chef-text').innerText = `"Yum! Sushi Eaten: ${score}"`;
        setTimeout(() => isCustomerEating = false, 600); 

    }, 7200); 
}

// ==========================================
// 5. 排行榜 (严格前3名) 与数据重置
// ==========================================
function renderLeaderboard(targetId) {
    const listEl = document.getElementById(targetId);
    if (leaderboard.length === 0) {
        listEl.innerHTML = '<li class="empty-lb">No records yet.</li>';
        return;
    }
    
    // 🌟 修复：严格切割，只展示 Top 3 🌟
    listEl.innerHTML = leaderboard.slice(0, 3).map((entry, idx) => {
        let medal = '';
        if (idx === 0) medal = '🥇 '; else if (idx === 1) medal = '🥈 '; else if (idx === 2) medal = '🥉 ';
        return `<li>${medal}#${idx+1} [${entry.chef}] - Lvl ${entry.level} / ${entry.score} Plates</li>`;
    }).join('');
}

function gameOver(isTrayFull) {
    gamePhase = 'OVER';
    clearInterval(survivalTimer);
    statusMsg.innerText = "GAME OVER";
    statusMsg.style.color = '#ef4444';
    
    if (score > 0 || level > 1) {
        leaderboard.push({ chef: CHEF_LIST[currentChefIdx].name, level: level, score: score });
        leaderboard.sort((a,b) => {
            if (b.level !== a.level) return b.level - a.level;
            return b.score - a.score;
        });
        localStorage.setItem('nekoSushiRankings', JSON.stringify(leaderboard));
    }
    
    renderLeaderboard('end-leaderboard-list');

    document.getElementById('modal-title').innerText = isTrayFull ? "TRAY IS FULL!" : "BELT IS EMPTY!";
    document.getElementById('modal-desc').innerText = `You reached Level ${level} with ${score} plates.`;
    document.getElementById('modal').classList.remove('hidden');
}

// 重新开始游戏
document.getElementById('restart-btn').addEventListener('click', () => {
    document.getElementById('modal').classList.add('hidden');
    boardEl.innerHTML = '<div class="empty-state">Store Closed.</div>';
    trayEl.innerHTML = ''; beltEl.innerHTML = '';
    
    document.getElementById('chef-text').innerText = `"Ready for another shift, Boss?"`;
    startBtn.disabled = false; startBtn.innerText = "START SHIFT";
    document.getElementById('lb-btn').disabled = false;
    document.querySelectorAll('.chef-arrow').forEach(a => a.style.display = 'block'); 
    statusMsg.innerText = "NEKO SUSHI RUSH";
    statusMsg.style.color = '#10b981';
    
    gamePhase = 'IDLE';
});

// 独立排行榜弹窗
document.getElementById('lb-btn').addEventListener('click', () => {
    if(gamePhase === 'PLAYING') return; 
    renderLeaderboard('global-leaderboard-list');
    document.getElementById('lb-modal').classList.remove('hidden');
});
document.getElementById('close-lb').addEventListener('click', () => {
    document.getElementById('lb-modal').classList.add('hidden');
});

// 重置排行榜数据
document.getElementById('reset-lb-btn').addEventListener('click', () => {
    if(confirm("Delete all records? This cannot be undone.")) {
        leaderboard = [];
        localStorage.removeItem('nekoSushiRankings');
        renderLeaderboard('global-leaderboard-list');
    }
});
