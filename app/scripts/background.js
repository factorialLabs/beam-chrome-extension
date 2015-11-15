'use strict';

class BeamHandler{
  constructor(token, options) {
    //Load settings
    console.log(token)
    this.settings = options;
    this.socket = io.connect('http://localhost:3000/', {'force new connection' : true, reconnect : false}); //replace with url later
    let that = this;
    this.socket.on('connect', function (socket) {
      /**
      * Handle login
      */
      that.socket.emit('authenticate', {token: token}); //send the jwt
    });

    this.socket.on('authenticated', function (socket) {
      
    });

   /**
    * Socket.io listeners
    * Handle messages received from socket server
    */
    this.socket.on('incoming beam', that.onIncomingBeam);
    this.socket.on('disconnect', that.onDisconnect);

    this.socket.on("unauthorized", function(error) {
        console.error("Error", error.message);
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

var user = {
  email: 'dvhua@uwaterloo.ca',
  password: 'password'  
};

let beamHandler;

var logger = $.post( "http://localhost:3000/api/login/", user)
  .done(function(res) {
    console.log('logged in');
    let token = res.token;
    beamHandler = new BeamHandler(token);
  })
  .fail(function(err) {
    console.error( "login error", err);
  });


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