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