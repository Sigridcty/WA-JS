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
                    top: 60px;
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

                #wa-js-main-button {
                    width: 20px;
                    height: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 8px;
                }
                #wa-js-main-button svg {
                    width: 100%;
                    height: 100%;
                }
            `;
            document.head.appendChild(style);
        },

        createMainButton: function() {
            const mainButton = document.createElement('div');
            mainButton.id = 'wa-js-main-button';
            mainButton.innerHTML = `
                <svg viewBox="0 0 32 32" width="32" height="32">
                    <path fill="#25D366" d="M23.328 17.707c-.289-.144-1.715-.844-1.981-.939-.265-.096-.459-.144-.653.144-.193.287-.75.939-.919 1.132-.168.193-.336.217-.625.072-.288-.144-1.219-.45-2.323-1.434-.858-.764-1.438-1.709-1.607-1.997-.168-.287-.018-.442.127-.586.129-.129.288-.336.433-.504.144-.168.192-.288.288-.48.096-.193.048-.361-.024-.505-.072-.143-.653-1.574-.896-2.157-.241-.571-.482-.494-.653-.504-.168-.01-.361-.01-.554-.01-.191 0-.504.072-.766.36-.263.287-1.007.985-1.007 2.399 0 1.415 1.031 2.781 1.175 2.973.144.192 2.027 3.095 4.909 4.342 2.885 1.247 2.885.831 3.406.779.52-.052 1.682-.686 1.92-1.349.24-.662.24-1.229.168-1.349-.072-.12-.266-.191-.555-.336z"/>
                    <path fill="#25D366" d="M16.05.941C7.516.94.623 7.833.622 16.367c0 2.987.852 5.899 2.459 8.407L.613 31.058l6.483-2.402a15.411 15.411 0 007.385 2.24h.006c8.534 0 15.427-6.892 15.429-15.427 0-4.121-1.605-7.995-4.52-10.912C22.483 1.641 18.612.036 16.05.941zm7.307 21.82c-.368.634-2.174 1.262-2.986 1.3-.812.037-1.566.367-5.207-1.074-4.389-1.748-7.112-6.116-7.326-6.397-.214-.281-1.764-2.304-1.764-4.4 0-2.095 1.12-3.106 1.488-3.513.368-.408.807-.512 1.074-.512.27 0 .538 0 .773.018.25.015.547.025.821.638.32.717 1.092 2.489 1.187 2.667.094.179.154.383.028.614-.128.23-.192.371-.371.576-.18.204-.377.455-.538.612-.18.172-.366.359-.158.704.209.343.914 1.478 1.974 2.399 1.364 1.187 2.506 1.56 2.875 1.732.371.17.576.141.785-.089.214-.23.894-1.037 1.127-1.39.232-.357.468-.294.786-.18.32.115 2.023.95 2.368 1.121.345.17.576.255.67.397.095.141.095.806-.273 1.577z"/>
                </svg>
            `;
            mainButton.style.position = 'fixed';
            mainButton.style.top = '12px';
            mainButton.style.right = '105px';
            mainButton.style.zIndex = '1000';
            mainButton.style.cursor = 'pointer';
            mainButton.style.borderRadius = '50%';
            mainButton.style.backgroundColor = 'white';
            mainButton.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)';
            mainButton.style.transition = 'all 0.3s cubic-bezier(.25,.8,.25,1)';
            mainButton.addEventListener('click', this.togglePanel);
            mainButton.addEventListener('mouseover', function() {
                this.style.boxShadow = '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)';
            });
            mainButton.addEventListener('mouseout', function() {
                this.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)';
            });
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
                <h3>WA-Sigrid</h3>
                
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
        
            // Show the chat tab by default
            this.toggleSection('chatFunctions');
            document.getElementById('chatTab').classList.add('active');
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