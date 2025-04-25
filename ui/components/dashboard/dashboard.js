$(document).ready(function() {
    // Job-Row Hover-Effekt
    $('.job-row').hover(function() {
        $(this).css('background-color', 'rgba(255, 255, 255, 0.05)');
    }, function() {
        $(this).css('background-color', '');
    });

    // Event-Listener für NUI-Nachrichten
    window.addEventListener('message', (event) => {
        const data = event.data;
        
        // Verarbeite die spezifischen Trucker-Daten
        if (data.type === 'truckerData') {
            updateDashboardStats(data);
        }
    });
});

/**
 * Formatiert große Zahlen in ein kompaktes Format mit Einheiten (k, M, Mrd)
 * @param {number} num - Die zu formatierende Zahl
 * @returns {string} Die formatierte Zahl mit Einheit
 */
function formatLargeNumber(num) {
    // Sicherstellen, dass die Eingabe eine Zahl ist
    num = Number(num);
    
    // Für Milliarden (ab 1.000.000.000)
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'Mrd';
    }
    // Für Millionen (ab 1.000.000)
    else if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    // Für Tausende (ab 1.000)
    else if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    // Für kleine Zahlen (unter 1.000)
    else {
        return num.toString();
    }
}

function updateDashboardStats(data) {
    console.log('Empfangene Dashboard-Daten:', data);
    
    // Verdienst (Belohnung) aktualisieren
    if (data.earnings !== undefined) {
        // Formatiere die Zahl kompakt mit k, M, Mrd
        const earnings = parseInt(data.earnings);
        let formattedEarnings = formatLargeNumber(earnings);
        $('.stats-item:nth-child(1) .stats-value').text(formattedEarnings + ' $');
    }
    
    // Distanz aktualisieren
    if (data.distance !== undefined) {
        $('.stats-item:nth-child(2) .stats-value').text(data.distance + ' km');
    }
    
    // Zeit aktualisieren
    if (data.time !== undefined) {
        $('.stats-item:nth-child(3) .stats-value').text(data.time);
    }
    
    // Schaden aktualisieren (4. Element)
    if (data.damage !== undefined) {
        $('.stats-item:nth-child(4) .stats-value').text(data.damage + ' %');
    }
    
    // Abgeschlossene Jobs (falls vorhanden)
    if (data.jobs !== undefined) {
        // Füge ein Element für abgeschlossene Jobs hinzu oder aktualisiere es
        if ($('.stats-item:nth-child(5)').length > 0) {
            $('.stats-item:nth-child(5) .stats-value').text(data.jobs);
        }
        console.log('Abgeschlossene Jobs:', data.jobs);
    }
}