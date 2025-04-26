$(document).ready(function() {
    console.log('Leaderboard initialisiert');

    // Event-Handler für NUI-Nachrichten
    window.addEventListener('message', function(event) {
        let data = event.data;

        if (data.type === 'leaderboardData') {
            updateLeaderboard(data.stats, data.playerInfo);
        }
    });

    // Sende eine Anfrage an das Server-Script, um Leaderboard-Daten zu erhalten
    $.post('https://' + GetParentResourceName() + '/getLeaderboardData');
});

/**
 * Aktualisiert das Leaderboard mit den empfangenen Daten
 * @param {Array} stats - Die Statistikdaten aller Spieler
 * @param {Object} playerInfo - Die Daten des aktuellen Spielers
 */
function updateLeaderboard(stats, playerInfo) {
    const leaderboardRows = $('#leaderboard-rows');
    const playerRankContainer = $('#player-rank-container');

    // Lösche vorhandene Einträge
    leaderboardRows.empty();
    
    // Überprüfe, ob Daten vorhanden sind
    if (!stats || stats.length === 0) {
        leaderboardRows.append(`
            <div class="leaderboard-row no-data">
                <div class="leaderboard-cell" style="width: 100%; text-align: center;">
                    <i class="fas fa-info-circle"></i> Keine Leaderboard-Daten verfügbar
                </div>
            </div>
        `);
        return;
    }

    // Sortiere die Statistiken nach den angegebenen Kriterien
    // Höheres Ranking für: höherer Verdienst, höhere Distanz, mehr Jobs
    // Höheres Ranking für: niedrigere Zeit, niedrigerer Schaden
    stats.sort((a, b) => {
        // Primär nach Verdienst sortieren (absteigend)
        if (a.earnings !== b.earnings) {
            return b.earnings - a.earnings;
        }
        // Sekundär nach Distanz sortieren (absteigend)
        if (a.distance !== b.distance) {
            return b.distance - a.distance;
        }
        // Tertiär nach Zeit sortieren (aufsteigend)
        if (a.time !== b.time) {
            return a.time - b.time;
        }
        // Quartär nach Schaden sortieren (aufsteigend)
        if (a.damage !== b.damage) {
            return a.damage - b.damage;
        }
        // Final nach Jobs sortieren (absteigend)
        return b.jobs - a.jobs;
    });

    // Finde die Position des Spielers im sortierten Array
    let playerRank = -1;
    if (playerInfo && playerInfo.player_id) {
        playerRank = stats.findIndex(stat => stat.player_id === playerInfo.player_id) + 1;
    }

    // Formatierungsfunktionen
    const formatMoney = value => {
        const num = parseFloat(value);
        if (num >= 1000000000) { // Milliarden
            return (num / 1000000000).toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' Mrd $';
        } else if (num >= 1000000) { // Millionen
            return (num / 1000000).toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' M $';
        } else if (num >= 1000) { // Tausend
            return (num / 1000).toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' k $';
        } else {
            return num.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' $';
        }
    };
    
    const formatDistance = value => parseFloat(value).toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' km';
    
    // Zeit als Sekunden aus der DB in Minuten und Sekunden umrechnen
    const formatTime = seconds => {
        // Umrechnung von Sekunden in Minuten und Sekunden
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}m ${secs}s`;
    };
    
    const formatDamage = value => Math.round(value) + '%';
    const formatJobs = value => Math.round(value);

    // Füge Spielerdaten ein
    stats.forEach((stat, index) => {
        const rank = index + 1;
        const isPlayer = playerInfo && stat.player_id === playerInfo.player_id;
        const placeClass = rank === 1 ? 'first-place' : rank === 2 ? 'second-place' : rank === 3 ? 'third-place' : '';
        const rankIcon = rank === 1 ? '<i class="fas fa-crown rank-icon"></i>' : 
                         rank === 2 ? '<i class="fas fa-medal rank-icon"></i>' : 
                         rank === 3 ? '<i class="fas fa-award rank-icon"></i>' : '';

        const row = `
            <div class="leaderboard-row ${placeClass} ${isPlayer ? 'player-row' : ''}">
                <div class="leaderboard-cell rank">
                    <div class="rank-badge ${isPlayer ? 'player-rank' : ''}">${rank}</div>
                </div>
                <div class="leaderboard-cell name">
                    <div class="player-info">
                        ${rankIcon}
                        <span class="player-name">${stat.name}</span>
                    </div>
                </div>
                <div class="leaderboard-cell earnings">
                    <div class="stat-value">${formatMoney(stat.earnings)}</div>
                </div>
                <div class="leaderboard-cell distance">
                    <div class="stat-value">${formatDistance(stat.distance)}</div>
                </div>
                <div class="leaderboard-cell time">
                    <div class="stat-value">${formatTime(stat.time)}</div>
                </div>
                <div class="leaderboard-cell damage">
                    <div class="stat-value">${formatDamage(stat.damage)}</div>
                </div>
                <div class="leaderboard-cell jobs">
                    <div class="stat-value">${formatJobs(stat.jobs)}</div>
                </div>
            </div>
        `;

        leaderboardRows.append(row);
    });

    // Aktualisiere die Spielerrangkarte
    if (playerInfo && playerRank > 0) {
        const playerData = stats[playerRank - 1];
        const playerRankRow = `
            <div class="leaderboard-row player-rank-row">
                <div class="leaderboard-cell rank">
                    <div class="rank-badge player-rank">${playerRank}</div>
                </div>
                <div class="leaderboard-cell name">
                    <div class="player-info">
                        <i class="fas fa-user rank-icon"></i>
                        <span class="player-name">${playerInfo.name}</span>
                    </div>
                </div>
                <div class="leaderboard-cell earnings">
                    <div class="stat-value">${formatMoney(playerData.earnings)}</div>
                </div>
                <div class="leaderboard-cell distance">
                    <div class="stat-value">${formatDistance(playerData.distance)}</div>
                </div>
                <div class="leaderboard-cell time">
                    <div class="stat-value">${formatTime(playerData.time)}</div>
                </div>
                <div class="leaderboard-cell damage">
                    <div class="stat-value">${formatDamage(playerData.damage)}</div>
                </div>
                <div class="leaderboard-cell jobs">
                    <div class="stat-value">${formatJobs(playerData.jobs)}</div>
                </div>
            </div>
        `;

        playerRankContainer.empty().append(playerRankRow);
    }
}
