let players = [];
let currentPlayerIndex = 0;
let matchHistory = []; 
let currentMultiplier = 1;
let dartsThrownInTurn = 0;
const STARTING_SCORE = 501;

// Inicializálás betöltéskor
window.onload = function() {
    generateNumpad();
};

// --- Numpad (gombok) generálása ---
function generateNumpad() {
    const numpad = document.getElementById('numpad');
    numpad.innerHTML = '';
    
    // 1-20 gombok
    for (let i = 1; i <= 20; i++) {
        numpad.innerHTML += `<button class="num-btn" onclick="throwDart(${i})">${i}</button>`;
    }
    
    // Különleges gombok (Bull és Mellé)
    numpad.innerHTML += `<button class="num-btn special-btn" onclick="throwDart(25)">25 (Bull)</button>`;
    numpad.innerHTML += `<button class="num-btn special-btn" onclick="throwDart(0)">0 (Mellé)</button>`;
}

// 1. Lépés: Névmezők
function generateNameInputs() {
    const count = document.getElementById('player-count').value;
    if (count < 1 || count > 10) return alert("Kérlek 1 és 10 közötti számot adj meg!");

    const nameInputsDiv = document.getElementById('name-inputs');
    nameInputsDiv.innerHTML = ''; 

    for (let i = 0; i < count; i++) {
        nameInputsDiv.innerHTML += `<input type="text" id="player-name-${i}" placeholder="${i + 1}. Játékos neve" value="Játékos ${i + 1}">`;
    }

    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-2').classList.remove('hidden');
}

// 2. Lépés: Játék indítása
function startGame() {
    const count = document.getElementById('player-count').value;
    players = [];
    matchHistory = []; 

    for (let i = 0; i < count; i++) {
        const name = document.getElementById(`player-name-${i}`).value || `Játékos ${i + 1}`;
        // turnStartScore: itt tároljuk a pontot, ha besokallna és vissza kéne állítani
        players.push({ name: name, score: STARTING_SCORE, turnStartScore: STARTING_SCORE });
    }

    currentPlayerIndex = 0;
    dartsThrownInTurn = 0;
    document.getElementById('step-2').classList.add('hidden');
    document.getElementById('step-3').classList.remove('hidden');
    
    setMultiplier(1);
    updateScoreboard();
}

// --- Szorzó beállítása (Szimpla, Dupla, Tripla) ---
function setMultiplier(value) {
    currentMultiplier = value;
    document.getElementById('btn-szimpla').classList.remove('active');
    document.getElementById('btn-dupla').classList.remove('active');
    document.getElementById('btn-tripla').classList.remove('active');

    if (value === 1) document.getElementById('btn-szimpla').classList.add('active');
    if (value === 2) document.getElementById('btn-dupla').classList.add('active');
    if (value === 3) document.getElementById('btn-tripla').classList.add('active');
}

// 3. Lépés: Képernyő frissítése
function updateScoreboard() {
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = '';

    players.forEach((player, index) => {
        const isCurrent = index === currentPlayerIndex;
        scoreboard.innerHTML += `
            <li class="player-row ${isCurrent ? 'active-player' : ''}">
                <span>${player.name}</span>
                <span class="score">${player.score}</span>
            </li>
        `;
    });

    document.getElementById('current-player-name').innerText = `${players[currentPlayerIndex].name} dob`;
    document.getElementById('darts-left').innerText = 3 - dartsThrownInTurn;
    document.getElementById('error-message').innerText = '';
    
    document.getElementById('undo-btn').disabled = matchHistory.length === 0;
}

// 4. Lépés: Egy nyíl eldobásának logikája
function throwDart(baseValue) {
    // Tripla Bull nem létezik
    if (baseValue === 25 && currentMultiplier === 3) {
        document.getElementById('error-message').innerText = "Nincs tripla Bull!";
        return;
    }

    let player = players[currentPlayerIndex];
    let dartScore = baseValue * currentMultiplier;
    
    // Ha mellé dobott, az mindig 0
    if (baseValue === 0) dartScore = 0; 

    let newScore = player.score - dartScore;

    // Állapot mentése a visszavonáshoz (mielőtt bármit módosítunk)
    matchHistory.push({
        playerIndex: currentPlayerIndex,
        scoreBeforeThrow: player.score,
        turnStartScore: player.turnStartScore,
        dartsThrownBefore: dartsThrownInTurn
    });

    // Besokallás vizsgálata (Bust)
    if (newScore < 0 || newScore === 1) {
        document.getElementById('error-message').innerText = `${player.name} besokallt!`;
        player.score = player.turnStartScore; // Visszaáll a kör eleji pontjára
        setTimeout(nextPlayer, 1500); // Vár egy picit, hogy látszódjon az üzenet, majd vált
    } 
    // Győzelem
    else if (newScore === 0) {
        player.score = 0;
        updateScoreboard();
        setTimeout(() => {
            alert(`🎉 Gratulálok! ${player.name} megnyerte a játékot! 🎉`);
            location.reload(); 
        }, 100);
        return;
    } 
    // Szabályos dobás
    else {
        player.score = newScore;
        dartsThrownInTurn++;

        if (dartsThrownInTurn === 3) {
            nextPlayer(); // Kör vége, következő jön
        } else {
            updateScoreboard(); // Még van nyila, frissítjük a kijelzőt
        }
    }

    // A dobás után a szorzó automatikusan visszaugrik Szimplára (kényelmi funkció)
    setMultiplier(1);
}

// --- Következő játékosra váltás ---
function nextPlayer() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    dartsThrownInTurn = 0;
    // Az új játékos kör eleji pontszámának elmentése
    players[currentPlayerIndex].turnStartScore = players[currentPlayerIndex].score;
    updateScoreboard();
}

// 5. Lépés: Visszavonás (Nyilanként)
function undoThrow() {
    if (matchHistory.length === 0) return;

    const lastAction = matchHistory.pop(); 
    
    currentPlayerIndex = lastAction.playerIndex;
    dartsThrownInTurn = lastAction.dartsThrownBefore;
    
    let player = players[currentPlayerIndex];
    player.score = lastAction.scoreBeforeThrow;
    player.turnStartScore = lastAction.turnStartScore;

    setMultiplier(1);
    updateScoreboard();
    document.getElementById('error-message').innerText = "Visszavonva!";
}