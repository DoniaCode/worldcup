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

async function loadWorldCupData() {
  try {
    const response = await fetch("data/worldcup.json?v=" + Date.now());

    if (!response.ok) {
      console.warn("Impossibile leggere data/worldcup.json");
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn("Errore nel caricamento dei dati Mondiali:", error);
    return null;
  }
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

  matchesContainer.innerHTML = "";

  for (const match of scores) {
    const matchPredictions = predictions.filter(prediction => {
      return prediction.matchId === match.id;
    });

    const matchCard = document.createElement("details");
    matchCard.className = "match-card match-accordion";

    const predictionsHTML = matchPredictions.map(prediction => {
      let pointsText = "";

      if (match.finished) {
        const points = calculatePoints(
          prediction.predHomeScore,
          prediction.predAwayScore,
          match.realHomeScore,
          match.realAwayScore
        );

        pointsText = `<span class="prediction-points">${points} pt</span>`;
      } else {
        pointsText = `<span class="prediction-points pending">in attesa</span>`;
      }

      return `
        <div class="prediction-row">
          <span class="prediction-player">${prediction.player}</span>
          <span class="prediction-score">${prediction.predHomeScore} - ${prediction.predAwayScore}</span>
          ${pointsText}
        </div>
      `;
    }).join("");

    matchCard.innerHTML = `
      <summary class="match-summary">
        <div class="match-summary-top">
          <span class="match-status">${getMatchStatusText(match)}</span>
          <span class="open-details">Tocca</span>
        </div>

        <div class="compact-teams">
          <span>${match.homeTeam}</span>
          <strong>${getRealScoreText(match)}</strong>
          <span>${match.awayTeam}</span>
        </div>
      </summary>

      <div class="match-details">
        <div class="real-score">
          <span>Risultato reale</span>
          <strong>${match.finished ? `${match.realHomeScore} - ${match.realAwayScore}` : "-"}</strong>
        </div>

        <div class="predictions-list">
          <h4>Pronostici</h4>
          ${predictionsHTML}
        </div>
      </div>
    `;

    matchesContainer.appendChild(matchCard);
  }
}

async function initApp() {
  displayLeaderboard();
  displayMatches();

  const worldCupData = await loadWorldCupData();

  if (worldCupData) {
    updateScoresFromWorldCupData(worldCupData);
  }

  displayLeaderboard();
  displayMatches();
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

const flagQuizCountries = [
  ...worldFlagCodes.map(code => {
    return {
      name: countryNameFormatter.of(code),
      flag: countryCodeToFlagEmoji(code)
    };
  }),
  { name: "Inghilterra", flag: "🏴" },
  { name: "Scozia", flag: "🏴" },
  { name: "Galles", flag: "🏴" }
];

const FLAG_QUIZ_TOTAL_QUESTIONS = 10;

let selectedQuizPlayer = "";
let currentFlagQuestion = null;
let flagQuizScore = 0;
let hasAnsweredFlagQuestion = false;
let flagQuizDb = null;
let usedFlagNames = [];
let currentQuestionNumber = 0;

function initFirebaseScoreboard() {
  if (typeof firebase === "undefined" || typeof firebaseConfig === "undefined") {
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

function updateQuizHeader() {
  const playerDisplay = document.getElementById("quiz-player-display");
  const progressText = document.getElementById("quiz-progress-text");
  const quizScore = document.getElementById("quiz-score");

  if (playerDisplay) {
    playerDisplay.textContent = selectedQuizPlayer
      ? `Giocatore: ${selectedQuizPlayer}`
      : "Giocatore: nessuno";
  }

  if (progressText) {
    progressText.textContent = `Domanda ${currentQuestionNumber}/${FLAG_QUIZ_TOTAL_QUESTIONS}`;
  }

  if (quizScore) {
    quizScore.textContent = `Punteggio: ${flagQuizScore}`;
  }
}

function setSelectedPlayer(playerName) {
  selectedQuizPlayer = playerName;
  localStorage.setItem("flagQuizSelectedPlayer", selectedQuizPlayer);

  const playerButtons = document.querySelectorAll(".player-choice-button");

  playerButtons.forEach(button => {
    if (button.dataset.player === selectedQuizPlayer) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  updateQuizHeader();
}

function resetFlagQuizGame() {
  flagQuizScore = 0;
  usedFlagNames = [];
  currentQuestionNumber = 0;
  hasAnsweredFlagQuestion = false;

  const saveMessage = document.getElementById("save-score-message");

  if (saveMessage) {
    saveMessage.textContent = "";
    saveMessage.className = "save-score-message";
  }

  displayFlagQuestion();
}

function createFlagQuestion() {
  const availableCountries = flagQuizCountries.filter(country => {
    return !usedFlagNames.includes(country.name);
  });

  if (availableCountries.length === 0) {
    usedFlagNames = [];
    return createFlagQuestion();
  }

  const correctCountry = getRandomItem(availableCountries);
  usedFlagNames.push(correctCountry.name);

  const wrongCountries = shuffleArray(
    flagQuizCountries.filter(country => country.name !== correctCountry.name)
  ).slice(0, 3);

  const options = shuffleArray([correctCountry, ...wrongCountries]);

  return {
    correctCountry: correctCountry,
    options: options
  };
}

function displayFlagQuestion() {
  const flagEmoji = document.getElementById("flag-emoji");
  const flagOptions = document.getElementById("flag-options");
  const quizFeedback = document.getElementById("quiz-feedback");
  const nextButton = document.getElementById("next-flag-button");
  const saveButton = document.getElementById("save-score-button");

  if (!flagEmoji || !flagOptions || !quizFeedback) {
    return;
  }

  if (currentQuestionNumber >= FLAG_QUIZ_TOTAL_QUESTIONS) {
    flagEmoji.textContent = "🏆";
    flagOptions.innerHTML = "";
    quizFeedback.textContent = `Partita finita! Hai fatto ${flagQuizScore}/${FLAG_QUIZ_TOTAL_QUESTIONS}.`;
    quizFeedback.className = "quiz-feedback good";

    if (nextButton) {
      nextButton.textContent = "Nuova partita";
    }

    if (saveButton) {
      saveButton.disabled = false;
    }

    updateQuizHeader();
    return;
  }

  currentQuestionNumber += 1;
  currentFlagQuestion = createFlagQuestion();
  hasAnsweredFlagQuestion = false;

  flagEmoji.textContent = currentFlagQuestion.correctCountry.flag;
  quizFeedback.textContent = "";
  quizFeedback.className = "quiz-feedback";

  if (nextButton) {
    nextButton.textContent = "Prossima";
  }

  if (saveButton) {
    saveButton.disabled = true;
  }

  flagOptions.innerHTML = "";

  currentFlagQuestion.options.forEach(option => {
    const button = document.createElement("button");
    button.className = "flag-option";
    button.textContent = option.name;

    button.addEventListener("click", () => {
      checkFlagAnswer(button, option.name);
    });

    flagOptions.appendChild(button);
  });

  updateQuizHeader();
}

function checkFlagAnswer(button, selectedName) {
  if (hasAnsweredFlagQuestion) {
    return;
  }

  hasAnsweredFlagQuestion = true;

  const quizFeedback = document.getElementById("quiz-feedback");
  const allButtons = document.querySelectorAll(".flag-option");

  const correctName = currentFlagQuestion.correctCountry.name;

  allButtons.forEach(optionButton => {
    optionButton.disabled = true;

    if (optionButton.textContent === correctName) {
      optionButton.classList.add("correct");
    }
  });

  if (selectedName === correctName) {
    flagQuizScore += 1;
    button.classList.add("correct");
    quizFeedback.textContent = "Esatto! +1 punto";
    quizFeedback.className = "quiz-feedback good";
  } else {
    button.classList.add("wrong");
    quizFeedback.textContent = `Sbagliato! Era ${correctName}`;
    quizFeedback.className = "quiz-feedback bad";
  }

  updateQuizHeader();
}

async function saveFlagQuizScore() {
  const saveButton = document.getElementById("save-score-button");
  const message = document.getElementById("save-score-message");

  if (!saveButton || !message) {
    return;
  }

  const playerName = cleanPlayerName(selectedQuizPlayer);
  const playerId = createSafePlayerId(playerName);

  message.className = "save-score-message";

  if (!playerName || !playerId) {
    message.textContent = "Scegli prima Donia, Alessia o Hiba.";
    message.classList.add("bad");
    return;
  }

  if (currentQuestionNumber < FLAG_QUIZ_TOTAL_QUESTIONS) {
    message.textContent = "Finisci prima le 10 domande.";
    message.classList.add("bad");
    return;
  }

  if (!flagQuizDb) {
    message.textContent = "Firebase non è collegato.";
    message.classList.add("bad");
    return;
  }

  saveButton.disabled = true;
  message.textContent = "Salvataggio...";

  try {
    const scoreRef = flagQuizDb.collection("flagQuizScores").doc(playerId);
    const oldDoc = await scoreRef.get();

    if (oldDoc.exists) {
      const oldScore = oldDoc.data().score || 0;

      if (flagQuizScore <= oldScore) {
        message.textContent = `${playerName} ha già un record di ${oldScore} punti.`;
        message.classList.add("good");
        saveButton.disabled = false;
        return;
      }
    }

    await scoreRef.set({
      player: playerName,
      score: flagQuizScore,
      game: "flag-quiz",
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    message.textContent = "Punteggio salvato!";
    message.classList.add("good");

    loadFlagQuizScoreboard();
  } catch (error) {
    console.error("Errore salvataggio punteggio:", error);
    message.textContent = "Errore nel salvataggio.";
    message.classList.add("bad");
  }

  saveButton.disabled = false;
}

async function loadFlagQuizScoreboard() {
  const list = document.getElementById("flag-scoreboard-list");

  if (!list) {
    return;
  }

  if (!flagQuizDb) {
    list.innerHTML = `<p class="scoreboard-empty">Firebase non collegato.</p>`;
    return;
  }

  list.innerHTML = `<p class="scoreboard-empty">Caricamento classifica...</p>`;

  try {
    const snapshot = await flagQuizDb
      .collection("flagQuizScores")
      .where("game", "==", "flag-quiz")
      .orderBy("score", "desc")
      .limit(10)
      .get();

    if (snapshot.empty) {
      list.innerHTML = `<p class="scoreboard-empty">Ancora nessun punteggio salvato.</p>`;
      return;
    }

    list.innerHTML = "";

    let position = 1;

    snapshot.forEach(doc => {
      const data = doc.data();

      const row = document.createElement("div");
      row.className = "scoreboard-row";

      row.innerHTML = `
        <span class="scoreboard-position">#${position}</span>
        <span class="scoreboard-name">${data.player}</span>
        <span class="scoreboard-score">${data.score}</span>
      `;

      list.appendChild(row);
      position++;
    });
  } catch (error) {
    console.error("Errore caricamento scoreboard:", error);
    list.innerHTML = `<p class="scoreboard-empty">Errore caricamento classifica.</p>`;
  }
}

function initPlayerButtons() {
  const playerButtons = document.querySelectorAll(".player-choice-button");
  const savedPlayer = localStorage.getItem("flagQuizSelectedPlayer");

  playerButtons.forEach(button => {
    button.addEventListener("click", () => {
      setSelectedPlayer(button.dataset.player);
    });
  });

  if (savedPlayer) {
    setSelectedPlayer(savedPlayer);
  } else {
    updateQuizHeader();
  }
}

function initFlagQuiz() {
  const nextButton = document.getElementById("next-flag-button");
  const saveButton = document.getElementById("save-score-button");

  if (!nextButton || !saveButton) {
    return;
  }

  initPlayerButtons();

  nextButton.addEventListener("click", () => {
    if (currentQuestionNumber >= FLAG_QUIZ_TOTAL_QUESTIONS) {
      resetFlagQuizGame();
      return;
    }

    displayFlagQuestion();
  });

  saveButton.addEventListener("click", saveFlagQuizScore);

  saveButton.disabled = true;

  displayFlagQuestion();
  loadFlagQuizScoreboard();
}

initFirebaseScoreboard();
initFlagQuiz();