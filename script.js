let players = [];
let currentPlayerIndex = 0;
let matchHistory = []; 
let currentMultiplier = 1;
let dartsThrownInTurn = 0;
let matchStartingPlayerIndex = 0; // Ki kezdi a meccset
const STARTING_SCORE = 501;

// Leggyakoribb kiszállók szótára (170-től lefelé)
const checkouts = {
  170: "T20, T20, Bull", 167: "T20, T19, Bull", 164: "T20, T18, Bull", 161: "T20, T17, Bull", 160: "T20, T20, D20",
  158: "T20, T20, D19",  157: "T20, T19, D20",  156: "T20, T20, D18", 155: "T20, T19, D19", 154: "T20, T18, D20",
  153: "T20, T19, D18",  152: "T20, T20, D16", 151: "T20, T17, D20", 150: "T20, T18, D18", 149: "T20, T19, D16",
  148: "T20, T16, D20",  147: "T20, T17, D18", 146: "T20, T18, D16", 145: "T20, T15, D20", 144: "T20, T20, D12",
  143: "T20, T17, D16",  142: "T20, T14, D20", 141: "T20, T19, D12", 140: "T20, T20, D10", 139: "T20, T13, D20",
  138: "T20, T18, D12",  137: "T20, T19, D10", 136: "T20, T20, D8",  135: "T20, T17, D12", 134: "T20, T14, D16",
  133: "T20, T19, D8",   132: "T20, T16, D12", 131: "T20, T13, D16", 130: "T20, T20, D5",  129: "T19, T16, D12",
  128: "T18, T14, D16",  127: "T20, T17, D8",  126: "T19, T19, D6",  125: "25, T20, D20", 124: "T20, T16, D8",
  123: "T19, T16, D9",   122: "T18, T18, D7",  121: "T20, T11, D14", 120: "T20, 20, D20", 119: "T19, T12, D13",
  118: "T20, 18, D20",   117: "T20, 17, D20",  116: "T20, 16, D20", 115: "T20, 15, D20", 114: "T20, 14, D20",
  113: "T20, 13, D20",   112: "T20, 12, D20",  111: "T20, 11, D20", 110: "T20, 10, D20", 109: "T20, 9, D20",
  108: "T20, 16, D16",   107: "T19, 10, D20",  106: "T20, 6, D20",  105: "T20, 13, D16", 104: "T18, 18, D16",
  103: "T19, 6, D20",    102: "T20, 10, D16",  101: "T17, 10, D20", 100: "T20, D20",      99:  "T19, 10, D16",
  98:  "T20, D19",       97:  "T19, D20",      96:  "T20, D18",      95:  "T19, D19",      94:  "T18, D20",
  93:  "T19, D18", 92: "T20, D16", 91: "T17, D20", 90: "T18, D18", 89: "T19, D16",
  88:  "T16, D20", 87: "T17, D18", 86: "T18, D16", 85: "T15, D20", 84: "T20, D12",
  83:  "T17, D16", 82: "T14, D20", 81: "T19, D12", 80: "T20, D10", 79: "T13, D20",
  78:  "T18, D12", 77: "T19, D10", 76: "T20, D8",  75: "T17, D12", 74: "T14, D16",
  73:  "T19, D8",  72: "T16, D12", 71: "T13, D16", 70: "T18, D8",  69: "T19, D6",
  68:  "T20, D4",  67: "T17, D8",  66: "T10, D18", 65: "25, D20",  64: "T16, D8",
  63: "T13, D12", 62: "T10, D16", 61: "T15, D8", 60: "20, D20", 59: "19, D20",
  58: "18, D20",  57: "17, D20",  56: "16, D20", 55: "15, D20", 54: "14, D20",
  53: "13, D20",  52: "12, D20",  51: "11, D20", 50: "10, D20", 49: "9, D20",
  48: "16, D16",  47: "15, D16",  46: "6, D20",  45: "13, D16", 44: "12, D16",
  43: "11, D16",  42: "10, D16",  41: "9, D16",  40: "D20", 39: "7, D16",
  38: "D19", 37: "5, D16", 36: "D18", 35: "3, D16", 34: "D17",
  33: "1, D16", 32: "D16", 31: "15, D8", 30: "D15", 29: "13, D8",
  28: "D14", 27: "11, D8", 26: "D13", 25: "9, D8", 24: "D12",
  23: "7, D8", 22: "D11", 21: "5, D8", 20: "D10", 19: "3, D8",
  18: "D9", 17: "1, D8", 16: "D8", 15: "7, D4", 14: "D7",
  13: "5, D4", 12: "D6", 11: "3, D4", 10: "D5", 9: "1, D4",
  8: "D4", 7: "3, D2", 6: "D3", 5: "1, D2", 4: "D2",
  3: "1, D1", 2: "D1" 
};

window.onload = function() { generateNumpad(); };

function generateNumpad() {
    const numpad = document.getElementById('numpad');
    numpad.innerHTML = '';
    for (let i = 1; i <= 20; i++) {
        numpad.innerHTML += `<button class="num-btn" onclick="throwDart(${i})">${i}</button>`;
    }
    numpad.innerHTML += `<button class="num-btn special-btn" onclick="throwDart(25)">25 (Bull)</button>`;
    numpad.innerHTML += `<button class="num-btn special-btn" onclick="throwDart(0)">0</button>`;
}

// 1. Lépés: Névmezők és sorrend állítás
let tempNames = [];
function generateNameInputs() {
    const count = document.getElementById('player-count').value;
    if (count < 1 || count > 10) return alert("Kérlek 1 és 10 közötti számot adj meg!");

    tempNames = Array.from({length: count}, (_, i) => `Játékos ${i + 1}`);
    renderNameInputs();

    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-2').classList.remove('hidden');
}

function renderNameInputs() {
    const container = document.getElementById('name-inputs');
    container.innerHTML = '';
    tempNames.forEach((name, index) => {
        container.innerHTML += `
            <div class="player-input-row">
                <input type="text" id="pname-${index}" value="${name}" onchange="updateTempName(${index}, this.value)">
                <button class="order-btn" onclick="movePlayer(${index}, -1)" ${index === 0 ? 'disabled' : ''}>↑</button>
                <button class="order-btn" onclick="movePlayer(${index}, 1)" ${index === tempNames.length - 1 ? 'disabled' : ''}>↓</button>
            </div>
        `;
    });
}

function updateTempName(index, val) { tempNames[index] = val; }

function movePlayer(index, direction) {
    // Kicseréljük a két elemet a tömbben
    const newIndex = index + direction;
    [tempNames[index], tempNames[newIndex]] = [tempNames[newIndex], tempNames[index]];
    renderNameInputs();
}

// 2. Lépés: Játék indítása
function startGame() {
    players = tempNames.map(name => ({
        name: name,
        score: STARTING_SCORE,
        turnStartScore: STARTING_SCORE,
        stats: { dartsThrown: 0, totalPoints: 0, highestTurn: 0, wins: 0 }
    }));

    matchStartingPlayerIndex = 0;
    startNewLeg();

    document.getElementById('step-2').classList.add('hidden');
    document.getElementById('step-3').classList.remove('hidden');
}

// Új meccs kezdése (Újratöltés nélkül)
function startNewLeg() {
    matchHistory = [];
    players.forEach(p => {
        p.score = STARTING_SCORE;
        p.turnStartScore = STARTING_SCORE;
    });
    currentPlayerIndex = matchStartingPlayerIndex;
    dartsThrownInTurn = 0;
    setMultiplier(1);
    updateScoreboard();
}

function setMultiplier(value) {
    currentMultiplier = value;
    document.querySelectorAll('.mod-btn').forEach(btn => btn.classList.remove('active'));
    if (value === 1) document.getElementById('btn-szimpla').classList.add('active');
    if (value === 2) document.getElementById('btn-dupla').classList.add('active');
    if (value === 3) document.getElementById('btn-tripla').classList.add('active');
}

// Kiszálló javaslat frissítése
function updateCheckoutSuggestion(score) {
    const box = document.getElementById('checkout-suggestion');
    const path = document.getElementById('checkout-path');
    
    // Alap kiszállók a szótárból
    if (checkouts[score]) {
        path.innerText = checkouts[score];
        box.classList.remove('hidden');
    } 
    // Egyszerű dupla kiszállók (pl 40 -> D20)
    else if (score <= 40 && score % 2 === 0) {
        path.innerText = `D${score / 2}`;
        box.classList.remove('hidden');
    } 
    else {
        box.classList.add('hidden');
    }
}

// 3. Lépés: Képernyő frissítése
function updateScoreboard() {
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = '';

    players.forEach((player, index) => {
        const isCurrent = index === currentPlayerIndex;
        let dartsHtml = '';

        if (isCurrent) {
            const dartsLeft = 3 - dartsThrownInTurn;
            for (let i = 0; i < dartsLeft; i++) {
                // A "dart.png" helyére írd a saját képed nevét, ha más kiterjesztésű!
                dartsHtml += `<img src="darts.jpg" class="dart-icon" alt="nyíl">`;
            }
        }

        scoreboard.innerHTML += `
            <li class="player-row ${isCurrent ? 'active-player' : ''}">
            
                <span>${player.name}</span>
                <div class="dart-container">${dartsHtml}</div>
                 
                <span class="score">${player.score}</span>
            </li>
        `;
    });

    document.getElementById('current-player-name').innerText = `${players[currentPlayerIndex].name} dob`;
    //document.getElementById('darts-left').innerText = 3 - dartsThrownInTurn;
    document.getElementById('error-message').innerText = '';
    document.getElementById('undo-btn').disabled = matchHistory.length === 0;

    updateCheckoutSuggestion(players[currentPlayerIndex].score);
    renderStats();
}

function renderStats() {
    const tbody = document.getElementById('stats-body');
    tbody.innerHTML = '';
    players.forEach(p => {
        const avg = p.stats.dartsThrown === 0 ? 0 : ((p.stats.totalPoints / p.stats.dartsThrown) * 3).toFixed(1);
        tbody.innerHTML += `
            <tr>
                <td>${p.name}</td>
                <td>${avg}</td>
                <td>${p.stats.highestTurn}</td>
                <td>${p.stats.wins}</td>
            </tr>
        `;
    });
}

// 4. Lépés: Dobás logikája
function throwDart(baseValue) {
    if (baseValue === 25 && currentMultiplier === 3) {
        document.getElementById('error-message').innerText = "Nincs tripla Bull!";
        return;
    }

    let player = players[currentPlayerIndex];
    let dartScore = baseValue === 0 ? 0 : baseValue * currentMultiplier;
    let newScore = player.score - dartScore;

    // Mély másolat a statisztika mentéséhez (Visszavonás miatt)
    let savedStats = JSON.parse(JSON.stringify(player.stats));

    matchHistory.push({
        playerIndex: currentPlayerIndex,
        scoreBeforeThrow: player.score,
        turnStartScore: player.turnStartScore,
        dartsThrownBefore: dartsThrownInTurn,
        statsBefore: savedStats
    });

    // Statisztika növelése
    player.stats.dartsThrown++;
    player.stats.totalPoints += dartScore;

    // Kiszálló szabály ellenőrzése (csak duplával vagy bullal lehet kiszállni)
    let isCheckoutDart = (currentMultiplier === 2 || (baseValue === 25 && currentMultiplier === 2));

    if (newScore < 0 || newScore === 1 || (newScore === 0 && !isCheckoutDart)) {
        // Besokallt
        document.getElementById('error-message').innerText = `${player.name} besokallt!`;
        
        // Statisztika korrekció: A pontokat visszavesszük, de a dobott nyilak száma marad
        player.stats.totalPoints -= (player.turnStartScore - newScore); 
        
        player.score = player.turnStartScore; 
        setTimeout(nextPlayer, 1500);
    } 
    else if (newScore === 0 && isCheckoutDart) {
        // Győzelem!
        player.score = 0;
        player.stats.wins++;
        updateTurnStats(player);
        updateScoreboard();
        
        setTimeout(() => {
            document.getElementById('darts-left').innerText = `${player.name} megnyerte a meccset!`;
            // Következő játékos kezdi a következő meccset
            matchStartingPlayerIndex = (matchStartingPlayerIndex + 1) % players.length;
            startNewLeg();
        }, 100);
        return;
    } 
    else {
        // Szabályos dobás
        player.score = newScore;
        dartsThrownInTurn++;

        if (dartsThrownInTurn === 3) {
            updateTurnStats(player);
            nextPlayer();
        } else {
            updateScoreboard();
        }
    }

    setMultiplier(1);
}

function updateTurnStats(player) {
    let turnScore = player.turnStartScore - player.score;
    if (turnScore > player.stats.highestTurn) {
        player.stats.highestTurn = turnScore;
    }
}

function nextPlayer() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    dartsThrownInTurn = 0;
    players[currentPlayerIndex].turnStartScore = players[currentPlayerIndex].score;
    updateScoreboard();
}

// 5. Lépés: Visszavonás
function undoThrow() {
    if (matchHistory.length === 0) return;

    const last = matchHistory.pop(); 
    currentPlayerIndex = last.playerIndex;
    dartsThrownInTurn = last.dartsThrownBefore;
    
    let player = players[currentPlayerIndex];
    player.score = last.scoreBeforeThrow;
    player.turnStartScore = last.turnStartScore;
    player.stats = last.statsBefore; // Statisztika visszaállítása

    setMultiplier(1);
    updateScoreboard();
    document.getElementById('error-message').innerText = "Visszavonva!";
}