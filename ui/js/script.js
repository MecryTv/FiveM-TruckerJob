let dashboardIsVisible = true;
const develop = true;

$(document).ready(function() {
    // Prevent scrolling with mouse wheel in the entire UI
    $(document).on('wheel', function(e) {
        if ($(e.target).closest('#app').length > 0) {
            e.preventDefault();
            return false;
        }
    });

    if (develop) {
        $('#app').show();
    } else {
        $('#app').hide();
    }

    // Close Button Event Listener
    $(document).on('click', '#close-btn', function() {
        $.post('https://' + GetParentResourceName() + '/hideUI');
    });

    window.addEventListener('message', (event) => {
        const data = event.data;

        switch (data.type) {
            case "show":
                $('.animate-element').removeClass('visible');
                $('.animate-element').css('opacity', '0');
                $('#app').show();

                const activeSectionId = $('.menu-item.active a').attr('href');
                const isDashboardActive = activeSectionId === '#dashboard' || !activeSectionId;

                dashboardIsVisible = isDashboardActive;

                // Dashboard-Animationen entfernt
                break;
            case "hide":
                $('#app').hide();
                break;
            case "playerData":
                $('.player-name').text(data.name);
                break;
            case "leaderboardData":
                // Verarbeite Leaderboard-Daten
                // Leaderboard-Daten verarbeiten
                if (typeof updateLeaderboard === 'function') {
                    updateLeaderboard(data.stats, data.playerInfo);
                }
                break;
            case "jobData":
                // Verarbeite Job-Daten
                // Job-Daten verarbeiten
                if (typeof updateJobs === 'function') {
                    updateJobs(data.jobs);
                }
                break;
            case "truckerData":
                // Verarbeite Trucker-Daten
                // Trucker-Daten verarbeiten
                if (typeof updateDashboard === 'function') {
                    updateDashboard(data);
                }
                break;
            case "skillsData":
                // Verarbeite Skills-Daten
                // Skills-Daten verarbeiten
                if (typeof updateSkills === 'function') {
                    // Stelle sicher, dass wir die Daten im richtigen Format senden
                    if (data.skills && Array.isArray(data.skills)) {
                        // Falls es ein Array ist, direkt senden
                        updateSkills(data.skills);
                    } else if (data.skills) {
                        // Falls es kein Array ist, in ein Array verpacken
                        updateSkills([data.skills]);
                    } else {
                        // Fehler bei Skills-Daten-Verarbeitung
                    }
                    

                }
                break;
            default:
                // Unbekannter Event-Typ
                break;
        }
    });


    $('.menu-item a').on('click', function(e) {
        e.preventDefault();
        
        $('.menu-item').removeClass('active');
        $(this).parent('.menu-item').addClass('active');
        
        const targetSection = $(this).attr('href').substring(1);
        $('.content-section').hide();

        const targetElement = $('#' + targetSection + '-content');
        const goingToDashboard = (targetSection === 'dashboard');
        const goingToLeaderboard = (targetSection === 'leaderboard');
        const wasDashboardVisible = dashboardIsVisible;

        dashboardIsVisible = goingToDashboard;
        
        if (targetElement.children().length === 0) {
            loadComponent(targetSection, function() {
                if (goingToDashboard && !wasDashboardVisible) {
                    targetElement.show();
                } else if (goingToLeaderboard) {
                    targetElement.show();
                } else {
                    targetElement.fadeIn(300);
                }
            });
        } else {
            if (goingToDashboard && !wasDashboardVisible) {
                targetElement.show();  // sofort sichtbar
            } else if (goingToLeaderboard) {
                targetElement.show();
            } else {
                targetElement.fadeIn(300);
            }
        }
    });


    loadComponent('dashboard', function() {
        // Dashboard-Animationen entfernt
        loadComponent('jobs');
        loadComponent('skills');
        loadComponent('leaderboard');
    });

    function loadComponent(componentName, callback) {
        $('#' + componentName + '-content').load('./components/' + componentName + '/' + componentName + '.html', function() {
            
            let scriptLoaded = true;
            let cssLoaded = false;

            if ($('link[href="./components/' + componentName + '/' + componentName + '.css"]').length === 0) {
                const cssLink = $('<link rel="stylesheet" type="text/css" href="./components/' + componentName + '/' + componentName + '.css">');
                cssLink.on('load', function() {
                    cssLoaded = true;

                    if (scriptLoaded && typeof callback === 'function') {
                        callback();
                    }
                });
                $('head').append(cssLink);
            } else {
                cssLoaded = true;
            }
            
            if ($('script[src="./components/' + componentName + '/' + componentName + '.js"]').length === 0) {
                scriptLoaded = false;
                $.getScript('./components/' + componentName + '/' + componentName + '.js', function() {
                    scriptLoaded = true;

                    if (cssLoaded && typeof callback === 'function') {
                        callback();
                    }
                }).fail(function() {
                    scriptLoaded = true;
                    
                    if (cssLoaded && typeof callback === 'function') {
                        callback();
                    }
                });
            } else if (cssLoaded && typeof callback === 'function') {

                callback();
            }
        });
    }
});