// Core module for WA-JS Panel
const WA_JS_Panel = {
    init: function() {
        window.addEventListener('load', function() {
            WPP.webpack.onReady(async function() {
                console.log('WPPConnect WA-JS is ready!');
                WA_JS_Panel.createMainButton();
            });
        });
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
        mainButton.addEventListener('click', WA_JS_Panel.togglePanel);
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
        WA_JS_Panel.initializePanelFunctions();
    },

    initializePanelFunctions: function() {
        const tabButtons = document.querySelectorAll('.tabButton');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => WA_JS_Panel.toggleSection(button.id.replace('Tab', 'Functions')));
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

// Initialize the panel
WA_JS_Panel.init();