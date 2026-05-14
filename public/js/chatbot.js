/**
 * An LUXURY AI Chatbot Helper
 */
const Chatbot = {
    isOpen: false,
    messages: [
        { role: 'bot', text: 'Chào mừng con vợ đến với An LUXURY! Anh là trợ lý ảo AI. Con vợ cần gì nhỉ?' }
    ],

    init() {
        this.injectStyles();
        this.render();
        this.attachEvents();
    },

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #ai-chat-container {
                position: fixed;
                bottom: 100px; /* Above Zalo btn */
                right: 24px;
                z-index: 1000;
                font-family: 'Inter', sans-serif;
            }
            #ai-chat-window {
                width: 350px;
                height: 500px;
                background: #111;
                border: 1px solid var(--gold-dark);
                border-radius: 16px;
                display: none;
                flex-direction: column;
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(0,0,0,0.8);
                margin-bottom: 15px;
                backdrop-filter: blur(20px);
            }
            #ai-chat-window.active { display: flex; }
            .chat-header {
                padding: 1rem;
                background: linear-gradient(to right, #1a1a1a, #000);
                border-bottom: 1px solid var(--gold-dark);
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .chat-header img {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                border: 1px solid var(--gold-primary);
            }
            .chat-header-info h4 { margin: 0; font-size: 0.9rem; color: #fff; }
            .chat-header-info p { margin: 0; font-size: 0.7rem; color: #2ecc71; }
            
            .chat-body {
                flex: 1;
                padding: 1rem;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 12px;
                background: radial-gradient(circle at center, #1a1a1a 0%, #0a0a0a 100%);
            }
            .chat-msg {
                max-width: 80%;
                padding: 0.8rem 1rem;
                border-radius: 12px;
                font-size: 0.85rem;
                line-height: 1.4;
            }
            .chat-msg.bot {
                align-self: flex-start;
                background: #222;
                color: #e0e0e0;
                border-bottom-left-radius: 2px;
                border: 1px solid #333;
            }
            .chat-msg.user {
                align-self: flex-end;
                background: var(--gold-primary);
                color: #000;
                border-bottom-right-radius: 2px;
                font-weight: 500;
            }
            
            .chat-footer {
                padding: 1rem;
                border-top: 1px solid #222;
                display: flex;
                gap: 8px;
            }
            .chat-input {
                flex: 1;
                background: #000;
                border: 1px solid #333;
                border-radius: 20px;
                padding: 0.6rem 1rem;
                color: #fff;
                font-size: 0.85rem;
            }
            .chat-input:focus { outline: none; border-color: var(--gold-primary); }
            .chat-send {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: var(--gold-primary);
                color: #000;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            #ai-chat-toggle {
                width: 60px;
                height: 60px;
                background: #000;
                border: 2px solid var(--gold-primary);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(212,175,55,0.3);
                transition: transform 0.3s;
                position: relative;
            }
            #ai-chat-toggle:hover { transform: scale(1.1); }
            #ai-chat-toggle i { color: var(--gold-primary); font-size: 1.5rem; }
            .chat-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #e74c3c;
                color: #fff;
                font-size: 0.7rem;
                padding: 2px 6px;
                border-radius: 10px;
                border: 2px solid #000;
            }
        `;
        document.head.appendChild(style);
    },

    render() {
        const container = document.createElement('div');
        container.id = 'ai-chat-container';
        container.innerHTML = `
            <div id="ai-chat-window">
                <div class="chat-header">
                    <img src="../images/logo-ai.png" onerror="this.src='https://cdn-icons-png.flaticon.com/512/4712/4712035.png'">
                    <div class="chat-header-info">
                        <h4>An LUXURY AI</h4>
                        <p>● Đang online</p>
                    </div>
                    <button id="close-chat" style="margin-left: auto; background: none; border: none; color: #666; cursor: pointer;"><i class="fa-solid fa-times"></i></button>
                </div>
                <div class="chat-body" id="chat-messages">
                    ${this.messages.map(m => `<div class="chat-msg ${m.role}">${m.text.replace(/\n/g, '<br>')}</div>`).join('')}
                </div>
                <div class="chat-footer">
                    <input type="text" id="chat-input-field" class="chat-input" placeholder="Hỏi em bất cứ điều gì...">
                    <button id="chat-send-btn" class="chat-send"><i class="fa-solid fa-paper-plane"></i></button>
                </div>
            </div>
            <div id="ai-chat-toggle">
                <i class="fa-solid fa-robot"></i>
                <span class="chat-badge">AI</span>
            </div>
        `;
        document.body.appendChild(container);
    },

    attachEvents() {
        const toggle = document.getElementById('ai-chat-toggle');
        const window = document.getElementById('ai-chat-window');
        const close = document.getElementById('close-chat');
        const sendBtn = document.getElementById('chat-send-btn');
        const input = document.getElementById('chat-input-field');

        toggle.onclick = () => {
            this.isOpen = !this.isOpen;
            window.classList.toggle('active', this.isOpen);
            if (this.isOpen) input.focus();
        };

        close.onclick = (e) => {
            e.stopPropagation();
            this.isOpen = false;
            window.classList.remove('active');
        };

        const sendMessage = async () => {
            const text = input.value.trim();
            if (!text) return;

            // Add user message
            this.addMessage('user', text);
            input.value = '';

            // Loading state
            const botMsgId = 'bot-' + Date.now();
            this.addMessage('bot', '...', botMsgId);

            try {
                const response = await API.sendChatMessage(text);
                const botMsgDiv = document.getElementById(botMsgId);
                if (botMsgDiv) {
                    botMsgDiv.innerHTML = response.reply.replace(/\n/g, '<br>');
                }
            } catch (error) {
                const botMsgDiv = document.getElementById(botMsgId);
                if (botMsgDiv) {
                    botMsgDiv.textContent = 'Anh đang bận tí, tí anh trả lời con vợ nhé';
                }
            }
        };

        sendBtn.onclick = sendMessage;
        input.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };
    },

    addMessage(role, text, id = null) {
        const body = document.getElementById('chat-messages');
        const msg = document.createElement('div');
        msg.className = `chat-msg ${role}`;
        if (id) msg.id = id;
        msg.innerHTML = text.replace(/\n/g, '<br>');
        body.appendChild(msg);
        body.scrollTop = body.scrollHeight;
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => Chatbot.init());
