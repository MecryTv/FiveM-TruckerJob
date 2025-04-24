$(document).ready(function() {
    // Funktion zum Starten der Animationen
    function startLeaderboardAnimations() {
        $('.animate-element').each(function(index) {
            const element = $(this);
            setTimeout(function() {
                element.addClass('visible');
            }, 100);
        });
    }

    // Beim Laden der Seite die Animationen starten
    startLeaderboardAnimations();

    // Globale Funktion zum Zurücksetzen und Neustarten der Animationen
    window.resetAndStartLeaderboardAnimation = function() {
        $('.animate-element').removeClass('visible');
        $('.animate-element').css('opacity', '0');
        
        setTimeout(function() {
            startLeaderboardAnimations();
        }, 100);
    };

    // Event-Listener für Menu-Klicks
    $('#leaderboard-content').on('DOMNodeInserted', function(e) {
        if (e.target === this || $(e.target).hasClass('leaderboard-container')) {
            setTimeout(function() {
                startLeaderboardAnimations();
            }, 100);
        }
    });
});
