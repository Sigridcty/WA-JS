// Core module for WA-JS Panel
(function(global) {
    const WA_JS_Panel = {
        init: function() {
            this.addGlobalStyles();
            this.createMainButton();
        },

        addGlobalStyles: function() {
            const style = document.createElement('style');
            style.textContent = `
                #wa-js-panel {
                    font-family: Arial, sans-serif;
                    background-color: #f0f0f0;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    position: fixed;
                    top: 50px;
                    right: 10px;
                    width: 400px;
                    z-index: 1000;
                }
                #wa-js-panel h3 {
                    color: #075e54;
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 10px;
                    margin-top: 0;
                }
                #wa-js-panel button {
                    background-color: #25d366;
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    margin: 5px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                #wa-js-panel button:hover {
                    background-color: #128c7e;
                }
                .tabContent {
                    background-color: white;
                    padding: 15px;
                    border-radius: 0 0 8px 8px;
                }
                #tabButtons {
                    display: flex;
                    justify-content: space-between;
                    background-color: #075e54;
                    border-radius: 8px 8px 0 0;
                    overflow: hidden;
                }
                #tabButtons button {
                    flex-grow: 1;
                    background-color: transparent;
                    color: white;
                    border: none;
                    padding: 10px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                #tabButtons button:hover,
                #tabButtons button.active {
                    background-color: #128c7e;
                }
            `;
            document.head.appendChild(style);
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
            panel.innerHTML = `
                <h3>WA-JS Panel</h3>
                
                <div id="tabButtons">
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
                button.addEventListener('click', (e) => {
                    this.toggleSection(button.id.replace('Tab', 'Functions'));
                    // Add active class to clicked button
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');
                });
            });

            // Initialize modules
            GeneralFunctions.init();
            ChatFunctions.init();
            ContactFunctions.init();
            GroupFunctions.init();

            // Show the first tab by default
            this.toggleSection('generalFunctions');
            document.getElementById('generalTab').classList.add('active');
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

    // Expose WA_JS_Panel to the global scope
    global.WA_JS_Panel = WA_JS_Panel;
})(typeof window !== 'undefined' ? window : this);