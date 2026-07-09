function normalizeTeamName(name) {
  return String(name)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getMatchResult(homeScore, awayScore) {
  if (homeScore > awayScore) {
    return "HOME";
  }

  if (homeScore < awayScore) {
    return "AWAY";
  }

  return "DRAW";
}

function calculatePoints(predHomeScore, predAwayScore, realHomeScore, realAwayScore) {
  let points = 0;

  const predictedResult = getMatchResult(predHomeScore, predAwayScore);
  const realResult = getMatchResult(realHomeScore, realAwayScore);

  if (predictedResult === realResult) {
    points += 1;
  }

  if (predHomeScore === realHomeScore) {
    points += 1;
  }

  if (predAwayScore === realAwayScore) {
    points += 1;
  }

  return points;
}

let worldCupDataCache = null;

async function loadWorldCupData() {
  try {
    const response = await fetch("data/worldcup.json?v=" + Date.now()); //[cite: 5]

    if (!response.ok) {
      console.warn("Impossibile leggere data/worldcup.json"); //[cite: 5]
      return null;
    }

    const data = await response.json();
    worldCupDataCache = data;
    return data;
  } catch (error) {
    console.warn("Errore nel caricamento dei dati Mondiali:", error); //[cite: 5]
    return null;
  }
}
function calculateKnockoutPoints(player, data) {
  if (!data || !data.matches) return 0;
  if (!futurePredictions[player]) return 0;

  let points = 0;
  const preds = futurePredictions[player];

  const quarterFinalists = new Set();
  const semiFinalists = new Set();
  const finalists = new Set();

  data.matches.forEach(match => {
    if (match.round === "Quarter-final") {
      quarterFinalists.add(match.team1);
      quarterFinalists.add(match.team2);
    }
    if (match.round === "Semi-final") {
      semiFinalists.add(match.team1);
      semiFinalists.add(match.team2);
    }
    if (match.round === "Final") {
      finalists.add(match.team1);
      finalists.add(match.team2);
    }
  });

  preds.top5.forEach(team => {
    if (quarterFinalists.has(team)) points += 3;
    if (semiFinalists.has(team)) points += 5;
    if (finalists.has(team)) points += 8;
  });

  return points;
}

function updateScoresFromWorldCupData(worldCupData) {
  if (!worldCupData || !worldCupData.matches) {
    return;
  }

  for (const localMatch of scores) {
    const localHome = normalizeTeamName(localMatch.apiHomeTeam);
    const localAway = normalizeTeamName(localMatch.apiAwayTeam);

    const apiMatch = worldCupData.matches.find(match => {
      const apiTeam1 = normalizeTeamName(match.team1);
      const apiTeam2 = normalizeTeamName(match.team2);

      const sameOrder =
        apiTeam1 === localHome &&
        apiTeam2 === localAway;

      const reverseOrder =
        apiTeam1 === localAway &&
        apiTeam2 === localHome;

      return sameOrder || reverseOrder;
    });

    if (!apiMatch || !apiMatch.score || !Array.isArray(apiMatch.score.ft)) {
      continue;
    }

    const apiScore1 = apiMatch.score.ft[0];
    const apiScore2 = apiMatch.score.ft[1];

    if (typeof apiScore1 !== "number" || typeof apiScore2 !== "number") {
      continue;
    }

    const apiTeam1 = normalizeTeamName(apiMatch.team1);
    const apiTeam2 = normalizeTeamName(apiMatch.team2);

    const sameOrder =
      apiTeam1 === localHome &&
      apiTeam2 === localAway;

    const reverseOrder =
      apiTeam1 === localAway &&
      apiTeam2 === localHome;

    if (sameOrder) {
      localMatch.realHomeScore = apiScore1;
      localMatch.realAwayScore = apiScore2;
      localMatch.finished = true;
    }

    if (reverseOrder) {
      localMatch.realHomeScore = apiScore2;
      localMatch.realAwayScore = apiScore1;
      localMatch.finished = true;
    }
  }
}

function calculateLeaderboard() {
  const leaderboard = {};

  for (const prediction of predictions) {
    if (!leaderboard[prediction.player]) {
      leaderboard[prediction.player] = 0;
    }

    const match = scores.find(score => score.id === prediction.matchId);

    if (!match || !match.finished) {
      continue;
    }

    const points = calculatePoints(
      prediction.predHomeScore,
      prediction.predAwayScore,
      match.realHomeScore,
      match.realAwayScore
    );

    leaderboard[prediction.player] += points;
  }

  for (const player in leaderboard) {
    leaderboard[player] += calculateKnockoutPoints(player, worldCupDataCache);
  }

  return Object.entries(leaderboard)
    .map(([player, points]) => {
      return {
        player: player,
        points: points
      };
    })
    .sort((a, b) => b.points - a.points);
}

function displayLeaderboard() {
  const leaderboardBody = document.getElementById("leaderboard-body");
  const leaderboard = calculateLeaderboard();

  leaderboardBody.innerHTML = "";

  if (leaderboard.length === 0) {
    leaderboardBody.innerHTML = `
      <tr>
        <td data-label="Posizione">#</td>
        <td data-label="Giocatore">Nessun giocatore</td>
        <td data-label="Punti">0</td>
      </tr>
    `;

    return;
  }

  leaderboard.forEach((playerData, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td data-label="Posizione">#${index + 1}</td>
      <td data-label="Giocatore">${playerData.player}</td>
      <td data-label="Punti">${playerData.points}</td>
    `;

    leaderboardBody.appendChild(row);
  });
}

function getMatchStatusText(match) {
  if (match.finished) {
    return "Terminata";
  }

  return "Da giocare";
}

function getRealScoreText(match) {
  if (!match.finished) {
    return "VS";
  }

  return `${match.realHomeScore} - ${match.realAwayScore}`;
}

function displayMatches() {
  const matchesContainer = document.getElementById("matches-container");

  if (!matchesContainer) {
    return;
  }

  matchesContainer.innerHTML = "";

  const finishedMatches = scores.filter(match => match.finished);

  const sectionElement = document.createElement("div");
  sectionElement.className = "matches-row-section";

  const cardsHTML = finishedMatches.map(match => {
    const matchPredictions = predictions.filter(prediction => {
      return prediction.matchId === match.id;
    });

    const predictionsHTML = matchPredictions.map(prediction => {
      const points = calculatePoints(
        prediction.predHomeScore,
        prediction.predAwayScore,
        match.realHomeScore,
        match.realAwayScore
      );

      return `
        <div class="prediction-row">
          <span class="prediction-player">${prediction.player}</span>

          <span class="prediction-score">
            ${prediction.predHomeScore} - ${prediction.predAwayScore}
          </span>

          <span class="prediction-points">
            ${points} pt
          </span>
        </div>
      `;
    }).join("");

    return `
      <details class="match-card match-accordion horizontal-match-card">
        <summary class="match-summary">
          <div class="match-summary-top">
            <span class="match-status">Terminata</span>
            <span class="open-details">Apri</span>
          </div>

          <div class="compact-teams">
            <span>${match.homeTeam}</span>

            <strong>
              ${match.realHomeScore} - ${match.realAwayScore}
            </strong>

            <span>${match.awayTeam}</span>
          </div>
        </summary>

        <div class="match-details">
          <div class="real-score">
            <span>Risultato reale</span>

            <strong>
              ${match.realHomeScore} - ${match.realAwayScore}
            </strong>
          </div>

          <div class="predictions-list">
            <h4>Pronostici</h4>

            ${
              predictionsHTML ||
              `<p>Nessun pronostico disponibile.</p>`
            }
          </div>
        </div>
      </details>
    `;
  }).join("");

  sectionElement.innerHTML = `
    <div class="matches-row-header">
      <div>
        <h3>Partite terminate</h3>
        <p>Risultati conclusi con punti già calcolati</p>
      </div>

      <span>${finishedMatches.length}</span>
    </div>

    <div class="horizontal-matches-scroll">
      ${
        finishedMatches.length > 0
          ? cardsHTML
          : `
            <article class="empty-matches-card">
              Nessuna partita terminata disponibile.
            </article>
          `
      }
    </div>
  `;

  matchesContainer.appendChild(sectionElement);
}
function displayTop5() {
  const container = document.getElementById("top5-container");
  
  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (typeof futurePredictions === 'undefined') {
    console.error("Errore: futurePredictions non trovato. Controlla predictions.js");
    return;
  }

  for (const [player, preds] of Object.entries(futurePredictions)) {
    let totalPoints = 0;
    
    const teamsHTML = preds.top5.map(team => {
      let teamPoints = 0;
      
      if (worldCupDataCache && worldCupDataCache.matches) {
        worldCupDataCache.matches.forEach(match => {
          if (match.round === "Quarter-final" && (match.team1 === team || match.team2 === team)) {
            teamPoints += 3;
          }
          if (match.round === "Semi-final" && (match.team1 === team || match.team2 === team)) {
            teamPoints += 5;
          }
          if (match.round === "Final" && (match.team1 === team || match.team2 === team)) {
            teamPoints += 8;
          }
        });
      }
      
      totalPoints += teamPoints;
      
      return `
        <div class="prediction-row">
          <span class="prediction-player">${team}</span>
          <span class="prediction-points ${teamPoints === 0 ? 'pending' : ''}">
            ${teamPoints} pt
          </span>
        </div>
      `;
    }).join("");

    container.innerHTML += `
      <article class="match-card">
        <div class="match-status">${player}</div>

        <div class="teams">
          <span>Punti Bonus</span>
          <strong>${totalPoints} pt</strong>
        </div>

        <div class="predictions-list">
          <h4>Top 5 Scelta</h4>
          ${teamsHTML}
        </div>
      </article>
    `;
  }
}

async function initApp() {
  displayLeaderboard();
  displayMatches();
  displayTop5();

  const worldCupData = await loadWorldCupData();

  if (worldCupData) {
    updateScoresFromWorldCupData(worldCupData);
  }

  displayLeaderboard();
  displayMatches();
  displayTop5();
}

initApp();
function countryCodeToFlagEmoji(countryCode) {
  return countryCode
    .toUpperCase()
    .replace(/./g, char =>
      String.fromCodePoint(127397 + char.charCodeAt())
    );
}

const worldFlagCodes = [
  "AF", "AL", "DZ", "AD", "AO", "AG", "AR", "AM", "AU", "AT",
  "AZ", "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BT",
  "BO", "BA", "BW", "BR", "BN", "BG", "BF", "BI", "CV", "KH",
  "CM", "CA", "CF", "TD", "CL", "CN", "CO", "KM", "CG", "CD",
  "CR", "CI", "HR", "CU", "CY", "CZ", "DK", "DJ", "DM", "DO",
  "EC", "EG", "SV", "GQ", "ER", "EE", "SZ", "ET", "FJ", "FI",
  "FR", "GA", "GM", "GE", "DE", "GH", "GR", "GD", "GT", "GN",
  "GW", "GY", "HT", "HN", "HU", "IS", "IN", "ID", "IR", "IQ",
  "IE", "IL", "IT", "JM", "JP", "JO", "KZ", "KE", "KI", "KW",
  "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU",
  "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MR", "MU", "MX",
  "FM", "MD", "MC", "MN", "ME", "MA", "MZ", "MM", "NA", "NR",
  "NP", "NL", "NZ", "NI", "NE", "NG", "KP", "MK", "NO", "OM",
  "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PL", "PT",
  "QA", "RO", "RU", "RW", "KN", "LC", "VC", "WS", "SM", "ST",
  "SA", "SN", "RS", "SC", "SL", "SG", "SK", "SI", "SB", "SO",
  "ZA", "KR", "SS", "ES", "LK", "SD", "SR", "SE", "CH", "SY",
  "TW", "TJ", "TZ", "TH", "TL", "TG", "TO", "TT", "TN", "TR",
  "TM", "TV", "UG", "UA", "AE", "GB", "US", "UY", "UZ", "VU",
  "VA", "VE", "VN", "YE", "ZM", "ZW"
];

const countryNameFormatter = new Intl.DisplayNames(["it"], {
  type: "region"
});

const flagQuizCountries = worldFlagCodes
  .map(code => ({
    code,
    name: countryNameFormatter.of(code),
    flag: countryCodeToFlagEmoji(code)
  }))
  .filter(country => country.name);

const FLAG_QUIZ_TOTAL_QUESTIONS = 10;
const FLAG_QUIZ_MAX_LIVES = 3;
const FLAG_QUIZ_TIME_MS = 12000;
const FLAG_QUIZ_AUTO_NEXT_MS = 1050;

let selectedQuizPlayer = "";
let activeQuizPlayer = "";
let lastCompletedQuizPlayer = "";
let currentFlagQuestion = null;

let flagQuizScore = 0;
let correctAnswers = 0;
let currentStreak = 0;
let maxStreak = 0;
let remainingLives = FLAG_QUIZ_MAX_LIVES;

let hasAnsweredFlagQuestion = false;
let isFlagQuizActive = false;
let isFlagQuizFinished = false;

let flagQuizDb = null;
let usedFlagNames = [];
let currentQuestionNumber = 0;

let questionStartTime = 0;
let totalAnswerTime = 0;
let answeredQuestions = 0;

let quizTimerFrame = null;
const correctAnswerSound = new Audio("./assets/siuum.mp3");

correctAnswerSound.preload = "auto";
correctAnswerSound.volume = 0.9;

function playSiuumSound() {
  correctAnswerSound.pause();
  correctAnswerSound.currentTime = 0;

  correctAnswerSound.play().catch(error => {
    console.warn("Errore audio SIUUUM:", error);
  });
}
let quizNextTimeout = null;
let quizAudioContext = null;

function initFirebaseScoreboard() {
  if (
    typeof firebase === "undefined" ||
    typeof firebaseConfig === "undefined"
  ) {
    console.warn("Firebase non disponibile.");
    return;
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  flagQuizDb = firebase.firestore();
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function cleanPlayerName(name) {
  return String(name)
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 20);
}

function createSafePlayerId(name) {
  return cleanPlayerName(name)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getAverageTime() {
  if (answeredQuestions === 0) {
    return 0;
  }

  return Number(
    (totalAnswerTime / answeredQuestions).toFixed(1)
  );
}

function getComboMultiplier(streak = currentStreak) {
  if (streak >= 5) {
    return 2;
  }

  if (streak >= 3) {
    return 1.5;
  }

  if (streak >= 2) {
    return 1.25;
  }

  return 1;
}

function getSpeedBonus(answerTimeMs) {
  const remainingTime = Math.max(
    0,
    FLAG_QUIZ_TIME_MS - answerTimeMs
  );

  return Math.ceil(remainingTime / 1000) * 5;
}

function vibrateQuiz(pattern) {
  if ("vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

function getQuizAudioContext() {
  const AudioContextClass =
    window.AudioContext ||
    window.webkitAudioContext;

  if (!AudioContextClass) {
    return null;
  }

  if (!quizAudioContext) {
    quizAudioContext = new AudioContextClass();
  }

  return quizAudioContext;
}

function playQuizTone(type) {
  try {
    const context = getQuizAudioContext();

    if (!context) {
      return;
    }

    if (context.state === "suspended") {
      context.resume();
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();

    const frequencyByType = {
      start: 440,
      correct: 760,
      wrong: 180,
      finish: 620
    };

    oscillator.frequency.value =
      frequencyByType[type] || 440;

    oscillator.type =
      type === "wrong"
        ? "sawtooth"
        : "sine";

    gain.gain.setValueAtTime(
      0.05,
      context.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      context.currentTime + 0.18
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.18);
  } catch (error) {
    console.warn(
      "Audio quiz non disponibile:",
      error
    );
  }
}

function createQuizConfetti() {
  const stage = document.querySelector(".flag-stage");

  if (!stage) {
    return;
  }

  const symbols = ["✨", "⭐", "⚡"];

  for (let index = 0; index < 14; index++) {
    const particle = document.createElement("span");

    particle.className = "quiz-confetti";
    particle.textContent = getRandomItem(symbols);

    particle.style.left =
      `${15 + Math.random() * 70}%`;

    particle.style.setProperty(
      "--confetti-delay",
      `${Math.random() * 0.18}s`
    );

    particle.style.setProperty(
      "--confetti-drift",
      `${-45 + Math.random() * 90}px`
    );

    particle.style.setProperty(
      "--confetti-rotation",
      `${Math.random() * 360}deg`
    );

    stage.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 1100);
  }
}

function setPlayerButtonsDisabled(disabled) {
  document
    .querySelectorAll(".player-choice-button")
    .forEach(button => {
      button.disabled = disabled;
    });
}

function updateQuizHeader() {
  const playerDisplay = document.getElementById(
    "quiz-player-display"
  );

  const progressText = document.getElementById(
    "quiz-progress-text"
  );

  const quizScore = document.getElementById(
    "quiz-score"
  );

  const streakText = document.getElementById(
    "quiz-streak-text"
  );

  const livesText = document.getElementById(
    "quiz-lives-text"
  );

  const displayedPlayer = isFlagQuizActive
    ? activeQuizPlayer
    : selectedQuizPlayer;

  if (playerDisplay) {
    playerDisplay.textContent = displayedPlayer
      ? displayedPlayer
      : "Nessun giocatore";
  }

  if (progressText) {
    progressText.textContent = isFlagQuizFinished
      ? `Fine · ${currentQuestionNumber}/${FLAG_QUIZ_TOTAL_QUESTIONS}`
      : `${currentQuestionNumber}/${FLAG_QUIZ_TOTAL_QUESTIONS}`;
  }

  if (quizScore) {
    quizScore.textContent = `${flagQuizScore} pt`;
  }

  if (streakText) {
    streakText.textContent =
      `Combo ×${getComboMultiplier()}`;
  }

  if (livesText) {
    const fullHearts =
      "❤️".repeat(remainingLives);

    const emptyHearts =
      "🖤".repeat(
        FLAG_QUIZ_MAX_LIVES - remainingLives
      );

    livesText.textContent =
      `${fullHearts}${emptyHearts}`;
  }
}

function updateTimerVisual(remainingMs) {
  const timerText = document.getElementById(
    "quiz-timer-text"
  );

  const timerBar = document.getElementById(
    "quiz-timer-bar"
  );

  const safeRemaining = Math.max(0, remainingMs);

  const percentage = Math.max(
    0,
    Math.min(
      100,
      (safeRemaining / FLAG_QUIZ_TIME_MS) * 100
    )
  );

  if (timerText) {
    timerText.textContent =
      `${(safeRemaining / 1000).toFixed(1)}s`;
  }

  if (timerBar) {
    timerBar.style.width = `${percentage}%`;

    timerBar.classList.toggle(
      "danger",
      safeRemaining <= 3000
    );
  }
}

function stopQuestionTimer() {
  if (quizTimerFrame) {
    cancelAnimationFrame(quizTimerFrame);
    quizTimerFrame = null;
  }
}

function clearQuizNextTimeout() {
  if (quizNextTimeout) {
    clearTimeout(quizNextTimeout);
    quizNextTimeout = null;
  }
}

function startQuestionTimer() {
  stopQuestionTimer();

  questionStartTime = Date.now();

  updateTimerVisual(FLAG_QUIZ_TIME_MS);

  const tick = () => {
    if (
      !isFlagQuizActive ||
      hasAnsweredFlagQuestion
    ) {
      return;
    }

    const elapsed =
      Date.now() - questionStartTime;

    const remaining =
      FLAG_QUIZ_TIME_MS - elapsed;

    updateTimerVisual(remaining);

    if (remaining <= 0) {
      handleFlagQuizTimeout();
      return;
    }

    quizTimerFrame =
      requestAnimationFrame(tick);
  };

  quizTimerFrame =
    requestAnimationFrame(tick);
}

function setSelectedPlayer(playerName) {
  if (isFlagQuizActive) {
    return;
  }

  selectedQuizPlayer = playerName;

  localStorage.setItem(
    "flagQuizSelectedPlayer",
    selectedQuizPlayer
  );

  document
    .querySelectorAll(".player-choice-button")
    .forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.player ===
          selectedQuizPlayer
      );
    });

  const startButton = document.getElementById(
    "start-flag-button"
  );

  if (startButton) {
    startButton.disabled =
      !selectedQuizPlayer;
  }

  updateQuizHeader();
}

function createFlagQuestion() {
  let availableCountries =
    flagQuizCountries.filter(country => {
      return !usedFlagNames.includes(
        country.name
      );
    });

  if (availableCountries.length < 4) {
    usedFlagNames = [];
    availableCountries = [
      ...flagQuizCountries
    ];
  }

  const correctCountry =
    getRandomItem(availableCountries);

  usedFlagNames.push(correctCountry.name);

  const wrongCountries = shuffleArray(
    flagQuizCountries.filter(country => {
      return (
        country.name !== correctCountry.name
      );
    })
  ).slice(0, 3);

  return {
    correctCountry,
    options: shuffleArray([
      correctCountry,
      ...wrongCountries
    ])
  };
}

function showQuizReadyState() {
  const flagEmoji = document.getElementById(
    "flag-emoji"
  );

  const title = document.getElementById(
    "flag-question-title"
  );

  const options = document.getElementById(
    "flag-options"
  );

  const feedback = document.getElementById(
    "quiz-feedback"
  );

  const startButton = document.getElementById(
    "start-flag-button"
  );

  const saveButton = document.getElementById(
    "save-score-button"
  );

  if (flagEmoji) {
    flagEmoji.textContent = "🌍";
  }

  if (title) {
    title.textContent =
      "Scegli un giocatore";
  }

  if (options) {
    options.innerHTML = "";
  }

  if (feedback) {
    feedback.textContent =
      "10 bandiere · 3 vite · 12 secondi";

    feedback.className =
      "quiz-feedback";
  }

  if (startButton) {
    startButton.hidden = false;
    startButton.textContent =
      "Inizia partita";

    startButton.disabled =
      !selectedQuizPlayer;
  }

  if (saveButton) {
    saveButton.disabled = true;
  }

  remainingLives =
    FLAG_QUIZ_MAX_LIVES;

  flagQuizScore = 0;
  currentStreak = 0;
  currentQuestionNumber = 0;
  isFlagQuizFinished = false;

  updateTimerVisual(
    FLAG_QUIZ_TIME_MS
  );

  updateQuizHeader();
}

function startFlagQuizGame() {
  const feedback = document.getElementById(
    "quiz-feedback"
  );

  const startButton = document.getElementById(
    "start-flag-button"
  );

  const saveButton = document.getElementById(
    "save-score-button"
  );

  const saveMessage = document.getElementById(
    "save-score-message"
  );

  if (!selectedQuizPlayer) {
    if (feedback) {
      feedback.textContent =
        "Scegli prima Donia, Alessia o Hiba.";

      feedback.className =
        "quiz-feedback bad";
    }

    vibrateQuiz(100);
    return;
  }

  stopQuestionTimer();
  clearQuizNextTimeout();

  activeQuizPlayer =
    selectedQuizPlayer;

  lastCompletedQuizPlayer = "";

  flagQuizScore = 0;
  correctAnswers = 0;
  currentStreak = 0;
  maxStreak = 0;

  remainingLives =
    FLAG_QUIZ_MAX_LIVES;

  usedFlagNames = [];
  currentQuestionNumber = 0;

  totalAnswerTime = 0;
  answeredQuestions = 0;

  hasAnsweredFlagQuestion = false;
  isFlagQuizActive = true;
  isFlagQuizFinished = false;

  setPlayerButtonsDisabled(true);

  if (startButton) {
    startButton.hidden = true;
  }

  if (saveButton) {
    saveButton.disabled = true;
  }

  if (saveMessage) {
    saveMessage.textContent = "";
    saveMessage.className =
      "save-score-message";
  }

  playQuizTone("start");
  vibrateQuiz(35);

  displayFlagQuestion();
}

function displayFlagQuestion() {
  if (!isFlagQuizActive) {
    return;
  }

  if (
    currentQuestionNumber >=
      FLAG_QUIZ_TOTAL_QUESTIONS ||
    remainingLives <= 0
  ) {
    finishFlagQuizGame();
    return;
  }

  const flagEmoji = document.getElementById(
    "flag-emoji"
  );

  const flagOptions = document.getElementById(
    "flag-options"
  );

  const quizFeedback = document.getElementById(
    "quiz-feedback"
  );

  const title = document.getElementById(
    "flag-question-title"
  );

  if (
    !flagEmoji ||
    !flagOptions ||
    !quizFeedback ||
    !title
  ) {
    return;
  }

  currentQuestionNumber += 1;

  currentFlagQuestion =
    createFlagQuestion();

  hasAnsweredFlagQuestion = false;

  flagEmoji.classList.remove("flag-pop");

  void flagEmoji.offsetWidth;

  flagEmoji.classList.add("flag-pop");

  flagEmoji.textContent =
    currentFlagQuestion.correctCountry.flag;

  title.textContent = "Che paese è?";

  quizFeedback.textContent = "";
  quizFeedback.className =
    "quiz-feedback";

  flagOptions.innerHTML = "";

  currentFlagQuestion.options.forEach(
    option => {
      const button =
        document.createElement("button");

      button.className = "flag-option";
      button.type = "button";
      button.textContent = option.name;

      button.addEventListener(
        "click",
        () => {
          checkFlagAnswer(
            button,
            option.name
          );
        }
      );

      flagOptions.appendChild(button);
    }
  );

  updateQuizHeader();
  startQuestionTimer();
}

function disableAndRevealFlagOptions(
  selectedButton = null
) {
  const correctName =
    currentFlagQuestion
      .correctCountry
      .name;

  document
    .querySelectorAll(".flag-option")
    .forEach(optionButton => {
      optionButton.disabled = true;

      if (
        optionButton.textContent ===
        correctName
      ) {
        optionButton.classList.add(
          "correct"
        );
      }
    });

  if (
    selectedButton &&
    selectedButton.textContent !==
      correctName
  ) {
    selectedButton.classList.add("wrong");
  }
}

function scheduleNextFlagQuestion() {
  clearQuizNextTimeout();

  quizNextTimeout = setTimeout(() => {
    if (
      currentQuestionNumber >=
        FLAG_QUIZ_TOTAL_QUESTIONS ||
      remainingLives <= 0
    ) {
      finishFlagQuizGame();
      return;
    }

    displayFlagQuestion();
  }, FLAG_QUIZ_AUTO_NEXT_MS);
}

function checkFlagAnswer(
  button,
  selectedName
) {
  if (
    hasAnsweredFlagQuestion ||
    !isFlagQuizActive
  ) {
    return;
  }

  hasAnsweredFlagQuestion = true;

  stopQuestionTimer();

  const elapsedMs = Math.min(
    FLAG_QUIZ_TIME_MS,
    Date.now() - questionStartTime
  );

  totalAnswerTime += elapsedMs / 1000;
  answeredQuestions += 1;

  const quizFeedback =
    document.getElementById(
      "quiz-feedback"
    );

  const correctName =
    currentFlagQuestion
      .correctCountry
      .name;

  disableAndRevealFlagOptions(button);

  if (selectedName === correctName) {
    currentStreak += 1;
    correctAnswers += 1;

    maxStreak = Math.max(
      maxStreak,
      currentStreak
    );

    const speedBonus =
      getSpeedBonus(elapsedMs);

    const multiplier =
      getComboMultiplier(currentStreak);

    const pointsWon = Math.round(
      (100 + speedBonus) * multiplier
    );

    flagQuizScore += pointsWon;

    if (quizFeedback) {
      quizFeedback.textContent =
        `Esatto! +${pointsWon} · combo ×${multiplier}`;

      quizFeedback.className =
        "quiz-feedback good";
    }
    

    createQuizConfetti();
    playSiuumSound();
    vibrateQuiz([25, 40, 25]);
  } else {
    remainingLives -= 1;
    currentStreak = 0;

    if (quizFeedback) {
      quizFeedback.textContent =
        `No! Era ${correctName}`;

      quizFeedback.className =
        "quiz-feedback bad";
    }

    playQuizTone("wrong");

    vibrateQuiz([
      100,
      45,
      100
    ]);
  }

  updateQuizHeader();
  scheduleNextFlagQuestion();
}

function handleFlagQuizTimeout() {
  if (
    hasAnsweredFlagQuestion ||
    !isFlagQuizActive
  ) {
    return;
  }

  hasAnsweredFlagQuestion = true;

  stopQuestionTimer();

  remainingLives -= 1;
  currentStreak = 0;

  totalAnswerTime +=
    FLAG_QUIZ_TIME_MS / 1000;

  answeredQuestions += 1;

  disableAndRevealFlagOptions();

  const quizFeedback =
    document.getElementById(
      "quiz-feedback"
    );

  if (quizFeedback) {
    quizFeedback.textContent =
      `Tempo scaduto! Era ${currentFlagQuestion.correctCountry.name}`;

    quizFeedback.className =
      "quiz-feedback bad";
  }

  playQuizTone("wrong");

  vibrateQuiz([
    140,
    60,
    140
  ]);

  updateQuizHeader();
  scheduleNextFlagQuestion();
}

function finishFlagQuizGame() {
  stopQuestionTimer();
  clearQuizNextTimeout();

  isFlagQuizActive = false;
  isFlagQuizFinished = true;

  lastCompletedQuizPlayer =
    activeQuizPlayer;

  const flagEmoji = document.getElementById(
    "flag-emoji"
  );

  const flagOptions = document.getElementById(
    "flag-options"
  );

  const quizFeedback =
    document.getElementById(
      "quiz-feedback"
    );

  const title = document.getElementById(
    "flag-question-title"
  );

  const startButton =
    document.getElementById(
      "start-flag-button"
    );

  const saveButton =
    document.getElementById(
      "save-score-button"
    );

  if (flagEmoji) {
    flagEmoji.textContent =
      remainingLives > 0
        ? "🏆"
        : "💥";
  }

  if (flagOptions) {
    flagOptions.innerHTML = "";
  }

  if (title) {
    title.textContent =
      remainingLives > 0
        ? "Partita completata!"
        : "Vite finite!";
  }

  if (quizFeedback) {
    quizFeedback.textContent =
      `${correctAnswers}/${currentQuestionNumber} corrette · ${flagQuizScore} punti · media ${getAverageTime()}s`;

    quizFeedback.className =
      "quiz-feedback good";
  }

  if (startButton) {
    startButton.hidden = false;
    startButton.disabled = false;
    startButton.textContent =
      "Gioca ancora";
  }

  if (saveButton) {
    saveButton.disabled = false;
  }

  setPlayerButtonsDisabled(false);

  updateTimerVisual(0);
  updateQuizHeader();

  playQuizTone("finish");

  vibrateQuiz([
    40,
    50,
    40
  ]);
}

async function saveFlagQuizScore() {
  const saveButton =
    document.getElementById(
      "save-score-button"
    );

  const message =
    document.getElementById(
      "save-score-message"
    );

  if (!saveButton || !message) {
    return;
  }

  const playerName = cleanPlayerName(
    lastCompletedQuizPlayer
  );

  const playerId =
    createSafePlayerId(playerName);

  message.className =
    "save-score-message";

  if (
    !isFlagQuizFinished ||
    !playerName ||
    !playerId
  ) {
    message.textContent =
      "Completa prima una partita.";

    message.classList.add("bad");
    return;
  }

  if (!flagQuizDb) {
    message.textContent =
      "Firebase non è collegato.";

    message.classList.add("bad");
    return;
  }

  saveButton.disabled = true;
  message.textContent = "Salvataggio...";

  try {
    const scoreRef = flagQuizDb
      .collection("flagQuizScores")
      .doc(playerId);

    const oldDoc = await scoreRef.get();

    if (oldDoc.exists) {
      const oldScore =
        oldDoc.data().score || 0;

      if (flagQuizScore <= oldScore) {
        message.textContent =
          `${playerName} ha già un record di ${oldScore} punti.`;

        message.classList.add("good");
        saveButton.disabled = false;

        return;
      }
    }

    await scoreRef.set({
      player: playerName,
      score: flagQuizScore,
      correct: correctAnswers,
      questionsPlayed:
        currentQuestionNumber,
      totalQuestions:
        FLAG_QUIZ_TOTAL_QUESTIONS,
      averageTime: getAverageTime(),
      maxStreak,
      livesLeft: remainingLives,
      game: "flag-quiz",
      updatedAt:
        firebase.firestore
          .FieldValue
          .serverTimestamp()
    });

    message.textContent =
      "Nuovo record salvato!";

    message.classList.add("good");

    loadFlagQuizScoreboard();
  } catch (error) {
    console.error(
      "Errore salvataggio punteggio:",
      error
    );

    message.textContent =
      "Errore nel salvataggio.";

    message.classList.add("bad");
  }

  saveButton.disabled = false;
}

async function loadFlagQuizScoreboard() {
  const list = document.getElementById(
    "flag-scoreboard-list"
  );

  if (!list) {
    return;
  }

  if (!flagQuizDb) {
    list.innerHTML = `
      <p class="scoreboard-empty">
        Firebase non collegato.
      </p>
    `;

    return;
  }

  list.innerHTML = `
    <p class="scoreboard-empty">
      Caricamento classifica...
    </p>
  `;

  try {
    const snapshot = await flagQuizDb
      .collection("flagQuizScores")
      .where("game", "==", "flag-quiz")
      .orderBy("score", "desc")
      .limit(10)
      .get();

    if (snapshot.empty) {
      list.innerHTML = `
        <p class="scoreboard-empty">
          Ancora nessun punteggio salvato.
        </p>
      `;

      return;
    }

    list.innerHTML = "";

    let position = 1;

    snapshot.forEach(doc => {
      const data = doc.data();

      const row =
        document.createElement("div");

      row.className = "scoreboard-row";

      const questionsPlayed =
        data.questionsPlayed ||
        data.totalQuestions ||
        FLAG_QUIZ_TOTAL_QUESTIONS;

      row.innerHTML = `
        <span class="scoreboard-position">
          #${position}
        </span>

        <span class="scoreboard-player-info">
          <span class="scoreboard-name">
            ${data.player}
          </span>

          <span class="scoreboard-details">
            ${data.correct || 0}/${questionsPlayed}
            · media ${data.averageTime || 0}s
            · combo ${data.maxStreak || 0}
          </span>
        </span>

        <span class="scoreboard-score">
          ${data.score} pt
        </span>
      `;

      list.appendChild(row);

      position += 1;
    });
  } catch (error) {
    console.error(
      "Errore caricamento scoreboard:",
      error
    );

    list.innerHTML = `
      <p class="scoreboard-empty">
        Errore caricamento classifica.
      </p>
    `;
  }
}

function initPlayerButtons() {
  const savedPlayer = localStorage.getItem(
    "flagQuizSelectedPlayer"
  );

  document
    .querySelectorAll(".player-choice-button")
    .forEach(button => {
      button.addEventListener(
        "click",
        () => {
          setSelectedPlayer(
            button.dataset.player
          );
        }
      );
    });

  if (savedPlayer) {
    setSelectedPlayer(savedPlayer);
  } else {
    updateQuizHeader();
  }
}

function initFlagQuiz() {
  const startButton =
    document.getElementById(
      "start-flag-button"
    );

  const saveButton =
    document.getElementById(
      "save-score-button"
    );

  if (!startButton || !saveButton) {
    return;
  }

  initPlayerButtons();

  startButton.addEventListener(
    "click",
    startFlagQuizGame
  );

  saveButton.addEventListener(
    "click",
    saveFlagQuizScore
  );

  showQuizReadyState();
  loadFlagQuizScoreboard();
}

initFirebaseScoreboard();
initFlagQuiz();

