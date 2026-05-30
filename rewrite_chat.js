const fs = require('fs');
const path = require('path');

const dashboardPath = path.join(__dirname, 'public', 'pages', 'admin', 'dashboard.html');
const chatPath = path.join(__dirname, 'public', 'pages', 'admin', 'chat.html');

let dashboardHtml = fs.readFileSync(dashboardPath, 'utf8');

// Trích xuất từ <body> đến hết <aside> và header của <main>
const sidebarEndIndex = dashboardHtml.indexOf('<!-- Main Content -->');
const sidebarPart = dashboardHtml.substring(0, sidebarEndIndex);

const mainStart = `
        <!-- Main Content -->
        <main class="admin-main" style="display: flex; flex-direction: column; height: 100vh; overflow: hidden;">
            
            <div class="page-header" style="flex-shrink: 0; margin-bottom: 0;">
                <h1 class="page-title">Hỗ Trợ Trực Tuyến</h1>
                <div class="admin-profile">
                    <div style="text-align: right;">
                        <div style="font-weight: 500;" id="header-admin-name">Admin User</div>
                        <div style="font-size: 0.8rem; color: var(--admin-text-light);" id="header-admin-role">Quản trị viên</div>
                    </div>
                    <img id="admin-avatar" src="https://ui-avatars.com/api/?name=Admin&background=1a1a1a&color=d4af37" alt="Admin" style="width: 40px; height: 40px; border-radius: 50%;">
                </div>
            </div>

            <!-- Chat Interface -->
            <div class="chat-container" style="flex: 1; display: flex; background: var(--admin-card-bg); border-top: 1px solid var(--admin-border); overflow: hidden;">
                <!-- Sessions List -->
                <div class="sessions-panel" style="width: 320px; border-right: 1px solid var(--admin-border); display: flex; flex-direction: column; background: var(--admin-bg);">
                    <div class="sessions-header" style="padding: 15px 20px; border-bottom: 1px solid var(--admin-border); font-weight: 600; color: var(--admin-text); background: var(--admin-card-bg);">
                        Danh sách chat
                    </div>
                    <div class="sessions-list" id="sessions-list" style="flex: 1; overflow-y: auto;">
                        <div style="padding: 20px; text-align: center; color: var(--admin-text-light);">Đang tải...</div>
                    </div>
                </div>

                <!-- Chat Area -->
                <div class="chat-area" id="chat-area" style="flex: 1; display: none; flex-direction: column; background: var(--admin-bg);">
                    <div class="chat-header" style="padding: 15px 20px; border-bottom: 1px solid var(--admin-border); display: flex; justify-content: space-between; align-items: center; background: var(--admin-card-bg);">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--admin-accent); display: flex; align-items: center; justify-content: center; color: #000; font-weight: bold; font-size: 1.2rem;" id="chat-avatar-letter">K</div>
                            <div>
                                <div id="current-chat-name" style="font-weight: 600; color: var(--admin-text);">Tên khách hàng</div>
                                <div style="font-size: 0.8rem; color: var(--status-success);"><i class="fas fa-circle" style="font-size: 0.6rem;"></i> Đang hoạt động</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chat-messages" id="chat-messages" style="flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px;">
                        <!-- Messages go here -->
                    </div>
                    
                    <div class="chat-input-area" style="padding: 20px; border-top: 1px solid var(--admin-border); display: flex; gap: 15px; background: var(--admin-card-bg);">
                        <input type="text" id="chat-input" class="chat-input" placeholder="Nhập tin nhắn phản hồi..." style="flex: 1; padding: 12px 20px; border: 1px solid var(--admin-border); border-radius: 30px; outline: none; background: var(--admin-bg); color: var(--admin-text); font-size: 0.95rem;">
                        <button id="send-btn" class="send-btn" style="background: var(--admin-accent); color: #000; border: none; width: 45px; height: 45px; border-radius: 50%; cursor: pointer; transition: transform 0.2s; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>

                <!-- Empty State -->
                <div class="empty-chat" id="empty-chat" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--admin-text-light); background: var(--admin-bg);">
                    <i class="far fa-comments" style="font-size: 4rem; margin-bottom: 15px; opacity: 0.3;"></i>
                    <h3>Chọn một phiên chat để bắt đầu</h3>
                </div>
            </div>

        </main>
    </div>
`;

const styleBlock = `
    <style>
        .session-item { padding: 15px 20px; border-bottom: 1px solid var(--admin-border); cursor: pointer; transition: 0.2s; position: relative; }
        .session-item:hover, .session-item.active { background: var(--admin-card-bg); }
        .session-item.active { border-left: 3px solid var(--admin-accent); }
        .session-name { font-weight: bold; margin-bottom: 5px; color: var(--admin-text); }
        .session-preview { font-size: 0.85rem; color: var(--admin-text-light); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .session-time { position: absolute; right: 20px; top: 15px; font-size: 0.75rem; color: var(--admin-text-light); }
        
        .msg { max-width: 70%; padding: 12px 18px; border-radius: 20px; font-size: 0.95rem; line-height: 1.4; position: relative; color: #fff; }
        .msg-time { font-size: 0.7rem; opacity: 0.7; margin-top: 5px; display: block; }
        .msg.received { background: var(--admin-card-bg); align-self: flex-start; border-bottom-left-radius: 5px; border: 1px solid var(--admin-border); }
        .msg.sent { background: var(--admin-accent); color: #000; align-self: flex-end; border-bottom-right-radius: 5px; font-weight: 500; }
        
        .chat-input:focus { border-color: var(--admin-accent) !important; }
        .send-btn:hover { transform: scale(1.05); }

        .sessions-list::-webkit-scrollbar, .chat-messages::-webkit-scrollbar { width: 6px; }
        .sessions-list::-webkit-scrollbar-thumb, .chat-messages::-webkit-scrollbar-thumb { background: var(--admin-border); border-radius: 10px; }
    </style>
`;

const scripts = `
    <script src="/socket.io/socket.io.js"></script>
    <script>
        let userInfo = JSON.parse(localStorage.getItem('userInfo'));
        
        document.addEventListener('DOMContentLoaded', () => {
            if (!userInfo || (userInfo.role !== 'admin' && userInfo.role !== 'staff')) {
                window.location.href = '../login.html';
                return;
            }
            
            // Set up sidebar & header
            document.getElementById('header-admin-name').textContent = userInfo.fullName;
            document.getElementById('header-admin-role').textContent = userInfo.role === 'admin' ? 'Quản trị viên' : 'Tư vấn viên';
            document.getElementById('sidebar-role-text').textContent = userInfo.role === 'admin' ? 'Quản Trị Hệ Thống' : 'Hệ Thống Tư Vấn Viên';
            
            const avatarUrl = (userInfo.avatar && String(userInfo.avatar).trim())
                ? userInfo.avatar
                : \`https://ui-avatars.com/api/?name=\${encodeURIComponent(userInfo.fullName)}&background=1a1a1a&color=d4af37\`;
            
            document.getElementById('admin-avatar').src = avatarUrl;
            document.getElementById('sidebar-user-info').innerHTML = \`
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; padding: 0 0.5rem;">
                    <img src="\${avatarUrl}" style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover;">
                    <div style="overflow: hidden;">
                        <div style="font-size: 0.85rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #fff;">\${userInfo.fullName}</div>
                        <div style="font-size: 0.7rem; color: var(--admin-text-light); text-transform: capitalize;">\${userInfo.role === 'admin' ? 'Quản trị viên' : 'Tư vấn viên'}</div>
                    </div>
                </div>
            \`;

            // Active menu
            document.querySelectorAll('.menu-item').forEach(item => {
                if (item.getAttribute('href') === 'chat.html') item.classList.add('active');
            });

            // Role adjustments
            if (userInfo.role === 'staff') {
                const dashNav = document.getElementById('nav-dashboard');
                if (dashNav) dashNav.href = 'staff-dashboard.html';
                const revNav = document.getElementById('nav-revenue');
                if (revNav) revNav.style.display = 'none';
            } else {
                const custNav = document.getElementById('nav-customers');
                if (custNav) custNav.style.display = 'flex';
            }

            document.querySelectorAll('.logout-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('userInfo');
                    localStorage.removeItem('token');
                    window.location.href = '../login.html';
                });
            });
        });

        const socket = io();
        let currentSessionId = null;

        socket.on('connect', () => {
            if (userInfo) {
                socket.emit('join_chat', {
                    userId: userInfo._id || userInfo.id,
                    role: userInfo.role,
                    name: userInfo.fullName
                });
            }
        });

        socket.on('sessions_list', (sessions) => {
            renderSessions(sessions);
        });

        socket.on('session_updated', (data) => {
            if (userInfo) socket.emit('join_chat', { role: userInfo.role });
        });

        socket.on('receive_message', (msg) => {
            if (msg.sessionId === currentSessionId) {
                appendMessage(msg);
                scrollToBottom();
            }
        });

        socket.on('chat_history_admin', (data) => {
            if (data.sessionId === currentSessionId) {
                const msgContainer = document.getElementById('chat-messages');
                msgContainer.innerHTML = '';
                data.messages.forEach(msg => appendMessage(msg));
                scrollToBottom();
            }
        });

        function renderSessions(sessions) {
            const list = document.getElementById('sessions-list');
            list.innerHTML = '';
            if (sessions.length === 0) {
                list.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--admin-text-light);">Chưa có phiên chat nào</div>';
                return;
            }

            sessions.forEach(session => {
                const isGuest = session.sessionId.startsWith('guest_');
                const name = session.customerName || (isGuest ? 'Khách vãng lai' : 'Khách hàng');
                const time = new Date(session.lastUpdated).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
                
                const div = document.createElement('div');
                div.className = 'session-item';
                if (session.sessionId === currentSessionId) div.classList.add('active');
                
                div.innerHTML = \`
                    <div class="session-name">\${name}</div>
                    <div class="session-preview">\${session.lastMessage || 'Bắt đầu chat...'}</div>
                    <div class="session-time">\${time}</div>
                \`;

                div.onclick = () => {
                    document.querySelectorAll('.session-item').forEach(el => el.classList.remove('active'));
                    div.classList.add('active');
                    openChat(session.sessionId, name);
                };
                list.appendChild(div);
            });
        }

        function openChat(sessionId, name) {
            currentSessionId = sessionId;
            document.getElementById('empty-chat').style.display = 'none';
            document.getElementById('chat-area').style.display = 'flex';
            document.getElementById('current-chat-name').textContent = name;
            document.getElementById('chat-avatar-letter').textContent = name.charAt(0).toUpperCase();
            document.getElementById('chat-messages').innerHTML = '<div style="text-align: center; color: var(--admin-text-light); margin-top: 20px;">Đang tải...</div>';
            
            socket.emit('get_chat_history', { sessionId });
        }

        function appendMessage(msg) {
            const msgContainer = document.getElementById('chat-messages');
            if(msgContainer.innerHTML.includes('Đang tải')) msgContainer.innerHTML = '';

            const isAdmin = msg.senderRole === 'admin' || msg.senderRole === 'staff';
            const time = new Date(msg.timestamp).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
            
            const div = document.createElement('div');
            div.className = \`msg \${isAdmin ? 'sent' : 'received'}\`;
            div.innerHTML = \`
                \${msg.text}
                <span class="msg-time">\${time}</span>
            \`;
            msgContainer.appendChild(div);
        }

        function scrollToBottom() {
            const msgContainer = document.getElementById('chat-messages');
            msgContainer.scrollTop = msgContainer.scrollHeight;
        }

        function sendMessage() {
            const input = document.getElementById('chat-input');
            const text = input.value.trim();
            if (!text || !currentSessionId) return;

            socket.emit('send_message', {
                sessionId: currentSessionId,
                senderRole: userInfo.role,
                senderName: userInfo.fullName || 'Admin',
                text: text
            });
            input.value = '';
        }

        document.getElementById('send-btn').addEventListener('click', sendMessage);
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    </script>
</body>
</html>
`;

const finalHtml = sidebarPart + styleBlock + mainStart + scripts;
fs.writeFileSync(chatPath, finalHtml);
console.log('chat.html rewritten to match admin theme.');
