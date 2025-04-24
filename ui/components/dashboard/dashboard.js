$(document).ready(function() {

    setTimeout(function() {
        startDashboardAnimation();
    }, 300);
    

    $('.job-row').hover(function() {
        $(this).css('background-color', 'rgba(255, 255, 255, 0.05)');
    }, function() {
        $(this).css('background-color', '');
    });
    

    window.resetAndStartDashboardAnimation = startDashboardAnimation;
});

function startDashboardAnimation() {
    if (!window.jQuery) return;

    $('.animate-element').removeClass('visible').css('opacity', '0');

    const totalDuration = 2000;
    
    const statsCount = $('.stats-item.animate-element').length || 1;
    const jobRowCount = $('.job-row.animate-element').length || 1;
    const infoItemCount = $('.info .content span.animate-element').length || 1;
    

    const statsDelay = totalDuration * 0.30 / statsCount;
    const jobRowDelay = totalDuration * 0.40 / jobRowCount;
    const infoItemDelay = totalDuration * 0.10 / infoItemCount;
    
    const jobsWrapperDelay = totalDuration * 0.30;
    const jobRowsStartDelay = totalDuration * 0.40;
    const infoStartDelay = totalDuration * 0.80;
    const infoItemsStartDelay = totalDuration * 0.90;
    

    setTimeout(function() {

        $('.stats-item.animate-element').each(function(index) {
            const element = $(this);
            setTimeout(function() {
                element.addClass('visible');
            }, index * statsDelay);
        });
        

        setTimeout(function() {
            $('.jobs-wrapper.animate-element').addClass('visible');
        }, jobsWrapperDelay);
        

        $('.job-row.animate-element').each(function(index) {
            const element = $(this);
            setTimeout(function() {
                element.addClass('visible');
            }, jobRowsStartDelay + (index * jobRowDelay));
        });
        

        setTimeout(function() {
            $('.info.animate-element').addClass('visible');
        }, infoStartDelay);
        

        $('.info .content span.animate-element').each(function(index) {
            const element = $(this);
            setTimeout(function() {
                element.addClass('visible');
            }, infoItemsStartDelay + (index * infoItemDelay));
        });
        

        setTimeout(function() {
        }, totalDuration + 100);
    }, 100);
}