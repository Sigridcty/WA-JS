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

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Copied to clipboard');
        alert('已复制到剪贴板');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('复制到剪贴板失败');
    });
}