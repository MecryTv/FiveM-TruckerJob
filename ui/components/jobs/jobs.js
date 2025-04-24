// Standardwert: kein aktiver Job
let isActiveJob = false;

// Beim Laden der Komponente
$(document).ready(function() {
    // Initialisiere die Ansicht basierend auf isActiveJob
    updateJobView();
    
    // Event-Listener für den Abbrechen-Button
    $(document).on('click', '#cancel-job-btn', function() {
        isActiveJob = false;
        updateJobView();
        // Sende Nachricht an den Client, dass der Job abgebrochen wurde
        $.post('https://' + GetParentResourceName() + '/cancelJob', JSON.stringify({}));
    });
    
    // Hier könntest du Event-Listener für das Annehmen eines Jobs hinzufügen
    // z.B. $(document).on('click', '.accept-job-btn', function() { ... });
    
    // Lausche auf Nachrichten vom FiveM-Client
    window.addEventListener('message', function(event) {
        const data = event.data;
        
        if (data.type === 'updateJobStatus') {
            isActiveJob = data.isActive;
            
            if (isActiveJob) {
                // Aktiver Job: Aktualisiere die Details
                $('#job-type').text(data.jobType || 'Frachtlieferung');
                $('#job-destination').text(data.destination || 'Hafen');
                $('#job-distance').text(data.distance || '0');
                $('#job-payment').text(data.payment || '0');
                $('#job-progress').text(data.progress || '0');
                $('#job-progress-bar').css('width', (data.progress || '0') + '%');
            }
            
            updateJobView();
        }
    });
});

// Funktion zum Aktualisieren der Ansicht je nach isActiveJob
function updateJobView() {
    if (isActiveJob) {
        // Zeige aktiven Job und ändere den Sidebar-Text
        $('#active-job-container').show();
        $('#jobs-list-container').hide();
        $('.menu-item a[href="#jobs"] .label').text('Job');
    } else {
        // Zeige Jobs-Übersicht und setze den Sidebar-Text zurück
        $('#active-job-container').hide();
        $('#jobs-list-container').show();
        $('.menu-item a[href="#jobs"] .label').text('Jobs');
    }
}