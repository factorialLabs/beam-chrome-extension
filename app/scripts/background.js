'use strict';

class BeamHandler{
  constructor(url, options) {
    //Load settings
    this.settings = options;
    this.socket = io.connect('http://localhost:3000/'); //replace with url later
    let that = this;
    this.socket.on('connect', function (socket) {
      /**
      * Handle login
      */
      that.socket.on('authenticated', function (socket) {
        /**
        * Socket.io listeners
        * Handle messages received from socket server
        */
        that.socket.on('incoming beam', that.onIncomingBeam);
        that.socket.on('disconnect', that.onDisconnect);
      })
      .emit('authenticate', {token: 'eyJ0eXAiOiJKV1QiLCJhbGdciOiJIUzI1NiJ9.eyJlbWFpbCI6ImhvdXl1Y2hlbjY2QGdtYWlsLmNvbSJ9.CfH4hvDUujgVaaDI_pYi51C26hM92v0iDA_hWpMFMr4'}); //send the jwt

      that.socket.on("unauthorized", function(error) {
          console.error("Error", error.message);
      });
    });
  }
  
  onConnection(msg){

  }
  
  onDisconnect(msg){
    
  }
  
  sendBeamTab(data){
    console.log("beaming", data);
    this.socket.emit('beam tab', data);
    //TODO handle success from server, etc
  }

  
  onIncomingBeam(data){
    chrome.tabs.create({url: data.url}, function(tab){
      // Now in the context of the (new) beamed tab. 
      var message = _.extend({
        action: "showMessage"
      }, data)
      console.log("Message sent to content script:", message);
      if (message.message){
        window.setTimeout(function() { 
              chrome.tabs.sendMessage(tab.id, message, function(response){
                console.log(response.status);
              }); 
           }, 2000);

      }
    });
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
      console.log('beaming tab', request.data.url);
      beamHandler.sendBeamTab(request.data);
      sendResponse({status: 'received'});
    }
  });