// ==UserScript==
// @name         WA-JS Interactive Panel
// @namespace    http://tampermonkey.net/
// @version      2.0.7
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

// @grant        none
// ==/UserScript==

/* globals WPP, WA_JS_Panel, GeneralFunctions, ChatFunctions, ContactFunctions, GroupFunctions */
(function() {
    'use strict';

    function initWhenReady() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const callback = function(mutationsList, observer) {
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    if (document.querySelector('#app')) {
                        observer.disconnect();
                        initializeScript();
                        break;
                    }
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    function initializeScript() {
        WPP.webpack.onReady(async function() {
            console.log('WPPConnect WA-JS is ready!');

            if (typeof WA_JS_Panel === 'undefined' ||
                typeof GeneralFunctions === 'undefined' ||
                typeof ChatFunctions === 'undefined' ||
                typeof ContactFunctions === 'undefined' ||
                typeof GroupFunctions === 'undefined') {
                console.error('One or more modules failed to load');
                return;
            }

            WA_JS_Panel.init();
            GeneralFunctions.init();
            ChatFunctions.init();
            ContactFunctions.init();
            GroupFunctions.init();
        });
    }

    window.addEventListener('load', initWhenReady);
})();