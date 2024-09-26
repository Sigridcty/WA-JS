// ==UserScript==
// @name         WA-JS Interactive Panel
// @namespace    http://tampermonkey.net/
// @version      2.0.8
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
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    function initializePanel() {
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

        WA_JS_Panel.init();
        GeneralFunctions.init();
        ChatFunctions.init();
        ContactFunctions.init();
        GroupFunctions.init();
        CommunityFunctions.init();
    }

    // Wait for WhatsApp Web to fully load
    waitForElement('div[data-asset-intro-image-light]').then(() => {
        // Wait for WPP to be ready
        WPP.webpack.onReady(async function() {
            console.log('WPPConnect WA-JS is ready!');
            initializePanel();
        });
    });
})();