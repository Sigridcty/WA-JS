// Chat Functions module
const ChatFunctions = {
    init: function() {
        this.addStyles();
        const htmlContent = `
            <h4>聊天功能</h4>
            <textarea id="recipientIds" placeholder="输入接收者ID/手机号码 (每行一个)" style="width: 100%; height: 60px; margin-bottom: 5px;"></textarea>
            <textarea id="messageContent" placeholder="输入消息内容" style="width: 100%; height: 60px; margin-bottom: 5px;"></textarea>
            <div>
                <input type="file" id="attachmentInput" multiple>
                <div id="attachmentType">
                    <input type="radio" name="attachmentType" value="image" checked> 图片
                    <input type="radio" name="attachmentType" value="video"> 视频
                    <input type="radio" name="attachmentType" value="audio"> 音频
                    <input type="radio" name="attachmentType" value="file"> 文件
                    <input type="radio" name="attachmentType" value="contact"> 联系人名片
                </div>
            </div>
            <div>
                延迟发送: <input type="number" id="minDelay" value="1" style="width: 50px;"> - 
                <input type="number" id="maxDelay" value="3" style="width: 50px;"> 秒
            </div>
            <button id="sendMessage">发送消息</button>
            <div id="sendProgress" style="margin-top: 10px;"></div>
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
        `;
        document.head.appendChild(style);
    },

    bindEvents: function() {
        document.getElementById('sendMessage').addEventListener('click', this.sendMessage);
        document.getElementById('cancelSend').addEventListener('click', this.cancelSend);
        document.getElementById('recipientIds').addEventListener('paste', this.handleClipboardPaste);
        document.getElementById('messageContent').addEventListener('paste', this.handleClipboardPaste);
        document.getElementById('attachmentInput').addEventListener('paste', this.handleImagePaste);
    },

    sendMessage: async function() {
        // Implementation of sendMessage function
        // (The existing sendMessage function code goes here)
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
    }
};