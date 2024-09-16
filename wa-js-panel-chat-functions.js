// Chat Functions module
const ChatFunctions = {
    init: function() {
        this.addStyles();
        const htmlContent = `
            <h4>聊天功能</h4>
            <textarea id="recipientIds" placeholder="输入接收者ID/手机号码 (每行一个)" class="chat-textarea"></textarea>
            <textarea id="messageContent" placeholder="输入消息内容" class="chat-textarea"></textarea>
            <div class="attachment-section">
                <input type="file" id="attachmentInput" multiple>
                <div id="attachmentType">
                    <label><input type="radio" name="attachmentType" value="image" checked> 图片</label>
                    <label><input type="radio" name="attachmentType" value="video"> 视频</label>
                    <label><input type="radio" name="attachmentType" value="audio"> 音频</label>
                    <label><input type="radio" name="attachmentType" value="file"> 文件</label>
                    <label><input type="radio" name="attachmentType" value="contact"> 联系人名片</label>
                </div>
            </div>
            <div id="contactCardInputs" style="display: none;">
                <input type="text" id="contactId" placeholder="联系人ID" class="contact-input">
                <input type="text" id="contactName" placeholder="联系人名字" class="contact-input">
            </div>
            <div class="delay-section">
                延迟发送: <input type="number" id="minDelay" value="1" class="delay-input"> - 
                <input type="number" id="maxDelay" value="3" class="delay-input"> 秒
            </div>
            <button id="sendMessage">发送消息</button>
            <div id="sendProgress" class="send-progress"></div>
            <button id="cancelSend" style="display:none;">取消发送</button>
        `;
        WA_JS_Panel.addFunctionToPanel('chat', htmlContent);
        this.bindEvents();
    },

    addStyles: function() {
        const style = document.createElement('style');
        style.textContent = `
            .chat-textarea {
                width: 100%;
                height: 60px;
                margin-bottom: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 5px;
            }
            .attachment-section {
                margin-bottom: 10px;
            }
            .delay-section {
                margin-bottom: 10px;
            }
            .delay-input {
                width: 50px;
                margin: 0 5px;
            }
            .send-progress {
                height: 5px;
                background-color: #25d366;
                width: 0;
                transition: width 0.3s;
                margin-top: 10px;
            }
            .contact-input {
                width: calc(50% - 5px);
                margin-bottom: 10px;
                padding: 5px;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
        `;
        document.head.appendChild(style);
    },

    bindEvents: function() {
        document.getElementById('sendMessage').addEventListener('click', () => this.sendMessage());
        document.getElementById('cancelSend').addEventListener('click', () => this.cancelSend());
        document.getElementById('recipientIds').addEventListener('paste', (e) => this.handleClipboardPaste(e));
        document.getElementById('messageContent').addEventListener('paste', (e) => this.handleClipboardPaste(e));
        document.getElementById('attachmentInput').addEventListener('paste', (e) => this.handleImagePaste(e));
        
        // Add event listener for attachment type change
        document.querySelectorAll('input[name="attachmentType"]').forEach(radio => {
            radio.addEventListener('change', (e) => this.toggleContactCardInputs(e));
        });
    },

    toggleContactCardInputs: function(e) {
        const contactCardInputs = document.getElementById('contactCardInputs');
        contactCardInputs.style.display = e.target.value === 'contact' ? 'block' : 'none';
    },

    sendMessage: async function() {
        const recipients = document.getElementById('recipientIds').value.split('\n').filter(id => id.trim());
        const message = document.getElementById('messageContent').value;
        const attachmentInput = document.getElementById('attachmentInput');
        const attachmentType = document.querySelector('input[name="attachmentType"]:checked').value;
        const minDelay = parseInt(document.getElementById('minDelay').value);
        const maxDelay = parseInt(document.getElementById('maxDelay').value);

        let isCancelled = false;
        document.getElementById('cancelSend').style.display = 'inline-block';
        document.getElementById('cancelSend').onclick = () => {
            isCancelled = true;
        };

        for (let i = 0; i < recipients.length; i++) {
            if (isCancelled) {
                console.log('Message sending cancelled');
                break;
            }

            const recipient = recipients[i].trim();
            if (recipient) {
                try {
                    const chatId = await this.getChatId(recipient);
                    if (attachmentType === 'contact') {
                        const contactId = document.getElementById('contactId').value;
                        const contactName = document.getElementById('contactName').value;
                        if (contactId && contactName) {
                            const vcard = this.createVCard(contactId, contactName);
                            await WPP.chat.sendVCardMessage(chatId, vcard);
                        }
                    } else if (attachmentInput.files.length > 0) {
                        const file = attachmentInput.files[0];
                        switch (attachmentType) {
                            case 'image':
                                await WPP.chat.sendFileMessage(chatId, file, { type: 'image' });
                                break;
                            case 'video':
                                await WPP.chat.sendFileMessage(chatId, file, { type: 'video' });
                                break;
                            case 'audio':
                                await WPP.chat.sendFileMessage(chatId, file, { type: 'audio' });
                                break;
                            case 'file':
                                await WPP.chat.sendFileMessage(chatId, file);
                                break;
                        }
                    }
                    
                    if (message) {
                        await WPP.chat.sendTextMessage(chatId, message);
                    }

                    this.updateSendProgress(i + 1, recipients.length);
                    await this.delay(this.randomBetween(minDelay, maxDelay) * 1000);
                } catch (error) {
                    console.error(`Failed to send message to ${recipient}:`, error);
                }
            }
        }

        document.getElementById('cancelSend').style.display = 'none';
        alert('Message sending completed');
    },

    cancelSend: function() {
        console.log('Cancelling message sending...');
    },

    handleClipboardPaste: function(e) {
        const target = e.target;
        if (target.id === 'recipientIds' || target.id === 'messageContent') {
            setTimeout(() => {
                const cleanContent = target.value.replace(/\n/g, ' ').trim();
                target.value = cleanContent;
            }, 0);
        }
    },

    handleImagePaste: function(e) {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                const reader = new FileReader();
                reader.onload = function(event) {
                    document.getElementById('attachmentInput').files = new FileList([new File([blob], "pasted_image.png")]);
                };
                reader.readAsDataURL(blob);
            }
        }
    },

    updateSendProgress: function(current, total) {
        const progressElement = document.getElementById('sendProgress');
        progressElement.textContent = `Sending: ${current}/${total}`;
        progressElement.style.width = `${(current / total) * 100}%`;
    },

    getChatId: async function(input) {
        if (input.endsWith('@g.us') || input.endsWith('@c.us')) {
            return input;
        }
        // Remove any non-digit characters
        const cleanNumber = input.replace(/\D/g, '');
        return `${cleanNumber}@c.us`;
    },

    delay: function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    randomBetween: function(min, max) {
        return Math.random() * (max - min) + min;
    },

    createVCard: function(contactId, contactName) {
        return `BEGIN:VCARD
VERSION:3.0
FN:${contactName}
TEL;TYPE=CELL:${contactId}
END:VCARD`;
    }
};