// ==UserScript==
// @name         WA-JS Interactive Panel
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Interactive panel for WA-JS functionality using wppconnect-wa.js
// @author       Your Name
// @match        https://web.whatsapp.com/*
// @icon         https://www.google.com/s2/favicons?domain=whatsapp.com
// @require      https://github.com/wppconnect-team/wa-js/releases/download/nightly/wppconnect-wa.js
// @require      https://raw.githubusercontent.com/Sigridcty/WA-JS/main/test/wa-js-panel-core.js
// @require      https://raw.githubusercontent.com/Sigridcty/WA-JS/main/test/wa-js-panel-general-functions.js
// @require      https://raw.githubusercontent.com/Sigridcty/WA-JS/main/test/wa-js-panel-chat-functions.js
// @require      https://raw.githubusercontent.com/Sigridcty/WA-JS/main/test/wa-js-panel-contact-functions.js
// @require      https://raw.githubusercontent.com/Sigridcty/WA-JS/main/test/wa-js-panel-group-functions.js

// @grant        none
// ==/UserScript==

/* globals WPP, WA_JS_Panel, GeneralFunctions, ChatFunctions, ContactFunctions, GroupFunctions */
(function() {
    'use strict';

    // Wait for WhatsApp Web to fully load
    window.addEventListener('load', function() {
        // Wait for WPP to be ready
        WPP.webpack.onReady(async function() {
            console.log('WPPConnect WA-JS is ready!');

            // Check if all modules are loaded
            if (typeof WA_JS_Panel === 'undefined' ||
                typeof GeneralFunctions === 'undefined' ||
                typeof ChatFunctions === 'undefined' ||
                typeof ContactFunctions === 'undefined' ||
                typeof GroupFunctions === 'undefined') {
                console.error('One or more modules failed to load');
                return;
            }

            // Initialize the panel
            WA_JS_Panel.init();

            // Initialize all function modules
            GeneralFunctions.init();
            ChatFunctions.init();
            ContactFunctions.init();
            GroupFunctions.init();
        });
    });
})();