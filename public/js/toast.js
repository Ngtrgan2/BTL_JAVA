/**
 * An LUXURY - Premium Notification System (Toast & Modal)
 * Designed for luxury dark gold theme
 */

(function() {
    // 1. CSS Injection - Self-contained Styling
    const css = `
        /* Toast Container */
        #an-toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 100000;
            display: flex;
            flex-direction: column;
            gap: 12px;
            pointer-events: none;
            max-width: 380px;
            width: 100%;
        }

        /* Toast Card */
        .an-toast {
            position: relative;
            background: rgba(13, 13, 13, 0.9);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(212, 175, 55, 0.25);
            border-left: 4px solid var(--gold-primary, #d4af37);
            border-radius: 4px;
            padding: 14px 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(212, 175, 55, 0.05);
            display: flex;
            align-items: flex-start;
            gap: 14px;
            color: #f5f5f5;
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            line-height: 1.5;
            pointer-events: auto;
            transform: translateX(120%);
            opacity: 0;
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.25), opacity 0.4s ease;
        }

        .an-toast.show {
            transform: translateX(0);
            opacity: 1;
        }

        /* Toast Types */
        .an-toast.success { border-left-color: #d4af37; }
        .an-toast.error { border-left-color: #e74c3c; }
        .an-toast.warning { border-left-color: #f39c12; }
        .an-toast.info { border-left-color: #3498db; }

        /* Toast Icons */
        .an-toast-icon {
            font-size: 1.15rem;
            margin-top: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .an-toast.success .an-toast-icon { color: #d4af37; }
        .an-toast.error .an-toast-icon { color: #e74c3c; }
        .an-toast.warning .an-toast-icon { color: #f39c12; }
        .an-toast.info .an-toast-icon { color: #3498db; }

        /* Toast Content & Close */
        .an-toast-content {
            flex: 1;
        }
        .an-toast-close {
            background: transparent;
            border: none;
            color: #666;
            cursor: pointer;
            font-size: 1rem;
            padding: 0;
            margin-top: 1px;
            transition: color 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .an-toast-close:hover {
            color: #d4af37;
        }

        /* Modal Overlay */
        .an-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(5, 5, 5, 0.75);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 100100;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            font-family: 'Inter', sans-serif;
        }

        .an-modal-overlay.show {
            opacity: 1;
        }

        /* Modal Box */
        .an-modal-box {
            background: #0d0d0d;
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 8px;
            width: 90%;
            max-width: 440px;
            padding: 30px;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.85), 0 0 30px rgba(212, 175, 55, 0.08);
            transform: scale(0.85);
            opacity: 0;
            transition: transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
            text-align: center;
        }

        .an-modal-overlay.show .an-modal-box {
            transform: scale(1);
            opacity: 1;
        }

        /* Modal Elements */
        .an-modal-icon {
            font-size: 2.5rem;
            color: #d4af37;
            margin-bottom: 18px;
            display: inline-flex;
            justify-content: center;
            align-items: center;
        }
        .an-modal-icon.error { color: #e74c3c; }
        .an-modal-icon.warning { color: #f39c12; }
        .an-modal-icon.info { color: #3498db; }

        .an-modal-title {
            font-family: 'Playfair Display', serif;
            color: #f3e5ab;
            font-size: 1.45rem;
            font-weight: 500;
            margin-bottom: 12px;
            letter-spacing: 1px;
        }

        .an-modal-message {
            color: #a0a0a0;
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 24px;
            padding: 0 10px;
        }

        /* Modal Buttons */
        .an-modal-actions {
            display: flex;
            gap: 12px;
            justify-content: center;
        }

        .an-modal-btn {
            padding: 10px 24px;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 1px solid transparent;
            outline: none;
            min-width: 110px;
        }

        .an-modal-btn-confirm {
            background: #d4af37;
            color: #050505;
        }
        .an-modal-btn-confirm:hover {
            background: #f3e5ab;
            transform: translateY(-2px);
        }

        .an-modal-btn-cancel {
            background: transparent;
            border-color: rgba(212, 175, 55, 0.4);
            color: #d4af37;
        }
        .an-modal-btn-cancel:hover {
            background: rgba(212, 175, 55, 0.08);
            border-color: #d4af37;
            transform: translateY(-2px);
        }
    `;

    const styleEl = document.createElement('style');
    styleEl.innerHTML = css;
    document.head.appendChild(styleEl);

    // 2. DOM Helper: Ensure container exists
    let toastContainer = null;
    function getToastContainer() {
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'an-toast-container';
            document.body.appendChild(toastContainer);
        }
        return toastContainer;
    }

    // Icon helper maps
    const icons = {
        success: '<i class="fa-solid fa-circle-check"></i>',
        error: '<i class="fa-solid fa-circle-xmark"></i>',
        warning: '<i class="fa-solid fa-triangle-exclamation"></i>',
        info: '<i class="fa-solid fa-circle-info"></i>'
    };

    // 3. Core Notification Object
    const AnLuxuryNotification = {
        /**
         * Show a premium slide-in toast notification
         * @param {string} message The text to display
         * @param {string} type 'success' | 'error' | 'warning' | 'info'
         * @param {number} duration milliseconds
         */
        toast(message, type = 'info', duration = 3500) {
            const container = getToastContainer();
            const toast = document.createElement('div');
            toast.className = `an-toast ${type}`;

            const iconHtml = icons[type] || icons.info;
            toast.innerHTML = `
                <div class="an-toast-icon">${iconHtml}</div>
                <div class="an-toast-content">${message}</div>
                <button class="an-toast-close" title="Đóng"><i class="fa-solid fa-xmark"></i></button>
            `;

            container.appendChild(toast);

            // Trigger animation
            setTimeout(() => toast.classList.add('show'), 50);

            // Auto dismiss timer
            let dismissTimeout = setTimeout(() => dismiss(), duration);

            function dismiss() {
                toast.classList.remove('show');
                toast.addEventListener('transitionend', () => {
                    toast.remove();
                });
            }

            // Bind manual close click
            toast.querySelector('.an-toast-close').addEventListener('click', (e) => {
                e.stopPropagation();
                clearTimeout(dismissTimeout);
                dismiss();
            });
        },

        /**
         * Show an elegant, custom Modal Alert dialog (blocking replacement for alert)
         * @param {string} message The text body
         * @param {string} title Optional title
         * @param {string} type Optional 'success' | 'error' | 'warning' | 'info'
         * @returns {Promise<void>} Resolves when OK is clicked
         */
        alert(message, title = 'Thông Báo', type = 'success') {
            return new Promise((resolve) => {
                const overlay = document.createElement('div');
                overlay.className = 'an-modal-overlay';

                const iconHtml = icons[type] || icons.success;

                overlay.innerHTML = `
                    <div class="an-modal-box">
                        <div class="an-modal-icon ${type}">${iconHtml}</div>
                        <div class="an-modal-title">${title}</div>
                        <div class="an-modal-message">${message}</div>
                        <div class="an-modal-actions">
                            <button class="an-modal-btn an-modal-btn-confirm" id="an-modal-alert-ok">Đồng Ý</button>
                        </div>
                    </div>
                `;

                document.body.appendChild(overlay);

                // Add animations
                setTimeout(() => overlay.classList.add('show'), 50);

                const handleOk = () => {
                    overlay.classList.remove('show');
                    overlay.addEventListener('transitionend', () => {
                        overlay.remove();
                        resolve();
                    });
                };

                overlay.querySelector('#an-modal-alert-ok').addEventListener('click', handleOk);
                overlay.querySelector('#an-modal-alert-ok').focus();
            });
        },

        /**
         * Show an elegant custom Confirm dialog modal (blocking replacement for confirm)
         * @param {string} message The prompt text
         * @param {string} title Optional title
         * @param {string} type Optional icon type
         * @returns {Promise<boolean>} Resolves to true (confirm) or false (cancel)
         */
        confirm(message, title = 'Xác Nhận Hành Động', type = 'warning') {
            return new Promise((resolve) => {
                const overlay = document.createElement('div');
                overlay.className = 'an-modal-overlay';

                const iconHtml = icons[type] || icons.warning;

                overlay.innerHTML = `
                    <div class="an-modal-box">
                        <div class="an-modal-icon ${type}">${iconHtml}</div>
                        <div class="an-modal-title">${title}</div>
                        <div class="an-modal-message">${message}</div>
                        <div class="an-modal-actions">
                            <button class="an-modal-btn an-modal-btn-cancel" id="an-modal-confirm-no">Hủy</button>
                            <button class="an-modal-btn an-modal-btn-confirm" id="an-modal-confirm-yes">Đồng Ý</button>
                        </div>
                    </div>
                `;

                document.body.appendChild(overlay);

                // Add animations
                setTimeout(() => overlay.classList.add('show'), 50);

                const cleanup = (value) => {
                    overlay.classList.remove('show');
                    overlay.addEventListener('transitionend', () => {
                        overlay.remove();
                        resolve(value);
                    });
                };

                overlay.querySelector('#an-modal-confirm-yes').addEventListener('click', () => cleanup(true));
                overlay.querySelector('#an-modal-confirm-no').addEventListener('click', () => cleanup(false));
                overlay.querySelector('#an-modal-confirm-yes').focus();
            });
        }
    };

    // 4. Expose to Window
    window.AnLuxuryNotification = AnLuxuryNotification;

    // 5. Intelligent Automatic Override of window.alert
    // We override window.alert to automatically route through our premium modal notification.
    const originalAlert = window.alert;
    window.alert = function(message) {
        const msg = String(message).toLowerCase();
        let type = 'success'; // default premium state

        if (msg.includes('lỗi') || msg.includes('thất bại') || msg.includes('không') || msg.includes('chưa') || msg.includes('sai') || msg.includes('fail') || msg.includes('error')) {
            type = 'error';
        } else if (msg.includes('cảnh báo') || msg.includes('chắc chắn') || msg.includes('warning')) {
            type = 'warning';
        } else if (msg.includes('tin tức') || msg.includes('đang tải') || msg.includes('info')) {
            type = 'info';
        }

        // Use alert modal instead of toast for more prominent pop-ups
        AnLuxuryNotification.alert(message, 'Thông Báo', type);
    };
})();
