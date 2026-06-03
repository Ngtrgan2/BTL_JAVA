// chat-widget.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject CSS and Socket.io
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/chat.css';
    
    // 2. Inject HTML Widget only after CSS is loaded to prevent flashing
    link.onload = () => {
        const widgetHTML = `
            <div class="chat-widget-container">
                <div class="chat-widget-toggle" id="live-chat-toggle">
                    <i class="fa-solid fa-comments"></i>
                    <div class="chat-unread-badge" id="live-chat-badge">0</div>
                </div>

                <div class="chat-widget-window" id="live-chat-window">
                    <div class="chat-header">
                        <div class="chat-header-info">
                            <h4>An LUXURY Hỗ Trợ</h4>
                            <p>Chúng tôi luôn trực tuyến 24/7</p>
                        </div>
                        <div class="chat-close-btn" id="live-chat-close">
                            <i class="fa-solid fa-times"></i>
                        </div>
                    </div>
                    
                    <div class="chat-body" id="live-chat-messages">
                        <div class="chat-message system">
                            Chào mừng đến với An LUXURY! Hãy nhắn tin cho chúng tôi nếu bạn cần tư vấn.
                        </div>
                    </div>

                    <div class="chat-footer">
                        <input type="text" class="chat-input" id="live-chat-input" placeholder="Nhập tin nhắn...">
                        <button class="chat-send-btn" id="live-chat-send">
                            <i class="fa-solid fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', widgetHTML);
        
        // Load socket.io after UI is injected
        const socketScript = document.createElement('script');
        socketScript.src = '/socket.io/socket.io.js';
        socketScript.onload = initChat;
        document.body.appendChild(socketScript);
    };
    
    document.head.appendChild(link);
});

let socket;
let currentSessionId;
let userInfo = null;
let unreadCount = 0;

function initChat() {
    socket = io();

    // Lấy thông tin user
    try {
        const stored = localStorage.getItem('userInfo');
        if (stored) userInfo = JSON.parse(stored);
    } catch(e) {}

    const toggleBtn = document.getElementById('live-chat-toggle');
    const closeBtn = document.getElementById('live-chat-close');
    const chatWindow = document.getElementById('live-chat-window');
    const sendBtn = document.getElementById('live-chat-send');
    const inputEl = document.getElementById('live-chat-input');
    const messagesEl = document.getElementById('live-chat-messages');
    const badgeEl = document.getElementById('live-chat-badge');

    let isOpen = false;

    // Lấy ID phiên chat (nếu là khách chưa login thì tạo random id lưu vào session storage)
    currentSessionId = userInfo ? userInfo.id || userInfo._id : sessionStorage.getItem('guestChatId');
    if (!currentSessionId) {
        currentSessionId = 'guest_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('guestChatId', currentSessionId);
    }

    // Kết nối vào phòng
    const joinRoom = () => {
        socket.emit('join_chat', {
            userId: currentSessionId,
            role: userInfo ? userInfo.role : 'user',
            name: userInfo ? userInfo.fullName : 'Khách vãng lai'
        });
    };
    if (socket.connected) joinRoom();
    else socket.on('connect', joinRoom);

    // Lắng nghe lịch sử chat
    socket.on('chat_history', (data) => {
        messagesEl.innerHTML = '<div class="chat-message system">Chào mừng đến với An LUXURY! Hãy nhắn tin cho chúng tôi nếu bạn cần tư vấn.</div>';
        data.messages.forEach(msg => {
            appendMessage(msg);
        });
        scrollToBottom();
    });

    // Lắng nghe tin nhắn mới
    socket.on('receive_message', (msg) => {
        appendMessage(msg);
        scrollToBottom();

        // Tăng unread nếu chat đang đóng
        if (!isOpen && msg.senderRole !== 'user') {
            unreadCount++;
            badgeEl.textContent = unreadCount;
            badgeEl.style.display = 'flex';
            
            // Hiện thông báo toast
            if (window.Cart && window.Cart.showToast) {
                window.Cart.showToast('Có tin nhắn mới từ Hỗ trợ viên!');
            }
        }

        // Phát âm thanh thông báo
        if (msg.senderRole !== 'user') {
            try {
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                audio.volume = 0.5;
                audio.play().catch(e => console.log('Audio play prevented', e));
            } catch(e) {}
        }
    });

    function appendMessage(msg) {
        const isMe = msg.senderRole === 'user';
        const time = new Date(msg.timestamp).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
        
        const div = document.createElement('div');
        div.className = `chat-message ${isMe ? 'sent' : 'received'}`;
        div.innerHTML = `
            ${msg.text}
            <span class="chat-message-time">${time}</span>
        `;
        messagesEl.appendChild(div);
    }

    function scrollToBottom() {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function sendMessage() {
        const text = inputEl.value.trim();
        if (!text) return;

        socket.emit('send_message', {
            sessionId: currentSessionId,
            senderRole: 'user',
            senderName: userInfo ? userInfo.fullName : 'Khách vãng lai',
            text: text
        });

        inputEl.value = '';
    }

    // Events
    toggleBtn.addEventListener('click', () => {
        isOpen = !isOpen;
        if (isOpen) {
            chatWindow.classList.add('open');
            unreadCount = 0;
            badgeEl.style.display = 'none';
            scrollToBottom();
            inputEl.focus();
        } else {
            chatWindow.classList.remove('open');
        }
    });

    closeBtn.addEventListener('click', () => {
        isOpen = false;
        chatWindow.classList.remove('open');
    });

    sendBtn.addEventListener('click', sendMessage);
    inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}
