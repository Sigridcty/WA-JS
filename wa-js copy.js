// ==UserScript==
// @name         WA-JS Interactive Panel
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Interactive panel for WA-JS functionality using wppconnect-wa.js
// @author       Your Name
// @match        https://web.whatsapp.com/*
// @icon         https://www.google.com/s2/favicons?domain=whatsapp.com
// @require      https://github.com/wppconnect-team/wa-js/releases/download/nightly/wppconnect-wa.js
// @grant        none
// ==/UserScript==

/* globals WPP */
(function() {
    'use strict';

    // Core module for WA-JS Panel
    const WA_JS_Panel = {
        init: function() {
            this.createMainButton();
        },

        createMainButton: function() {
            const mainButton = document.createElement('button');
            mainButton.textContent = 'WA-JS Panel';
            mainButton.style.position = 'fixed';
            mainButton.style.top = '10px';
            mainButton.style.right = '10px';
            mainButton.style.zIndex = '1000';
            mainButton.style.backgroundColor = '#25D366';
            mainButton.style.color = 'white';
            mainButton.style.border = 'none';
            mainButton.style.padding = '10px 20px';
            mainButton.style.borderRadius = '5px';
            mainButton.style.cursor = 'pointer';
            mainButton.addEventListener('click', this.togglePanel);
            document.body.appendChild(mainButton);
        },

        togglePanel: function() {
            const panel = document.getElementById('wa-js-panel');
            if (panel) {
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            } else {
                WA_JS_Panel.createPanel();
            }
        },

        createPanel: function() {
            const panel = document.createElement('div');
            panel.id = 'wa-js-panel';
            panel.style.position = 'fixed';
            panel.style.top = '50px';
            panel.style.right = '10px';
            panel.style.width = '400px';
            panel.style.backgroundColor = 'white';
            panel.style.border = '1px solid #ccc';
            panel.style.padding = '10px';
            panel.style.zIndex = '1000';
            panel.style.display = 'block';
            panel.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            panel.style.borderRadius = '5px';
            panel.innerHTML = `
                <h3 style="margin-top: 0;">WA-JS Panel</h3>
                
                <div id="tabButtons" style="margin-bottom: 10px;">
                    <button id="generalTab" class="tabButton">通用功能</button>
                    <button id="chatTab" class="tabButton">聊天功能</button>
                    <button id="contactTab" class="tabButton">联系人功能</button>
                    <button id="groupTab" class="tabButton">群组功能</button>
                </div>

                <div id="functionContainer"></div>
            `;
            document.body.appendChild(panel);
            this.initializePanelFunctions();
        },

        initializePanelFunctions: function() {
            const tabButtons = document.querySelectorAll('.tabButton');
            tabButtons.forEach(button => {
                button.addEventListener('click', () => this.toggleSection(button.id.replace('Tab', 'Functions')));
            });

            // Initialize modules
            GeneralFunctions.init();
            ChatFunctions.init();
            ContactFunctions.init();
            GroupFunctions.init();
        },

        toggleSection: function(sectionId) {
            const sections = document.querySelectorAll('.tabContent');
            sections.forEach(section => {
                section.style.display = section.id === sectionId ? 'block' : 'none';
            });
        },

        addFunctionToPanel: function(moduleName, htmlContent) {
            const container = document.getElementById('functionContainer');
            const div = document.createElement('div');
            div.id = `${moduleName}Functions`;
            div.className = 'tabContent';
            div.style.display = 'none';
            div.innerHTML = htmlContent;
            container.appendChild(div);
        }
    };



    // General Functions module
    const GeneralFunctions = {
        init: function() {
            const htmlContent = `
                <h4>通用功能</h4>
                <button id="connect">连接</button>
                <button id="isAuthenticated">检查认证</button>
                <button id="logout">登出</button>
            `;
            WA_JS_Panel.addFunctionToPanel('general', htmlContent);
            this.bindEvents();
        },

        bindEvents: function() {
            document.getElementById('connect').addEventListener('click', this.connect);
            document.getElementById('isAuthenticated').addEventListener('click', this.isAuthenticated);
            document.getElementById('logout').addEventListener('click', this.logout);
        },

        connect: async function() {
            try {
                await WPP.conn.connect();
                alert('连接成功');
            } catch (error) {
                console.error('连接失败:', error);
                alert('连接失败');
            }
        },

        isAuthenticated: async function() {
            try {
                const authenticated = await WPP.conn.isAuthenticated();
                alert(`认证状态: ${authenticated}`);
            } catch (error) {
                console.error('检查认证失败:', error);
                alert('检查认证失败');
            }
        },

        logout: async function() {
            try {
                await WPP.conn.logout();
                alert('登出成功');
            } catch (error) {
                console.error('登出失败:', error);
                alert('登出失败');
            }
        }
    };


    // Chat Functions module
    const ChatFunctions = {
        init: function() {
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



    // Contact Functions module
    const ContactFunctions = {
        init: function() {
            const htmlContent = `
                <h4>联系人功能</h4>
                <div id="contactList" style="max-height: 200px; overflow-y: auto;"></div>
                <button id="getContact">获取联系人详情</button>
                <button id="blockContact">屏蔽联系人</button>
                <button id="unblockContact">取消屏蔽联系人</button>
                <button id="getAllContacts">获取所有联系人</button>
                <button id="getContactPhoneNumbers">获取所有联系人电话号码</button>
                <button id="copySelectedContacts">复制选中的联系人</button>
            `;
            WA_JS_Panel.addFunctionToPanel('contact', htmlContent);
            this.bindEvents();
            this.populateContactList();
        },

        bindEvents: function() {
            document.getElementById('getContact').addEventListener('click', this.getContact);
            document.getElementById('blockContact').addEventListener('click', this.blockContact);
            document.getElementById('unblockContact').addEventListener('click', this.unblockContact);
            document.getElementById('getAllContacts').addEventListener('click', this.getAllContacts);
            document.getElementById('getContactPhoneNumbers').addEventListener('click', this.getContactPhoneNumbers);
            document.getElementById('copySelectedContacts').addEventListener('click', this.copySelectedContacts);
        },

        getContact: async function() {
            const contactId = prompt('请输入联系人ID:');
            if (contactId) {
                try {
                    const contact = await WPP.contact.get(contactId);
                    console.log('联系人详情:', contact);
                    alert('联系人详情已在控制台输出');
                } catch (error) {
                    console.error('获取联系人详情失败:', error);
                    alert('获取联系人详情失败');
                }
            }
        },

        blockContact: async function() {
            const contactId = prompt('请输入联系人ID:');
            if (contactId) {
                try {
                    await WPP.contact.block(contactId);
                    alert('联系人已屏蔽');
                } catch (error) {
                    console.error('屏蔽联系人失败:', error);
                    alert('屏蔽联系人失败');
                }
            }
        },

        unblockContact: async function() {
            const contactId = prompt('请输入联系人ID:');
            if (contactId) {
                try {
                    await WPP.contact.unblock(contactId);
                    alert('联系人已取消屏蔽');
                } catch (error) {
                    console.error('取消屏蔽联系人失败:', error);
                    alert('取消屏蔽联系人失败');
                }
            }
        },

        getAllContacts: async function() {
            try {
                const contacts = await WPP.contact.list();
                console.log('所有联系人:', contacts);
                alert('所有联系人已在控制台输出');
            } catch (error) {
                console.error('获取所有联系人失败:', error);
                alert('获取所有联系人失败');
            }
        },

        getContactPhoneNumbers: async function() {
            try {
                const contacts = await WPP.contact.list();
                const phoneNumbers = contacts.map(contact => ({
                    name: contact.name || contact.pushname || 'Unknown',
                    number: contact.id.user
                }));
                console.log('联系人电话号码:', phoneNumbers);
                copyToClipboard(JSON.stringify(phoneNumbers, null, 2));
                alert('联系人电话号码已复制到剪贴板并在控制台输出');
            } catch (error) {
                console.error('获取联系人电话号码失败:', error);
                alert('获取联系人电话号码失败');
            }
        },

        populateContactList: async function() {
            try {
                const contacts = await WPP.contact.list();
                const contactListElement = document.getElementById('contactList');
                contactListElement.innerHTML = contacts.map(contact => 
                    `<div><input type="checkbox" value="${contact.id}">${contact.name || contact.id.user}</div>`
                ).join('');
            } catch (error) {
                console.error('加载联系人列表失败:', error);
                alert('加载联系人列表失败');
            }
        },

        copySelectedContacts: function() {
            const selectedContacts = Array.from(document.querySelectorAll('#contactList input[type="checkbox"]:checked'))
                .map(checkbox => checkbox.value);
            copyToClipboard(JSON.stringify(selectedContacts, null, 2));
        }
    };

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard');
            alert('已复制到剪贴板');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('复制到剪贴板失败');
        });
    }



    // Group Functions module
    const GroupFunctions = {
        init: function() {
            const htmlContent = `
                <h4>群组功能</h4>
                <div id="groupList" style="max-height: 200px; overflow-y: auto;"></div>
                <button id="createGroup">创建群组</button>
                <button id="addParticipant">添加成员</button>
                <button id="removeParticipant">移除成员</button>
                <button id="promoteParticipant">提升为管理员</button>
                <button id="demoteParticipant">降级为成员</button>
                <button id="getGroupInfo">获取群组信息</button>
                <button id="getAllGroups">获取所有群组ID</button>
                <button id="copySelectedGroups">复制选中的群组</button>
            `;
            WA_JS_Panel.addFunctionToPanel('group', htmlContent);
            this.bindEvents();
            this.populateGroupList();
        },

        bindEvents: function() {
            document.getElementById('createGroup').addEventListener('click', this.createGroup);
            document.getElementById('addParticipant').addEventListener('click', this.addParticipant);
            document.getElementById('removeParticipant').addEventListener('click', this.removeParticipant);
            document.getElementById('promoteParticipant').addEventListener('click', this.promoteParticipant);
            document.getElementById('demoteParticipant').addEventListener('click', this.demoteParticipant);
            document.getElementById('getGroupInfo').addEventListener('click', this.getGroupInfo);
            document.getElementById('getAllGroups').addEventListener('click', this.getAllGroups);
            document.getElementById('copySelectedGroups').addEventListener('click', this.copySelectedGroups);
        },

        createGroup: async function() {
            const groupName = prompt('请输入群组名称:');
            const participantIds = prompt('请输入成员ID（用逗号分隔）:').split(',');
            if (groupName && participantIds.length > 0) {
                try {
                    const group = await WPP.group.create(groupName, participantIds);
                    console.log('群组创建成功:', group);
                    alert('群组创建成功');
                } catch (error) {
                    console.error('群组创建失败:', error);
                    alert('群组创建失败');
                }
            }
        },

        addParticipant: async function() {
            const groupId = prompt('请输入群组ID:');
            const participantId = prompt('请输入成员ID:');
            if (groupId && participantId) {
                try {
                    await WPP.group.addParticipants(groupId, [participantId]);
                    alert('成员添加成功');
                } catch (error) {
                    console.error('添加成员失败:', error);
                    alert('添加成员失败');
                }
            }
        },

        removeParticipant: async function() {
            const groupId = prompt('请输入群组ID:');
            const participantId = prompt('请输入成员ID:');
            if (groupId && participantId) {
                try {
                    await WPP.group.removeParticipants(groupId, [participantId]);
                    alert('成员移除成功');
                } catch (error) {
                    console.error('移除成员失败:', error);
                    alert('移除成员失败');
                }
            }
        },

        promoteParticipant: async function() {
            const groupId = prompt('请输入群组ID:');
            const participantId = prompt('请输入成员ID:');
            if (groupId && participantId) {
                try {
                    await WPP.group.promoteParticipants(groupId, [participantId]);
                    alert('成员提升为管理员成功');
                } catch (error) {
                    console.error('提升成员为管理员失败:', error);
                    alert('提升成员为管理员失败');
                }
            }
        },

        demoteParticipant: async function() {
            const groupId = prompt('请输入群组ID:');
            const participantId = prompt('请输入成员ID:');
            if (groupId && participantId) {
                try {
                    await WPP.group.demoteParticipants(groupId, [participantId]);
                    alert('成员降级为成员成功');
                } catch (error) {
                    console.error('降级成员为成员失败:', error);
                    alert('降级成员为成员失败');
                }
            }
        },

        getGroupInfo: async function() {
            const groupId = prompt('请输入群组ID:');
            if (groupId) {
                try {
                    const groupInfo = await WPP.group.getInfo(groupId);
                    console.log('群组信息:', groupInfo);
                    alert('群组信息已在控制台输出');
                } catch (error) {
                    console.error('获取群组信息失败:', error);
                    alert('获取群组信息失败');
                }
            }
        },

        getAllGroups: async function() {
            try {
                const groups = await WPP.group.getAllGroups();
                const groupIds = groups.map(group => group.id);
                console.log('所有群组ID:', groupIds);
                copyToClipboard(JSON.stringify(groupIds, null, 2));
                alert('所有群组ID已复制到剪贴板并在控制台输出');
            } catch (error) {
                console.error('获取所有群组ID失败:', error);
                alert('获取所有群组ID失败');
            }
        },

        populateGroupList: async function() {
            try {
                const groups = await WPP.group.getAllGroups();
                const groupListElement = document.getElementById('groupList');
                groupListElement.innerHTML = groups.map(group => 
                    `<div><input type="checkbox" value="${group.id}">${group.name}</div>`
                ).join('');
            } catch (error) {
                console.error('加载群组列表失败:', error);
                alert('加载群组列表失败');
            }
        },

        copySelectedGroups: function() {
            const selectedGroups = Array.from(document.querySelectorAll('#groupList input[type="checkbox"]:checked'))
                .map(checkbox => checkbox.value);
            copyToClipboard(JSON.stringify(selectedGroups, null, 2));
        }
    };


    // Wait for WhatsApp Web to fully load
    window.addEventListener('load', function() {
        // Wait for WPP to be ready
        WPP.webpack.onReady(async function() {
            console.log('WPPConnect WA-JS is ready!');
            WA_JS_Panel.init();
        });
    });
})();