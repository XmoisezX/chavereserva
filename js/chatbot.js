(function() {
    // 1. Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
        .chatbot-widget {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            z-index: 9999;
            font-family: 'Inter', system-ui, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 1rem;
        }

        /* Toggle Button */
        .chatbot-toggle {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #2563EB; /* primary blue */
            color: white;
            border: none;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
        }
        
        .chatbot-toggle:hover {
            transform: scale(1.05) translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
        }

        .chatbot-toggle span {
            font-size: 28px;
            transition: transform 0.3s ease;
        }

        .chatbot-toggle.active span:first-child {
            opacity: 0;
            transform: rotate(90deg) scale(0);
            position: absolute;
        }
        
        .chatbot-toggle.active span:last-child {
            opacity: 1;
            transform: rotate(0) scale(1);
        }

        .chatbot-toggle span:last-child {
            opacity: 0;
            transform: rotate(-90deg) scale(0);
            position: absolute;
        }

        /* Chat Window */
        .chatbot-window {
            width: 380px;
            max-width: calc(100vw - 2rem);
            height: 500px;
            max-height: calc(100vh - 120px);
            background: white;
            border-radius: 1.5rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transform-origin: bottom right;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            transform: scale(0.9) translateY(20px);
            pointer-events: none;
            border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .chatbot-window.active {
            opacity: 1;
            transform: scale(1) translateY(0);
            pointer-events: all;
        }

        /* Header */
        .chatbot-header {
            background: linear-gradient(135deg, #2563EB, #1E40AF);
            padding: 1.25rem;
            color: white;
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .chatbot-avatar {
            width: 44px;
            height: 44px;
            background: white;
            border-radius: 50%;
            padding: 2px;
            overflow: hidden;
            border: 2px solid rgba(255,255,255,0.3);
        }
        
        .chatbot-avatar img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
        }

        .chatbot-info h3 {
            margin: 0;
            font-size: 1rem;
            font-weight: 700;
        }

        .chatbot-status {
            display: flex;
            align-items: center;
            gap: 0.375rem;
            font-size: 0.75rem;
            opacity: 0.9;
            margin-top: 0.125rem;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            background: #4ADE80;
            border-radius: 50%;
            box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.2);
        }

        /* Messages Area */
        .chatbot-messages {
            flex: 1;
            background: #F8FAFC;
            padding: 1.25rem;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .message {
            max-width: 85%;
            padding: 0.75rem 1rem;
            border-radius: 1rem;
            font-size: 0.9375rem;
            line-height: 1.5;
            position: relative;
            animation: messageSlide 0.3s ease-out forwards;
        }

        @keyframes messageSlide {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .message.received {
            background: white;
            color: #1E293B;
            border-bottom-left-radius: 0.25rem;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            align-self: flex-start;
            border: 1px solid #E2E8F0;
        }

        .message.sent {
            background: #2563EB;
            color: white;
            border-bottom-right-radius: 0.25rem;
            align-self: flex-end;
            box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
        }

        .message-time {
            font-size: 0.65rem;
            margin-top: 0.25rem;
            opacity: 0.7;
            text-align: right;
            display: block;
        }

        /* Input Area */
        .chatbot-input-area {
            padding: 1rem;
            background: white;
            border-top: 1px solid #E2E8F0;
            display: flex;
            gap: 0.5rem;
            align-items: flex-end;
        }

        .chatbot-input {
            flex: 1;
            border: 1px solid #E2E8F0;
            border-radius: 1.5rem;
            padding: 0.75rem 1rem;
            font-family: inherit;
            font-size: 0.9375rem;
            resize: none;
            max-height: 100px;
            outline: none;
            transition: border-color 0.2s;
            background: #F8FAFC;
        }

        .chatbot-input:focus {
            border-color: #2563EB;
            background: white;
        }

        .chatbot-send {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            background: #2563EB;
            color: white;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            flex-shrink: 0;
        }

        .chatbot-send:hover {
            background: #1D4ED8;
            transform: scale(1.05);
        }

        .chatbot-send:disabled {
            background: #94A3B8;
            cursor: not-allowed;
            transform: none;
        }

        /* Dark Mode Support (Basic) */
        @media (prefers-color-scheme: dark) {
            .chatbot-window {
                background: #1E293B;
                border-color: #334155;
            }
            .chatbot-messages {
                background: #0F172A;
            }
            .message.received {
                background: #334155;
                color: white;
                border-color: #475569;
            }
            .chatbot-input-area {
                background: #1E293B;
                border-color: #334155;
            }
            .chatbot-input {
                background: #334155;
                border-color: #475569;
                color: white;
            }
            .chatbot-input:focus {
                background: #1E293B;
            }
        }
    `;
    document.head.appendChild(style);

    // 2. Inject HTML
    const widget = document.createElement('div');
    widget.className = 'chatbot-widget';
    widget.innerHTML = `
        <div class="chatbot-window" id="chatbot-window">
            <div class="chatbot-header">
                <div class="chatbot-avatar">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Michele&backgroundColor=b6e3f4" alt="Michele">
                </div>
                <div class="chatbot-info">
                    <h3>Michele</h3>
                    <div class="chatbot-status">
                        <span class="status-dot"></span>
                        Online agora
                    </div>
                </div>
            </div>
            <div class="chatbot-messages" id="chatbot-messages">
                <div class="message received">
                    Olá! 👋 Eu sou a Michele, sua assistente virtual.<br>
                    Posso ajudar você a encontrar o imóvel ideal ou tirar dúvidas sobre nossos planos?
                    <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
            </div>
            <div class="chatbot-input-area">
                <textarea class="chatbot-input" id="chatbot-input" rows="1" placeholder="Digite sua mensagem..."></textarea>
                <button class="chatbot-send" id="chatbot-send">
                    <span class="material-symbols-outlined">send</span>
                </button>
            </div>
        </div>
        <button class="chatbot-toggle" id="chatbot-toggle">
            <span class="material-symbols-outlined">chat</span>
            <span class="material-symbols-outlined">close</span>
        </button>
    `;
    document.body.appendChild(widget);

    // 3. Add Logic
    const toggle = document.getElementById('chatbot-toggle');
    const window = document.getElementById('chatbot-window');
    const input = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');
    const messages = document.getElementById('chatbot-messages');

    // Toggle Window
    toggle.addEventListener('click', () => {
        const isActive = window.classList.contains('active');
        if (isActive) {
            window.classList.remove('active');
            toggle.classList.remove('active');
        } else {
            window.classList.add('active');
            toggle.classList.add('active');
            setTimeout(() => input.focus(), 300);
        }
    });

    // Auto-resize textarea
    input.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if (this.value === '') this.style.height = 'auto';
    });

    // Send Message
    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        // Add user message
        addMessage(text, 'sent');
        input.value = '';
        input.style.height = 'auto';

        // Simulate typing and response
        setTimeout(() => {
            const responses = [
                "Que ótimo interesse! 😄 Um de nossos consultores vai entrar em contato em instantes.",
                "Entendi. Você poderia me informar seu WhatsApp para continuarmos?",
                "Interessante! Temos ótimas opções com esse perfil.",
                "Poderia me dar mais detalhes sobre o que procura?"
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse, 'received');
        }, 1000 + Math.random() * 1000);
    }

    function addMessage(text, type) {
        const div = document.createElement('div');
        div.className = `message ${type}`;
        div.innerHTML = `
            ${text}
            <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        `;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    sendBtn.addEventListener('click', sendMessage);
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

})();
