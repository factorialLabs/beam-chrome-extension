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
    value: function sendBeamTab(url) {
      this.socket.emit('beam tab', { url: url });
      //TODO handle success from server, etc
    }
  }, {
    key: 'incomingBeamCallback',
    value: function incomingBeamCallback(tab) {}
  }, {
    key: 'onIncomingBeam',
    value: function onIncomingBeam(msg) {
      console.log('incoming beam', msg.url);
      chrome.tabs.create({ url: msg.url }, this.incomingBeamCallback);
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
    var url = request.options.url;
    console.log('beaming tab', url);
    beamHandler.sendBeamTab(url);
    sendResponse({ status: 'received' });
  }
});
//# sourceMappingURL=background.js.map
