let dashboardIsVisible = true;

$(document).ready(function() {
    $('#app').show();

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
            default:

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