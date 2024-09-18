// Contact Functions module
const ContactFunctions = {
    init: function() {
        const htmlContent = `
            <h4>联系人功能</h4>
            <button id="getContact">获取联系人详情</button>
            <button id="blockContact">屏蔽联系人</button>
            <button id="unblockContact">取消屏蔽联系人</button>
            <button id="listAllContacts">获取所有联系人</button>
            <button id="getContactPhoneNumbers">获取所有联系人电话号码</button>
        `;
        WA_JS_Panel.addFunctionToPanel('contact', htmlContent);
        this.bindEvents();
    },

    bindEvents: function() {
        document.getElementById('getContact').addEventListener('click', this.getContact);
        document.getElementById('blockContact').addEventListener('click', this.blockContact);
        document.getElementById('unblockContact').addEventListener('click', this.unblockContact);
        document.getElementById('listAllContacts').addEventListener('click', this.listAllContacts);
        document.getElementById('getContactPhoneNumbers').addEventListener('click', this.getContactPhoneNumbers);
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

    listAllContacts: async function() {
        try {
            const allContacts = await WPP.contact.list();
            const filteredContacts = allContacts
                .filter(contact => contact.id.user.endsWith('@c.us'))
                .reduce((acc, current) => {
                    const x = acc.find(item => item.id._serialized === current.id._serialized);
                    if (!x) {
                        return acc.concat([current]);
                    } else {
                        return acc;
                    }
                }, []);
            console.log('所有联系人:', filteredContacts);
            alert('所有联系人已在控制台输出');
        } catch (error) {
            console.error('获取所有联系人失败:', error);
            alert('获取所有联系人失败');
        }
    },

    getContactPhoneNumbers: async function() {
        try {
            const allContacts = await WPP.contact.list();
            const phoneNumbers = allContacts
                .filter(contact => contact.id.user.endsWith('@c.us'))
                .reduce((acc, current) => {
                    const x = acc.find(item => item.id._serialized === current.id._serialized);
                    if (!x) {
                        return acc.concat([{
                            name: current.name || current.pushname || 'Unknown',
                            number: current.id.user.replace('@c.us', '')
                        }]);
                    } else {
                        return acc;
                    }
                }, []);
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
            const allContacts = await WPP.contact.list();
            const filteredContacts = allContacts
                .filter(contact => contact.id.user.endsWith('@c.us'))
                .reduce((acc, current) => {
                    const x = acc.find(item => item.id === current.id);
                    if (!x) {
                        return acc.concat([current]);
                    } else {
                        return acc;
                    }
                }, []);
            const contactListElement = document.getElementById('contactList');
            contactListElement.innerHTML = filteredContacts.map(contact => 
                `<div><input type="checkbox" value="${contact.id.user}">${contact.name || contact.pushname || contact.id.user}</div>`
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