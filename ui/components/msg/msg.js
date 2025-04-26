// Toast Notification System
$(document).ready(function() {
    // Global variable to store toast IDs
    window.toastCounter = 0;
    
    /**
     * Show a toast notification
     * @param {Object} options - Toast configuration options
     * @param {string} options.type - The type of toast: 'success', 'info', 'warning', 'error'
     * @param {string} options.title - Title text for the toast (optional)
     * @param {string} options.message - Message content for the toast
     * @param {number} options.duration - Duration in milliseconds (default: 5000)
     * @param {Function} options.onClose - Callback function when toast is closed (optional)
     * @returns {number} - The ID of the created toast
     */
    window.showToast = function(options) {
        // Default settings
        const settings = {
            type: 'info',
            title: '',
            message: '',
            duration: 5000,
            onClose: null
        };
        
        // Override defaults with provided options
        Object.assign(settings, options);
        
        // Create toast ID
        const toastId = ++window.toastCounter;
        
        // Get the appropriate icon based on toast type
        let icon = '';
        switch(settings.type) {
            case 'success':
                icon = '<i class="fas fa-check-circle toast-icon"></i>';
                break;
            case 'info':
                icon = '<i class="fas fa-info-circle toast-icon"></i>';
                break;
            case 'warning':
                icon = '<i class="fas fa-exclamation-triangle toast-icon"></i>';
                break;
            case 'error':
                icon = '<i class="fas fa-times-circle toast-icon"></i>';
                break;
            default:
                icon = '<i class="fas fa-info-circle toast-icon"></i>';
        }
        
        // Create toast HTML
        let toastHTML = `
        <div id="toast-${toastId}" class="toast ${settings.type}">
            ${icon}
            <div class="toast-content">
                ${settings.title ? `<div class="toast-title">${settings.title}</div>` : ''}
                <div class="toast-message">${settings.message}</div>
            </div>
            <div class="toast-close"><i class="fas fa-times"></i></div>
            <div class="toast-progress">
                <div class="toast-progress-bar"></div>
            </div>
        </div>
        `;
        
        // Add toast to the container
        $('#toast-container').append(toastHTML);
        const $toast = $(`#toast-${toastId}`);
        
        // Set animation duration for progress bar
        $toast.find('.toast-progress-bar').css('animation-duration', `${settings.duration / 1000}s`);
        
        // Setup close handler
        $toast.find('.toast-close').on('click', function() {
            closeToast(toastId);
        });
        
        // Setup automatic closing
        if (settings.duration > 0) {
            setTimeout(function() {
                closeToast(toastId);
            }, settings.duration);
        }
        
        // Function to close the toast
        function closeToast(id) {
            const $toast = $(`#toast-${id}`);
            if ($toast.length) {
                $toast.css('animation', 'slide-out 0.4s ease forwards');
                
                setTimeout(function() {
                    $toast.remove();
                    if (typeof settings.onClose === 'function') {
                        settings.onClose();
                    }
                }, 400);
            }
        }
        
        // Return toast ID for potential manual closing
        return toastId;
    };
    
    /**
     * Close a specific toast by ID
     * @param {number} id - The ID of the toast to close
     */
    window.closeToast = function(id) {
        const $toast = $(`#toast-${id}`);
        if ($toast.length) {
            $toast.css('animation', 'slide-out 0.4s ease forwards');
            
            setTimeout(function() {
                $toast.remove();
            }, 400);
        }
    };
    
    /**
     * Close all toasts
     */
    window.closeAllToasts = function() {
        $('.toast').each(function() {
            const id = $(this).attr('id').replace('toast-', '');
            window.closeToast(id);
        });
    };
    
    // NUI message handler for notifications
    window.addEventListener('message', function(event) {
        const data = event.data;
        
        if (data.type === 'notification') {
            // Support for the existing notification system
            const options = {
                type: data.notificationType || 'info',
                message: data.message || '',
                title: data.title || '',
                duration: data.duration || 5000
            };
            
            window.showToast(options);
        }
    });
    
    // Test notification when the component loads (will be removed in production)
    /*
    setTimeout(function() {
        window.showToast({
            type: 'info',
            title: 'Willkommen',
            message: 'Das Toast-Benachrichtigungssystem wurde geladen.'
        });
    }, 1000);
    */
});
