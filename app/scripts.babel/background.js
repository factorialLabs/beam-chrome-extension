'use strict';

class BeamHandler{
  constructor(url, options) {
    //Load settings
    this.settings = options;
  }
  
  connection(msg){

  }
  
  disconnect(msg){
    
  }
  
  incomingBeamCallback(tab){
    
  }
  
  incomingBeam(msg){
    console.log('incoming beam', msg.url);
    chrome.tabs.create({url: msg.url}, this.incomingBeamCallback);
  }
}

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

chrome.browserAction.setBadgeText({text: '\'Allo'});

console.log('\'Allo \'Allo! Event Page for Browser Action');

let beamHandler = new BeamHandler();
let socket = io.connect('http://localhost:3000/'); //replace with url later

socket.on('connection', beamHandler.connection);
socket.on('incoming beam', beamHandler.incomingBeam);
socket.on('disconnect', beamHandler.disconnect);