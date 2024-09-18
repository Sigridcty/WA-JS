// Chat Functions module
const ChatFunctions = {
    contacts: [],

    init: function() {
        this.addStyles();
        const htmlContent = `
            <div class="panel-section">
                <h4>聊天功能</h4>
                <textarea id="recipientIds" placeholder="输入接收者ID/手机号码 (每行一个，或JSON数组，或逗号分隔)" class="chat-textarea"></textarea>
                <textarea id="messageContent" placeholder="输入消息内容" class="chat-textarea"></textarea>
                <div id="commonMessages"></div>
            </div>
            <div class="panel-section attachment-section">
                <div class="file-input-wrapper">
                    <input type="file" id="attachmentInput" multiple>
                    <label for="boldText" class="bold-text-label">
                        <input type="checkbox" id="boldText"> 加粗
                    </label>
                </div>
                <div id="attachmentPreview"></div>
                <div id="attachmentType">
                    <label><input type="radio" name="attachmentType" value="image" checked> 图片</label>
                    <label><input type="radio" name="attachmentType" value="video"> 视频</label>
                    <label><input type="radio" name="attachmentType" value="audio"> 音频</label>
                    <label><input type="radio" name="attachmentType" value="file"> 文件</label>
                    <label><input type="radio" name="attachmentType" value="contact"> 联系人名片</label>
                </div>
                <div id="attachmentOptions">
                    <label><input type="checkbox" id="isViewOnce"> 阅后即焚</label>
                    <label><input type="checkbox" id="useCaption"> 图文一起</label>
                    <label><input type="checkbox" id="isPtt"> 我的语音</label>
                    <label><input type="checkbox" id="isPtv"> 我的视频</label>
                </div>
            </div>
            <div id="contactCardInputs" class="panel-section" style="display: none;">
                <div class="contact-header">
                    <h5>联系人列表</h5>
                    <button id="loadContacts">加载联系人列表</button>
                </div>
                <div class="contact-input-row">
                    <input type="text" id="contactId" placeholder="联系人ID" class="contact-input">
                    <input type="text" id="contactName" placeholder="联系人名字" class="contact-input">
                    <button id="addContact">添加联系人</button>
                </div>
                <div id="selectedContacts">
                    <h5>已选择的联系人：</h5>
                </div>
            </div>
            <!-- 添加模态窗口 -->
            <div id="contactModal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h4>联系人列表</h4>
                    <input type="text" id="contactSearch" placeholder="搜索联系人">
                    <div id="contactList"></div>
                </div>
            </div>
            <div class="panel-section delay-section">
                <label for="messageDelay">输入中延迟 (秒):</label>
                <input type="number" id="messageDelay" value="1" min="0" step="0.5" class="delay-input">
                <div>
                    批量发送延迟: <input type="number" id="minDelay" value="1" class="delay-input"> - 
                    <input type="number" id="maxDelay" value="2" class="delay-input"> 秒
                </div>
            </div>
            <div class="button-container">
                <button id="sendMessage">发送消息</button>
                <button id="cancelSend" style="display: none;">取消发送</button>
            </div>
            <div id="sendProgress" class="send-progress"></div>
        `;
        WA_JS_Panel.addFunctionToPanel('chat', htmlContent);
        this.bindEvents();
        this.updateAttachmentOptions();
        this.loadSavedData();
        console.log('ChatFunctions initialized');
    },

    addStyles: function() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            #wa-js-panel {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f0f2f5;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                padding: 20px;
            }
            .panel-section {
                animation: fadeIn 0.3s ease-in-out;
                margin-bottom: 10px;
            }
            h4 {
                color: #075e54;
                margin-bottom: 15px;
            }
            .chat-textarea {
                width: 95%;
                height: 80px;
                margin-bottom: 15px;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 10px;
                resize: vertical;
                font-size: 14px;
                transition: border-color 0.3s ease;
                background-color: #fff;
                color: #000;
            }
            .chat-textarea:focus {
                border-color: #25d366;
                outline: none;
            }
            .chat-textarea::placeholder {
                color: #8f9ca8;
            }
            .button-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 10px;
            }
            #sendMessage {
                flex-grow: 1;
                margin-right: 10px;
                background-color: #25d366;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 16px;
                transition: background-color 0.3s ease, transform 0.1s ease-in-out;
            }
            #sendMessage:hover {
                background-color: #128C7E;
            }
            #sendMessage:active {
                transform: scale(0.95);
            }
            #cancelSend {
                background-color: #ea4335;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 16px;
                transition: background-color 0.3s ease;
            }

            #cancelSend:hover {
                background-color: #d33426;
            }
            .attachment-section {
                margin-top: 10px;
                background-color: white;
                border-radius: 8px;
                padding: 10px;
                margin-bottom: 2px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            }
            .file-input-wrapper {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            .file-input-wrapper input[type="file"] {
                flex-grow: 1;
                margin-right: 10px;
            }
            .bold-text-label {
                display: flex;
                align-items: center;
                font-size: 14px;
                color: #075e54;
            }
            .bold-text-label input[type="checkbox"] {
                margin-right: 5px;
            }
            #attachmentPreview {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-top: 10px;
            }
            .attachment-preview {
                position: relative;
                width: 80px;
                height: 80px;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #f0f2f5;
                margin: 5px;
            }
            .attachment-preview img,
            .attachment-preview video,
            .attachment-preview audio {
                max-width: 100%;
                max-height: 100%;
                object-fit: cover;
            }
            .attachment-preview span {
                font-size: 12px;
                text-align: center;
                word-break: break-word;
                padding: 5px;
            }
            .remove-attachment {
                position: absolute;
                top: 2px;
                right: 2px;
                background-color: rgba(255, 255, 255, 0.7);
                border-radius: 50%;
                width: 20px;
                height: 20px;
                text-align: center;
                line-height: 20px;
                cursor: pointer;
                font-size: 12px;
                color: #075e54;
            }
            #attachmentType, #attachmentOptions {
                margin-top: 10px;
            }
            #attachmentType label, #attachmentOptions label {
                margin-right: 10px;
                font-size: 14px;
                color: #075e54;
            }
            #zoomOverlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }

            #zoomImage {
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
            }
            .common-message {
                display: inline-block;
                margin-right: 10px;
                margin-bottom: 10px;
                padding: 8px 12px;
                background-color: #e9edef;
                border-radius: 18px;
                cursor: pointer;
                transition: background-color 0.3s ease;
                font-size: 14px;
            }
            .common-message:hover {
                background-color: #d1d7db;
            }
            .edit-icon {
                font-size: 14px;
                color: #667781;
                margin-left: 5px;
            }
            .delay-section {
                background-color: white;
                border-radius: 8px;
                padding: 10px;
                margin-bottom: 1px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            }
            .delay-input {
                width: 60px;
                padding: 5px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
            }
            #contactCardInputs {
                background-color: white;
                border-radius: 8px;
                padding: 12px;
                margin-bottom: 1px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            }
            .contact-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1px;
            }
            .contact-input {
                width: calc(50% - 5px);
                padding: 8px;
                margin-bottom: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
            }
            .contact-input-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 5px;
            }
            .contact-input-row .contact-input {
                width: calc(40% - 5px);  // 调整宽度以适应按钮
            }
            .contact-input-row #addContact {
                width: 20%;
                padding: 8px;
                background-color: #25d366;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }
            .contact-input-row #addContact:hover {
                background-color: #128C7E;
            }
            .modal {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0,0,0,0.4);
            }
            
            .modal-content {
                background-color: #fefefe;
                margin: 15% auto;
                padding: 20px;
                border: 1px solid #888;
                width: 80%;
                max-width: 500px;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            
            .close {
                color: #aaa;
                float: right;
                font-size: 28px;
                font-weight: bold;
                cursor: pointer;
            }
            
            .close:hover,
            .close:focus {
                color: #000;
                text-decoration: none;
                cursor: pointer;
            }
            
            #contactSearch {
                width: 95%;
                padding: 10px;
                margin-bottom: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
            
            #contactList {
                max-height: 300px;
                overflow-y: auto;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
            
            .contact-item {
                padding: 10px;
                border-bottom: 1px solid #eee;
                cursor: pointer;
            }
            
            .contact-item:hover {
                background-color: #f5f5f5;
            }
            #loadContacts {
                background-color: #25d366;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 15px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.3s ease;
            }
            #loadContacts:hover {
                background-color: #128C7E;
            }
            .send-progress {
                height: 18px;
                background-color: #25d366;
                width: 0;
                transition: width 0.3s;
                margin-top: 10px;
                border-radius: 2.5px;
            }
            #cancelSend {
                background-color: #ea4335;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 15px;
                cursor: pointer;
                font-size: 14px;
                margin-top: 10px;
                transition: background-color 0.3s ease;
            }
            #cancelSend:hover {
                background-color: #d33426;
            }
            .toast-notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: #25d366;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                display: none;
                z-index: 1000;
                font-size: 14px;
                transition: opacity 0.5s ease-in-out;
            }

             /* 改进文本选择样式 */
            #wa-js-panel *::selection {
                background-color: #25d366 !important;
                color: #ffffff !important;
            }

            #wa-js-panel *::-moz-selection {
                background-color: #25d366 !important;
                color: #ffffff !important;
            }

            .chat-textarea::selection,
            .contact-input::selection,
            .delay-input::selection,
            #contactSearch::selection {
                background-color: #25d366 !important;
                color: #ffffff !important;
            }

            .chat-textarea::-moz-selection,
            .contact-input::-moz-selection,
            .delay-input::-moz-selection,
            #contactSearch::-moz-selection {
                background-color: #25d366 !important;
                color: #ffffff !important;
            }
        `;
        document.head.appendChild(style);
    },

    bindEvents: function() {
        document.getElementById('sendMessage').addEventListener('click', () => this.sendMessage());
        document.getElementById('cancelSend').addEventListener('click', () => this.cancelSend());
        document.getElementById('attachmentInput').addEventListener('change', (e) => this.handleFileSelection(e));
        
        document.querySelectorAll('input[name="attachmentType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.toggleContactCardInputs(e);
                this.updateAttachmentOptions();
            });
        });

        // 为所有输入元素添加选择样式
        const allInputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
        allInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.style.setProperty('--selection-background', '#25d366', 'important');
                this.style.setProperty('--selection-color', '#fff', 'important');
            });
        });


        // Enable image pasting in chat content
        document.getElementById('messageContent').addEventListener('paste', (e) => this.handleImagePaste(e));

        // 添加联系人搜索功能
        document.getElementById('loadContacts').addEventListener('click', () => this.showContactModal());
    
        const modal = document.getElementById('contactModal');
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = () => {
            modal.style.display = "none";
        };
        
        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
        
        document.getElementById('contactSearch').addEventListener('input', (e) => this.searchContacts(e.target.value));
        
        document.getElementById('contactList').addEventListener('dblclick', (e) => {
            if (e.target.classList.contains('contact-item')) {
                this.selectContact(e.target.dataset.id, e.target.textContent);
                modal.style.display = "none";
            }
        });

        document.getElementById('addContact').addEventListener('click', () => this.addSelectedContact());

        // Update attachment options when type changes
        document.querySelectorAll('input[name="attachmentType"]').forEach(radio => {
            radio.addEventListener('change', () => this.updateAttachmentOptions());
        });

        // Create zoom overlay
        const zoomOverlay = document.createElement('div');
        zoomOverlay.id = 'zoomOverlay';
        const zoomImage = document.createElement('img');
        zoomImage.id = 'zoomImage';
        zoomOverlay.appendChild(zoomImage);
        document.body.appendChild(zoomOverlay);

        zoomOverlay.addEventListener('click', () => {
            zoomOverlay.style.display = 'none';
        });

        document.getElementById('recipientIds').addEventListener('change', (e) => {
            this.saveRecipients(this.parseRecipients(e.target.value));
        });

    },

    parseRecipients: function(input) {
        let recipients;
        
        // 尝试解析为JSON
        try {
            const parsed = JSON.parse(input);
            if (Array.isArray(parsed)) {
                recipients = parsed;
            }
        } catch (error) {
            // 如果不是有效的JSON，继续其他解析
        }
        
        // 如果不是JSON，则按换行和逗号分割
        if (!recipients) {
            recipients = input.split(/[\n,]+/);
        }
        
        // 清理每个接收者，移除空白
        return recipients
            .map(recipient => recipient.trim())
            .filter(recipient => recipient !== '');
    },

    formatRecipient: function(recipient) {
        // Check if it's already a valid WID or group ID
        if (recipient.endsWith('@c.us') || recipient.endsWith('@g.us')) {
            return recipient;
        }
        
        // Remove any non-digit characters
        const cleanNumber = recipient.replace(/\D/g, '');
        
        // If it's a group ID (15 or more digits)
        if (cleanNumber.length >= 15) {
            return `${cleanNumber}@g.us`;
        }
        
        // For phone numbers, just return the clean number
        return cleanNumber;
    },

    toggleContactCardInputs: function(e) {
        const contactCardInputs = document.getElementById('contactCardInputs');
        if (e.target.value === 'contact') {
            contactCardInputs.style.display = 'block';
            this.updateContactList();
        } else {
            contactCardInputs.style.display = 'none';
        }
    },

    boldText: function(text) {
        // 分割文本为段落
        const paragraphs = text.split('\n');
        // 对每个非空段落应用加粗
        return paragraphs.map(para => {
            para = para.trim();
            if (para !== '' && !para.startsWith('*') && !para.endsWith('*')) {
                // 如果段落不是代码块，则进行加粗
                if (!para.startsWith('```') && !para.endsWith('```')) {
                    return `*${para}*`;
                }
            }
            return para;
        }).join('\n');
    },

    handleFileSelection: function(e) {
        const files = e.target.files;
        const previewContainer = document.getElementById('attachmentPreview');
        previewContainer.innerHTML = ''; // 清空之前的预览
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            this.addFilePreview(file, previewContainer);
        }
    },

    addFilePreview: function(file, container) {
        const previewElement = document.createElement('div');
        previewElement.className = 'attachment-preview';
    
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.ondblclick = () => this.zoomImage(img.src);
            previewElement.appendChild(img);
        } else if (file.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(file);
            video.controls = true;
            previewElement.appendChild(video);
        } else if (file.type.startsWith('audio/')) {
            const audio = document.createElement('audio');
            audio.src = URL.createObjectURL(file);
            audio.controls = true;
            previewElement.appendChild(audio);
        } else {
            const fileNameElement = document.createElement('span');
            fileNameElement.textContent = file.name;
            previewElement.appendChild(fileNameElement);
        }
    
        // 添加移除按钮
        const removeButton = document.createElement('span');
        removeButton.className = 'remove-attachment';
        removeButton.textContent = '×';
        removeButton.onclick = (e) => {
            e.stopPropagation();
            this.removeAttachment(file);
        };
        previewElement.appendChild(removeButton);
    
        container.appendChild(previewElement);
    },

    removeAttachment: function(fileToRemove) {
        const input = document.getElementById('attachmentInput');
        const dt = new DataTransfer();
        const { files } = input;
    
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file !== fileToRemove) {
                dt.items.add(file);
            }
        }
    
        input.files = dt.files;
        this.updateAttachmentPreview();
    },

    updateAttachmentPreview: function() {
        const previewContainer = document.getElementById('attachmentPreview');
        previewContainer.innerHTML = '';
        const files = document.getElementById('attachmentInput').files;
        
        for (let i = 0; i < files.length; i++) {
            this.addFilePreview(files[i], previewContainer);
        }
    },

    zoomImage: function(src) {
        const overlay = document.getElementById('zoomOverlay');
        const image = document.getElementById('zoomImage');
        image.src = src;
        overlay.style.display = 'flex';
    },

    handleImagePaste: function(e) {
        const items = e.clipboardData.items;
        const input = document.getElementById('attachmentInput');
        const dt = new DataTransfer();
    
        // Add existing files
        for (let i = 0; i < input.files.length; i++) {
            dt.items.add(input.files[i]);
        }
    
        // Add new pasted files
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                dt.items.add(blob);
            }
        }
    
        input.files = dt.files;
        this.updateAttachmentPreview();
    },

    updateAttachmentOptions: function() {
        const attachmentType = document.querySelector('input[name="attachmentType"]:checked').value;
        document.getElementById('isViewOnce').parentElement.style.display = attachmentType === 'image' ? 'inline' : 'none';
        document.getElementById('useCaption').parentElement.style.display = ['image', 'video'].includes(attachmentType) ? 'inline' : 'none';
        document.getElementById('isPtt').parentElement.style.display = attachmentType === 'audio' ? 'inline' : 'none';
        document.getElementById('isPtv').parentElement.style.display = attachmentType === 'video' ? 'inline' : 'none';
    },

    addSelectedContact: function() {
        const contactId = document.getElementById('contactId').value;
        const contactName = document.getElementById('contactName').value;

        if (contactId && contactName) {
            const selectedContactsDiv = document.getElementById('selectedContacts');
            const contactElement = document.createElement('div');
            contactElement.innerHTML = `
                <span>${contactName} (${contactId})</span>
                <button class="remove-selected-contact">删除</button>
            `;
            contactElement.querySelector('.remove-selected-contact').addEventListener('click', () => {
                selectedContactsDiv.removeChild(contactElement);
            });
            selectedContactsDiv.appendChild(contactElement);

            // 清空输入框
            document.getElementById('contactId').value = '';
            document.getElementById('contactName').value = '';
        }
    },

    getSelectedContacts: function() {
        const selectedContactsDiv = document.getElementById('selectedContacts');
        const contactElements = selectedContactsDiv.querySelectorAll('div');
        return Array.from(contactElements).map(element => {
            const [name, id] = element.textContent.match(/(.+) \((.+)\)/).slice(1);
            return { id: id, name: name };
        });
    },

    showContactModal: function() {
        document.getElementById('contactModal').style.display = "block";
        this.updateContactList();
    },
    
    updateContactList: async function() {
        try {
            const allContacts = await WPP.contact.list();
            const contactMap = new Map();
    
            allContacts.forEach(contact => {
                if (contact.id && contact.id._serialized) {
                    const name = contact.name || contact.pushname || 'Unknown';
                    contactMap.set(name, contact);
                }
            });
    
            this.contacts = Array.from(contactMap.values());
    
            const contactList = document.getElementById('contactList');
            contactList.innerHTML = '';
            this.contacts.forEach((contact) => {
                const contactItem = document.createElement('div');
                contactItem.className = 'contact-item';
                contactItem.textContent = `${contact.name || contact.pushname || 'Unknown'}`;
                contactItem.dataset.id = contact.id._serialized;
                contactList.appendChild(contactItem);
            });
        } catch (error) {
            console.error('Failed to update contact list:', error);
        }
    },
    
    searchContacts: function(searchTerm) {
        const contactItems = document.querySelectorAll('#contactList .contact-item');
        contactItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
        });
    },
    
    selectContact: function(id, name) {
        document.getElementById('contactId').value = id;
        document.getElementById('contactName').value = name;
    },

    showToast: function(message, duration = 3000) {
        const toast = document.getElementById('toastNotification');
        toast.textContent = message;
        toast.style.display = 'block';
        toast.style.opacity = '1';

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.style.display = 'none';
            }, 500);
        }, duration);
    },

    sendMessage: async function() {
        document.getElementById('sendMessage').disabled = true;
        document.getElementById('sendMessage').textContent = '发送中...';
        const recipientInput = document.getElementById('recipientIds').value;
        const recipients = this.parseRecipients(recipientInput).map(this.formatRecipient);
        let message = document.getElementById('messageContent').value;
        const boldTextChecked = document.getElementById('boldText').checked;
        
        // 只在发送时应用加粗效果
        if (boldTextChecked) {
            message = this.boldText(message);
        }

        const attachmentInput = document.getElementById('attachmentInput');
        const attachmentType = document.querySelector('input[name="attachmentType"]:checked').value;
        const minDelay = parseInt(document.getElementById('minDelay').value);
        const maxDelay = parseInt(document.getElementById('maxDelay').value);
        const messageDelay = parseFloat(document.getElementById('messageDelay').value);
    
        const isViewOnce = document.getElementById('isViewOnce').checked;
        const useCaption = document.getElementById('useCaption').checked;
        const isPtt = document.getElementById('isPtt').checked;
        const isPtv = document.getElementById('isPtv').checked;
    
        let isCancelled = false;
        document.getElementById('cancelSend').style.display = 'inline-block';
        document.getElementById('cancelSend').onclick = () => {
            isCancelled = true;
        };
    
        for (let i = 0; i < recipients.length; i++) {
            if (isCancelled) {
                break;
            }
    
            const recipient = recipients[i];
            if (recipient) {
                try {
                    const sendOptions = {
                        delay: messageDelay * 1000, // Convert seconds to milliseconds
                        markIsRead: true
                    };
    
                    // Check if the chat exists before sending
                    try {
                        await WPP.chat.find(recipient);
                    } catch (error) {
                        console.error(`Chat not found for ${recipient}. Skipping this recipient.`);
                        continue;
                    }
    
                    if (attachmentType === 'contact') {
                        const selectedContacts = this.getSelectedContacts();
                        if (selectedContacts.length > 0) {
                            await WPP.chat.sendVCardContactMessage(recipient, selectedContacts.length === 1 ? selectedContacts[0] : selectedContacts);
                        }
                    } else if (attachmentInput.files.length > 0) {
                        for (let file of attachmentInput.files) {
                            const fileOptions = {
                                ...sendOptions,
                                type: attachmentType,
                                isViewOnce: isViewOnce,
                                caption: useCaption ? message : undefined,
                                isPtt: isPtt,
                                isPtv: isPtv
                            };
                            await WPP.chat.sendFileMessage(recipient, file, fileOptions);
                        }
                    }
                    
                    if (message && (!useCaption || attachmentInput.files.length === 0)) {
                        await WPP.chat.sendTextMessage(recipient, message, sendOptions);
                    }
    
                    this.updateSendProgress(i + 1, recipients.length);
                    await this.delay(this.randomBetween(minDelay, maxDelay) * 1000);
                } catch (error) {
                    console.error(`Failed to send message to ${recipient}:`, error);
                }
            } else {
                console.error(`Invalid recipient: ${recipients[i]}`);
            }
        }

        // 清空输入框和附件
        //document.getElementById('recipientIds').value = '';
        document.getElementById('messageContent').value = '';
        //document.getElementById('attachmentInput').value = '';
        this.updateAttachmentPreview(); // 清空附件预览
        
        // 重置联系人名片选择
        if (document.querySelector('input[name="attachmentType"]:checked').value === 'contact') {
            const selectedContactsDiv = document.getElementById('selectedContacts');
            selectedContactsDiv.innerHTML = '<h5>已选择的联系人：</h5>';
        }

    
        document.getElementById('cancelSend').style.display = 'none';
        document.getElementById('sendMessage').disabled = false;
        document.getElementById('sendMessage').textContent = '发送消息';
        this.showToast('消息发送完成');
    },

    cancelSend: function() {
        console.log('Cancelling message sending...');
    },

    loadSavedData: function() {
        const recipients = this.loadRecipients();
        document.getElementById('recipientIds').value = recipients.join('\n');
    
        const commonMessages = this.loadCommonMessages();
        this.updateCommonMessages(commonMessages);
    },
    
    updateCommonMessages: function(messages) {
        const container = document.getElementById('commonMessages');
        container.innerHTML = '';
        messages.forEach((message, index) => {
            const messageElement = document.createElement('div');
            messageElement.className = 'common-message';
            messageElement.innerHTML = `
                <span class="message-text">${message}</span>
                <span class="edit-icon">✎</span>
            `;
            messageElement.querySelector('.message-text').addEventListener('dblclick', () => this.insertCommonMessage(message));
            messageElement.querySelector('.edit-icon').addEventListener('click', (e) => {
                e.stopPropagation();
                this.editSingleCommonMessage(index);
            });
            container.appendChild(messageElement);
        });
    },
    
    editSingleCommonMessage: function(index) {
        const commonMessages = this.loadCommonMessages();
        const newMessage = prompt('编辑常用语:', commonMessages[index]);
        if (newMessage !== null) {
            commonMessages[index] = newMessage.trim();
            this.saveCommonMessages(commonMessages);
            this.updateCommonMessages(commonMessages);
        }
    },

    insertCommonMessage: function(message) {
        const messageContent = document.getElementById('messageContent');
        messageContent.value += (messageContent.value ? '\n' : '') + message;
    },

    saveRecipients: function(recipients) {
        localStorage.setItem('wa_js_recipients', JSON.stringify(recipients));
    },
    
    loadRecipients: function() {
        const savedRecipients = localStorage.getItem('wa_js_recipients');
        return savedRecipients ? JSON.parse(savedRecipients) : [];
    },
    
    saveCommonMessages: function(messages) {
        localStorage.setItem('wa_js_common_messages', JSON.stringify(messages));
    },
    
    loadCommonMessages: function() {
        const savedMessages = localStorage.getItem('wa_js_common_messages');
        return savedMessages ? JSON.parse(savedMessages) : ['Hello', 'How are you?', 'Thank you'];
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
        try {
            const contact = await WPP.contact.queryExists(`${cleanNumber}@c.us`);
            return contact.id._serialized;
        } catch (error) {
            console.error(`Failed to get chat ID for ${input}:`, error);
            return `${cleanNumber}@c.us`;
        }
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