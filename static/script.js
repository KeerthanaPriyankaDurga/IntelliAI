// script.js - NexusAI Chat — Voice, Copy, File, History, Thinking
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const thinkingIndicator = document.getElementById('thinkingIndicator');
const thinkingText = document.getElementById('thinkingText');
const charCount = document.getElementById('charCount');
const statusText = document.getElementById('statusText');
const fileInput = document.getElementById('fileInput');
const filePreviewArea = document.getElementById('filePreviewArea');
const fileNamePreview = document.getElementById('fileNamePreview');
const fileSizePreview = document.getElementById('fileSizePreview');
const fileTypeIcon = document.getElementById('fileTypeIcon');
const voiceBtn = document.getElementById('voiceBtn');
const voiceIcon = document.getElementById('voiceIcon');
const voiceStatus = document.getElementById('voiceStatus');
const voiceStatusText = document.getElementById('voiceStatusText');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const toastIcon = document.getElementById('toastIcon');
const headerSubtitle = document.getElementById('headerSubtitle');

let isProcessing = false;
let attachedFile = null;
let recognition = null;
let isRecording = false;

// ===== Welcome Screen HTML (reusable) =====
const welcomeHTML = `
    <div class="welcome-screen" id="welcomeScreen">
        <div class="welcome-glow"></div>
        <div class="welcome-icon-container">
            <div class="welcome-orbit">
                <div class="orbit-dot"></div>
            </div>
            <div class="welcome-orbit orbit-2">
                <div class="orbit-dot"></div>
            </div>
            <i class="fas fa-atom welcome-main-icon"></i>
        </div>
        <h2 class="welcome-title">Hello there! 👋</h2>
        <p class="welcome-sub">I'm NexusAI — your intelligent assistant.<br>Ask me anything, or try a suggestion below.</p>
        <div class="quick-actions">
            <button class="quick-card" onclick="sendQuickMessage('Explain quantum computing in simple terms')">
                <div class="quick-icon"><i class="fas fa-atom"></i></div>
                <div class="quick-text">
                    <span class="quick-label">Explain</span>
                    <span class="quick-desc">Quantum Computing</span>
                </div>
            </button>
            <button class="quick-card" onclick="sendQuickMessage('Write a creative short story about AI')">
                <div class="quick-icon"><i class="fas fa-pen-fancy"></i></div>
                <div class="quick-text">
                    <span class="quick-label">Write</span>
                    <span class="quick-desc">Creative Story</span>
                </div>
            </button>
            <button class="quick-card" onclick="sendQuickMessage('Give me 5 productivity tips for developers')">
                <div class="quick-icon"><i class="fas fa-rocket"></i></div>
                <div class="quick-text">
                    <span class="quick-label">Suggest</span>
                    <span class="quick-desc">Productivity Tips</span>
                </div>
            </button>
            <button class="quick-card" onclick="sendQuickMessage('Write Python code for a REST API')">
                <div class="quick-icon"><i class="fas fa-code"></i></div>
                <div class="quick-text">
                    <span class="quick-label">Code</span>
                    <span class="quick-desc">Python REST API</span>
                </div>
            </button>
        </div>
    </div>
`;

// ===== Thinking Animation Texts =====
const thinkingPhrases = [
    'AI is thinking',
    'Analyzing your question',
    'Generating response',
    'Processing request',
    'Crafting the answer',
    'Connecting neurons',
    'Searching knowledge base'
];
let thinkingInterval = null;

// ===== Auto-resize textarea =====
userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    charCount.textContent = this.value.length;
});

// Send on Enter
userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

userInput.focus();

// ===== FILE ATTACHMENT =====
fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
        showToast('File too large! Max 10MB allowed.', 'error');
        fileInput.value = '';
        return;
    }

    attachedFile = file;
    fileNamePreview.textContent = file.name;
    fileSizePreview.textContent = formatFileSize(file.size);
    fileTypeIcon.className = 'fas ' + getFileIcon(file.name);
    filePreviewArea.classList.add('show');
});

function removeAttachment() {
    attachedFile = null;
    fileInput.value = '';
    filePreviewArea.classList.remove('show');
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const iconMap = {
        pdf: 'fa-file-pdf',
        jpg: 'fa-file-image', jpeg: 'fa-file-image', png: 'fa-file-image', gif: 'fa-file-image', webp: 'fa-file-image',
        txt: 'fa-file-lines', md: 'fa-file-lines',
        csv: 'fa-file-csv',
        json: 'fa-file-code', js: 'fa-file-code', py: 'fa-file-code', html: 'fa-file-code', css: 'fa-file-code',
    };
    return iconMap[ext] || 'fa-file';
}

// ===== VOICE ASSISTANT =====
function initVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        voiceBtn.title = 'Voice input not supported in this browser';
        voiceBtn.style.opacity = '0.4';
        voiceBtn.style.cursor = 'not-allowed';
        return null;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = function(event) {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }

        if (finalTranscript) {
            userInput.value += finalTranscript;
            userInput.style.height = 'auto';
            userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
            charCount.textContent = userInput.value.length;
        }

        if (interimTranscript) {
            voiceStatusText.textContent = interimTranscript.substring(0, 40) + '...';
        }
    };

    rec.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        stopVoiceRecording();
        if (event.error === 'not-allowed') {
            showToast('Microphone access denied. Please allow in browser settings.', 'error');
        }
    };

    rec.onend = function() {
        if (isRecording) {
            try { rec.start(); } catch(e) { stopVoiceRecording(); }
        }
    };

    return rec;
}

function toggleVoice() {
    if (!recognition) {
        recognition = initVoiceRecognition();
        if (!recognition) {
            showToast('Voice input not supported. Try Chrome!', 'error');
            return;
        }
    }

    if (isRecording) {
        stopVoiceRecording();
    } else {
        startVoiceRecording();
    }
}

function startVoiceRecording() {
    try {
        recognition.start();
        isRecording = true;
        voiceBtn.classList.add('recording');
        voiceIcon.className = 'fas fa-stop';
        voiceStatus.classList.add('show');
        voiceStatusText.textContent = 'Listening...';
        showToast('🎤 Voice recording started. Speak now!');
    } catch (e) {
        console.error('Error starting voice:', e);
        showToast('Could not start voice recording.', 'error');
    }
}

function stopVoiceRecording() {
    try { recognition.stop(); } catch(e) {}
    isRecording = false;
    voiceBtn.classList.remove('recording');
    voiceIcon.className = 'fas fa-microphone';
    voiceStatus.classList.remove('show');
}

// ===== SEND MESSAGE =====
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message && !attachedFile) return;
    if (isProcessing) return;

    const welcome = document.getElementById('welcomeScreen');
    if (welcome) welcome.remove();

    isProcessing = true;
    sendBtn.disabled = true;
    userInput.disabled = true;
    statusText.textContent = 'Processing...';
    if (headerSubtitle) headerSubtitle.textContent = 'Thinking...';

    // Stop voice if active
    if (isRecording) stopVoiceRecording();

    // Show user message
    addMessage(message, 'user', attachedFile ? attachedFile.name : null);

    // Build message to send
    let messageToSend = message;
    if (attachedFile) {
        const textExts = ['txt', 'md', 'csv', 'json', 'py', 'js', 'html', 'css'];
        const ext = attachedFile.name.split('.').pop().toLowerCase();
        if (textExts.includes(ext)) {
            try {
                const fileContent = await readFileContent(attachedFile);
                messageToSend = `[File: ${attachedFile.name}]\n\n${fileContent}\n\n${message}`;
            } catch (e) {
                messageToSend = `[Attached file: ${attachedFile.name}]\n\n${message}`;
            }
        } else {
            messageToSend = `[Attached file: ${attachedFile.name} (${formatFileSize(attachedFile.size)})]\n\n${message}`;
        }
    }

    // Clear input
    userInput.value = '';
    userInput.style.height = 'auto';
    charCount.textContent = '0';
    removeAttachment();
    showThinking();

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: messageToSend })
        });

        const data = await response.json();
        hideThinking();

        if (data.error) {
            addMessage('⚠️ ' + data.error, 'error');
        } else {
            addMessage(data.response, 'ai');
        }
        statusText.textContent = 'NexusAI Online';
        if (headerSubtitle) headerSubtitle.textContent = 'Online — Ready to help';

        saveChatToHistory();
    } catch (error) {
        hideThinking();
        addMessage('⚠️ Network Error: ' + error.message, 'error');
        statusText.textContent = 'Offline';
        if (headerSubtitle) headerSubtitle.textContent = 'Offline';
    } finally {
        isProcessing = false;
        sendBtn.disabled = false;
        userInput.disabled = false;
        userInput.focus();
    }
}

function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
    });
}

// ===== ADD MESSAGE =====
function addMessage(text, sender, fileName = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const avatar = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    const formattedText = text ? text.replace(/\n/g, '<br>') : '';

    // File attachment HTML
    let fileHtml = '';
    if (fileName) {
        const fileIconClass = getFileIcon(fileName);
        fileHtml = `
            <div class="message-file-attachment">
                <div class="msg-file-icon"><i class="fas ${fileIconClass}"></i></div>
                <span class="msg-file-name">${escapeHtml(fileName)}</span>
            </div>
        `;
    }

    // Copy button
    const copyBtnHtml = `
        <div class="message-actions">
            <button class="copy-btn" onclick="copyMessage(this)" title="Copy message">
                <i class="fas fa-copy"></i> Copy
            </button>
        </div>
    `;

    // Timestamp
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageDiv.innerHTML = `
        <div class="message-wrapper">
            <div class="message-avatar">${avatar}</div>
            <div class="message-bubble">
                <div class="message-content">
                    ${fileHtml}
                    ${formattedText}
                </div>
                <div class="message-time">${timeStr}</div>
                ${sender !== 'error' ? copyBtnHtml : ''}
            </div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ===== COPY MESSAGE =====
function copyMessage(btn) {
    const messageContent = btn.closest('.message-wrapper').querySelector('.message-content');
    const text = messageContent.innerText;
    
    navigator.clipboard.writeText(text).then(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        btn.classList.add('copied');
        showToast('Copied to clipboard!');
        
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-copy"></i> Copy';
            btn.classList.remove('copied');
        }, 2000);
    }).catch(() => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        btn.classList.add('copied');
        showToast('Copied to clipboard!');
        
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-copy"></i> Copy';
            btn.classList.remove('copied');
        }, 2000);
    });
}

// ===== THINKING ANIMATION =====
function showThinking() {
    thinkingIndicator.classList.add('show');
    let phraseIndex = 0;
    thinkingText.textContent = thinkingPhrases[0];
    
    thinkingInterval = setInterval(() => {
        phraseIndex = (phraseIndex + 1) % thinkingPhrases.length;
        thinkingText.style.opacity = '0';
        setTimeout(() => {
            thinkingText.textContent = thinkingPhrases[phraseIndex];
            thinkingText.style.opacity = '1';
        }, 200);
    }, 2500);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideThinking() {
    thinkingIndicator.classList.remove('show');
    if (thinkingInterval) {
        clearInterval(thinkingInterval);
        thinkingInterval = null;
    }
}

// ===== CHAT HISTORY =====
const HISTORY_KEY = 'nexusai_chat_history';

function saveChatToHistory() {
    const messages = [];
    document.querySelectorAll('.message').forEach(msg => {
        const isUser = msg.classList.contains('user');
        const isError = msg.classList.contains('error');
        const content = msg.querySelector('.message-content')?.innerText || '';
        if (content) {
            messages.push({
                sender: isUser ? 'user' : (isError ? 'error' : 'ai'),
                text: content
            });
        }
    });

    if (messages.length === 0) return;

    const history = getChatHistory();
    const firstUserMsg = messages.find(m => m.sender === 'user');
    const title = firstUserMsg ? firstUserMsg.text.substring(0, 50) : 'Chat';

    // Update existing or create new
    const currentChatId = sessionStorage.getItem('current_chat_id');
    if (currentChatId) {
        const existingIndex = history.findIndex(h => h.id === currentChatId);
        if (existingIndex !== -1) {
            history[existingIndex].messages = messages;
            history[existingIndex].updatedAt = Date.now();
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
            updateHistoryCount();
            renderHistoryList();
            return;
        }
    }

    const chatEntry = {
        id: 'chat_' + Date.now(),
        title: title,
        messages: messages,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    sessionStorage.setItem('current_chat_id', chatEntry.id);
    history.unshift(chatEntry);
    if (history.length > 50) history.pop();
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    updateHistoryCount();
    renderHistoryList();
}

function getChatHistory() {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    } catch {
        return [];
    }
}

function updateHistoryCount() {
    const badge = document.getElementById('historyCount');
    if (badge) {
        const count = getChatHistory().length;
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
}

function renderHistoryList() {
    const historyList = document.getElementById('historyList');
    const history = getChatHistory();

    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="history-empty">
                <i class="fas fa-comments"></i>
                <p>No chats yet</p>
            </div>
        `;
        return;
    }

    historyList.innerHTML = history.map(chat => `
        <div class="history-item" onclick="loadChat('${chat.id}')">
            <div class="history-item-icon">
                <i class="fas fa-comment"></i>
            </div>
            <div class="history-item-info">
                <div class="history-item-title">${escapeHtml(chat.title)}</div>
                <div class="history-item-time">${timeAgo(chat.updatedAt)}</div>
            </div>
            <button class="history-item-delete" onclick="event.stopPropagation(); deleteChat('${chat.id}')" title="Delete chat">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function loadChat(chatId) {
    const history = getChatHistory();
    const chat = history.find(h => h.id === chatId);
    if (!chat) return;

    const welcome = document.getElementById('welcomeScreen');
    if (welcome) welcome.remove();
    
    chatMessages.querySelectorAll('.message').forEach(m => m.remove());

    chat.messages.forEach(msg => {
        addMessage(msg.text, msg.sender);
    });

    sessionStorage.setItem('current_chat_id', chatId);
    toggleHistoryPanel();
    showToast('Chat loaded!');
}

function deleteChat(chatId) {
    let history = getChatHistory();
    history = history.filter(h => h.id !== chatId);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    updateHistoryCount();
    renderHistoryList();
    showToast('Chat deleted');
}

function toggleHistoryPanel() {
    const panel = document.getElementById('historyPanel');
    panel.classList.toggle('show');
    if (panel.classList.contains('show')) {
        renderHistoryList();
    }
}

function timeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
    if (seconds < 604800) return Math.floor(seconds / 86400) + 'd ago';
    return new Date(timestamp).toLocaleDateString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    
    if (type === 'error') {
        toastIcon.className = 'fas fa-exclamation-circle';
    } else {
        toastIcon.className = 'fas fa-check-circle';
    }
    
    // Remove and re-add show class to restart progress bar animation
    toast.classList.remove('show');
    // Force reflow
    void toast.offsetWidth;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// ===== CLEAR / NEW / EXPORT =====
function clearChat() {
    if (isProcessing) return;
    if (!confirm('Clear chat history?')) return;

    fetch('/clear', { method: 'POST' })
        .then(() => {
            chatMessages.innerHTML = welcomeHTML;
            sessionStorage.removeItem('current_chat_id');
            showToast('Chat cleared!');
        })
        .catch(() => addMessage('⚠️ Failed to clear chat', 'error'));
}

function sendQuickMessage(message) {
    userInput.value = message;
    sendMessage();
}

function newChat() {
    saveChatToHistory();
    sessionStorage.removeItem('current_chat_id');
    
    fetch('/clear', { method: 'POST' })
        .then(() => {
            chatMessages.innerHTML = welcomeHTML;
            showToast('New chat started!');
        });
}

function exportChat() {
    const messages = document.querySelectorAll('.message .message-content');
    if (messages.length === 0) {
        showToast('No messages to export!', 'error');
        return;
    }
    
    let text = '🤖 NexusAI Chat Export\n';
    text += '='.repeat(50) + '\n';
    text += `Exported on: ${new Date().toLocaleString()}\n\n`;
    
    document.querySelectorAll('.message').forEach(msg => {
        const isUser = msg.classList.contains('user');
        const content = msg.querySelector('.message-content').textContent.trim();
        text += `${isUser ? '👤 You' : '🤖 AI'}: ${content}\n\n`;
    });
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexusai_export_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Chat exported!');
}

function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('nexusai_theme', newTheme);
    
    const icon = document.getElementById('themeIcon');
    icon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// ===== INIT =====
// Load saved theme (default dark)
const savedTheme = localStorage.getItem('nexusai_theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
document.getElementById('themeIcon').className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

// Render history + count
updateHistoryCount();
renderHistoryList();