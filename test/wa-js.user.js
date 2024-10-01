// ==UserScript==
// @name         WA-JS Interactive Panel
// @namespace    http://tampermonkey.net/
// @version      2.2.2
// @description  Interactive panel for WA-JS functionality using wppconnect-wa.js
// @author       Sigrid
// @match        https://web.whatsapp.com/*
// @icon         https://www.google.com/s2/favicons?domain=whatsapp.com
// @require      https://github.com/Sigridcty/WA-JS/releases/download/wa/wppconnect-wa.js
// @require      https://github.com/Sigridcty/WA-JS/releases/download/wa/wa-js-panel-core.js
// @require      https://github.com/Sigridcty/WA-JS/releases/download/wa/wa-js-panel-general-functions.js
// @require      https://github.com/Sigridcty/WA-JS/releases/download/wa/wa-js-panel-chat-functions.js
// @require      https://github.com/Sigridcty/WA-JS/releases/download/wa/wa-js-panel-contact-functions.js
// @require      https://github.com/Sigridcty/WA-JS/releases/download/wa/wa-js-panel-group-functions.js
// @require      https://github.com/Sigridcty/WA-JS/releases/download/wa/wa-js-panel-community-functions.js
// @grant        none
// ==/UserScript==

/* globals WPP, WA_JS_Panel, GeneralFunctions, ChatFunctions, ContactFunctions, GroupFunctions, CommunityFunctions */
(function() {
    'use strict';

    function waitForElement(selector) {
        return new Promise(resolve => {
            const check = () => {
                if (document.querySelector(selector) && window.WPP && WPP.isReady) {
                    resolve(document.querySelector(selector));
                } else {
                    requestAnimationFrame(check);
                }
            };
            check();
        });
    }

    async function initializePanel() {
        console.log('Initializing WA_JS_Panel...');
        if (typeof WA_JS_Panel === 'undefined' ||
            typeof GeneralFunctions === 'undefined' ||
            typeof ChatFunctions === 'undefined' ||
            typeof ContactFunctions === 'undefined' ||
            typeof GroupFunctions === 'undefined' ||
            typeof CommunityFunctions === 'undefined') {
            console.error('One or more modules failed to load');
            return;
        }
    
        try {
            // 初始化各个模块
            WA_JS_Panel.init();
            GeneralFunctions.init();
            await ChatFunctions.init(); 
            ContactFunctions.init();
            GroupFunctions.init();
            CommunityFunctions.init();
        } catch (error) {
            console.error("Error during initialization:", error);
        }
    }

    // 等待 WhatsApp Web 完全加载并且 WPP 准备就绪
    waitForElement('div[data-asset-intro-image-light]').then(() => {
        console.log('WhatsApp Web has loaded and WPP is ready. Initializing...');
        initializePanel();
    });
})();