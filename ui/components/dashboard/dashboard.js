$(document).ready(function() {
    // Job-Row Hover-Effekt
    $('.job-row').hover(function() {
        $(this).css('background-color', 'rgba(255, 255, 255, 0.05)');
    }, function() {
        $(this).css('background-color', '');
    });
    
    // Zeige standardmäßig die "Keine Daten vorhanden"-Nachricht an
    displayNoDataMessage();

    // Event-Listener für NUI-Nachrichten
    window.addEventListener('message', (event) => {
        const data = event.data;
        const type = data.type;
        const action = data.action;
        
        // Verarbeite die spezifischen Trucker-Daten
        if (type === 'truckerData') {
            updateDashboardStats(data);
        }
        
        // Verarbeite die Job-Daten aus der Datenbank
        if (type === 'jobData') {
            updateJobsData(data.jobs);
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

/**
 * Zeigt die "Keine Daten vorhanden"-Nachricht an
 */
function displayNoDataMessage() {
    const jobsTable = $('.jobs-table');
    const jobsHeader = $('.jobs-header');
    const headerExists = jobsHeader.length > 0;
    
    // Falls die Tabelle bereits Inhalte hat (außer dem Header), nicht anzeigen
    const tableRows = jobsTable.find('.job-row').length;
    if (tableRows > 0) return;
    
    // Leere den bestehenden Inhalt der Jobs-Tabelle, behalte aber den Header
    if (headerExists) {
        jobsTable.empty().append(jobsHeader);
    }
    
    // Zeige die "Keine Daten vorhanden"-Nachricht an
    const emptyJobsRow = `
        <div class="job-row no-data">
            <div class="no-jobs-message" style="width: 100%; text-align: center; padding: 20px;">
                <i class="fas fa-truck-loading" style="font-size: 2.5em; color: #a0a0a0; margin-bottom: 10px;"></i>
                <p style="color: #a0a0a0;">Keine Daten vorhanden</p>
            </div>
        </div>
    `;
    jobsTable.append(emptyJobsRow);
}

/**
 * Aktualisiert die Jobs-Tabelle mit Daten aus der Datenbank
 * @param {Object|string} jobData - Die Job-Daten oder "noJobData" string
 */
function updateJobsData(jobData) {
    
    // Leere den bestehenden Inhalt der Jobs-Tabelle, behalte aber die Header
    const jobsTable = $('.jobs-table');
    const jobsHeader = $('.jobs-header');
    jobsTable.empty().append(jobsHeader);
    
    // Wenn keine Jobs vorhanden sind oder jobData nicht definiert ist, zeige eine Nachricht an
    if (jobData === "noJobData" || !jobData || (Array.isArray(jobData) && jobData.length === 0)) {
        displayNoDataMessage();
        return;
    }
    
    // Wenn Jobs vorhanden sind, füge sie zur Tabelle hinzu
    jobData.forEach(job => {
        // Prüfe, ob Anforderungen vorhanden sind
        const requirements = job.requirements || "(NULL)";
        let requirementsHtml = '';
        
        if (requirements === "(NULL)") {
            requirementsHtml = '<span class="req-text">Keine</span>';
        } else if (Array.isArray(requirements)) {
            requirements.forEach(req => {
                requirementsHtml += `<span class="req-icon"><i class="${req.icon || 'fas fa-check'}"></i></span>`;
            });
        } else {
            requirementsHtml = requirements;
        }
        
        // Bestimme den Status-Button-Stil basierend auf dem Typ
        const isCompleted = job.type === "completed";
        const isCancelled = job.type === "cancelled" || job.type === "canceled";
        
        let statusButton = '';
        if (isCompleted) {
            statusButton = `<button class="btn-completed">Completed</button>`;
        } else if (isCancelled) {
            statusButton = `<button class="btn-canceled">Cancelled</button>`;
        } else {
            // Fallback für unbekannte Status-Typen
            statusButton = `<button class="btn-canceled">Cancelled</button>`;
        }
        
        // Erstelle die Job-Zeile mit allen Daten
        const jobRow = `
            <div class="job-row">
                <div class="job-cell company">
                    <div class="company-icon">
                        <i class="${job.icon || 'fas fa-building'}"></i>
                    </div>
                    <div class="company-info">
                        <div class="company-name">${job.title || 'Unbekanntes Unternehmen'}</div>
                        <div class="company-desc">${job.description || ''}</div>
                    </div>
                </div>
                <div class="job-cell reward">
                    <div class="reward-amount" ${isCancelled ? 'style="color: #ff5252;"' : ''}>${job.earnings || '0'}$</div>
                </div>
                <div class="job-cell journey">
                    <div class="journey-route">${job.startLocation || 'Unbekannt'} <i class="fas fa-long-arrow-alt-right route-arrow"></i> ${job.endLocation || 'Unbekannt'}</div>
                    <div class="journey-distance">Distanz: <i class="kilometer">${job.distance || '0'}km</i></div>
                </div>
                <div class="job-cell requirements">
                    <div class="req-icons">
                        ${requirementsHtml}
                    </div>
                </div>
                <div class="job-cell actions">
                    ${statusButton}
                </div>
            </div>
        `;
        
        jobsTable.append(jobRow);
    });
    
    // Reaktiviere den Hover-Effekt für die neuen Job-Zeilen
    $('.job-row').hover(function() {
        $(this).css('background-color', 'rgba(255, 255, 255, 0.05)');
    }, function() {
        $(this).css('background-color', '');
    });
}