'use strict';

class BeamHandler{
  constructor(url, options) {
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
  
  onConnection(msg){

  }
  
  onDisconnect(msg){
    
  }
  
  sendBeamTab(url){
    this.socket.emit('beam tab', {url: url});
    //TODO handle success from server, etc
  }
  
  incomingBeamCallback(tab){
    
  }
  
  onIncomingBeam(msg){
    console.log('incoming beam', msg.url);
    chrome.tabs.create({url: msg.url}, this.incomingBeamCallback);
  }
}

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

chrome.browserAction.setBadgeText({text: '\'Allo'});

console.log('\'Allo \'Allo! Event Page for Browser Action');

/**
 * Instantiate beamHandler to handle socket connections
 */

let beamHandler = new BeamHandler();

/**
 * Chrome runtime listeners
 * Messages sent from other parts of the extension will be received here
 */
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === 'beamTab'){
      let url = request.options.url;
      console.log('beaming tab', url);
      beamHandler.sendBeamTab(url);
      sendResponse({status: 'received'});
    }
  });