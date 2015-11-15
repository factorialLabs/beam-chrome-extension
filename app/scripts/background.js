'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BeamHandler = (function () {
  function BeamHandler(url, options) {
    _classCallCheck(this, BeamHandler);

    //Load settings
    this.settings = options;
    this.socket = io.connect('http://localhost:3000/'); //replace with url later
    /**
    * Socket.io listeners
    * Handle messages received from socket server
    */
    this.socket.on('connection', this.onConnection);
    this.socket.on('incoming beam', this.onIncomingBeam);
    this.socket.on('disconnect', this.onDisconnect);
  }

  _createClass(BeamHandler, [{
    key: 'onConnection',
    value: function onConnection(msg) {}
  }, {
    key: 'onDisconnect',
    value: function onDisconnect(msg) {}
  }, {
    key: 'sendBeamTab',
    value: function sendBeamTab(data) {
      console.log("beaming", data);
      this.socket.emit('beam tab', data);
      //TODO handle success from server, etc
    }
  }, {
    key: 'onIncomingBeam',
    value: function onIncomingBeam(data) {
      chrome.tabs.create({ url: data.url }, function (tab) {
        // Now in the context of the (new) beamed tab.
        var message = _.extend({
          action: "showMessage"
        }, data);
        console.log("Message sent to content script:", message);
        if (message.message) {
          window.setTimeout(function () {
            chrome.tabs.sendMessage(tab.id, message, function (response) {
              console.log(response.status);
            });
          }, 2000);
        }
      });
    }
  }]);

  return BeamHandler;
})();

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.browserAction.setBadgeText({ text: '\'Allo' });

console.log('\'Allo \'Allo! Event Page for Browser Action');

/**
 * Instantiate beamHandler to handle socket connections
 */

var beamHandler = new BeamHandler();

/**
 * Chrome runtime listeners
 * Messages sent from other parts of the extension will be received here
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'beamTab') {
    console.log('beaming tab', request.data.url);
    beamHandler.sendBeamTab(request.data);
    sendResponse({ status: 'received' });
  }
});
//# sourceMappingURL=background.js.map
