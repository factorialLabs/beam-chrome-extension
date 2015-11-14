'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BeamHandler = (function () {
  function BeamHandler(url, options) {
    _classCallCheck(this, BeamHandler);

    //Load settings
    this.settings = options;
  }

  _createClass(BeamHandler, [{
    key: 'connection',
    value: function connection(msg) {}
  }, {
    key: 'disconnect',
    value: function disconnect(msg) {}
  }, {
    key: 'incomingBeamCallback',
    value: function incomingBeamCallback(tab) {}
  }, {
    key: 'incomingBeam',
    value: function incomingBeam(msg) {
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

var beamHandler = new BeamHandler();
var socket = io.connect('http://localhost:3000/'); //replace with url later

socket.on('connection', beamHandler.connection);
socket.on('incoming beam', beamHandler.incomingBeam);
socket.on('disconnect', beamHandler.disconnect);
//# sourceMappingURL=background.js.map
