'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.browserAction.setBadgeText({ text: '\'Allo' });

console.log('\'Allo \'Allo! Event Page for Browser Action');

var socket = io.connect('http://localhost:3000/');
socket.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});
//# sourceMappingURL=background.js.map
