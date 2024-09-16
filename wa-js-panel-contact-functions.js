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