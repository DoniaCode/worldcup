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