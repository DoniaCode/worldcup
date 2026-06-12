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
    return "-";
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

    const matchCard = document.createElement("article");
    matchCard.className = "match-card";

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
      <div class="match-status">${getMatchStatusText(match)}</div>

      <div class="teams">
        <span>${match.homeTeam}</span>
        <strong>VS</strong>
        <span>${match.awayTeam}</span>
      </div>

      <div class="real-score">
        <span>Risultato reale</span>
        <strong>${getRealScoreText(match)}</strong>
      </div>

      <div class="predictions-list">
        <h4>Pronostici</h4>
        ${predictionsHTML}
      </div>
    `;

    matchesContainer.appendChild(matchCard);
  }
}

displayLeaderboard();
displayMatches();