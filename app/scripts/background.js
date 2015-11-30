'use strict';
class BeamHandler{
  constructor(token, options) {
    //Load settings
    console.log(token)
    this.settings = options;
    this.socket = io.connect('http://beam.azurewebsites.net', {'force new connection' : true, reconnect : false}); //replace with url later
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

  addFriend(email, cb){
    console.log("adding friend", email);
    this.socket.emit('send friend invite', email);
    //TODO handle success from server, etc
  }
  
  onIncomingBeam(data){
    chrome.tabs.create({url: data.url}, function(tab){
      // Now in the context of the (new) beamed tab. 
      _.extend(data, {
        action: "showMessage"
      });
      if (data.message){
        console.log("Message sent to content script:", data);
        window.setTimeout(function() { 
          chrome.tabs.sendMessage(tab.id, data, function(response){
            console.log(response.status);
          }); 
       }, 2000);
      }
    });
  }
}

/*
chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});
*/

chrome.browserAction.setBadgeText({text: '\'Allo'});

console.log('\'Allo \'Allo! Event Page for Browser Action');

/**
 * Instantiate beamHandler to handle socket connections
 */

let beamHandler;
var persistance = new Persistance();

persistance.getUserToken().then(function(token){
  beamHandler = new BeamHandler(token);
})


var logIn = function(user){
  return new Promise(function(resolve, reject) {
    $.post( "http://beam.azurewebsites.net/api/login/", user)
    .done(function(res) {
      console.log('logged in');
      let token = res.token;
      beamHandler = new BeamHandler(token);
      persistance.setUserToken(token).then(function(){
        resolve();
      }).catch(function(){
        reject('storage error');
      });
    })
    .fail(function(err) {
      reject(err);
    });
  });
};

var logout = function(){
  return new Promise(function(resolve, reject){
    $.get("http://beam.azurewebsites.net/logout")
    .done(function(res){
      resolve();
    })
    .fail(function(err){
      reject("Could not logout.");
    })
  })
}

/**
 * Chrome runtime listeners
 * Messages sent from other parts of the extension will be received here
 */
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('got message: ' + request.action);
    switch (request.action){
      case 'beamTab':
        console.log('beaming tab', request.data.url);
        beamHandler.sendBeamTab(request.data);
        sendResponse({status: 'received'});
        break;
      case 'log in':
        logIn(request.credentials)
        .then(function(){
          sendResponse({success: true});
        })
        .catch(function(err){
          sendResponse({success: false, reason: err});
        });
        return true; //alow async response
        break;
      case 'user:logout':
        logout()
        .then(function(){
          return persistance.clearUserToken(); // Clear the local token
        })
        .then(function(){
          return persistance.isUserLoggedIn(); // Confirm it's been removed
        })
        .then(function(state){
          sendResponse({success: true, loggedIn: state});
        })
        .catch(function(err){
          sendResponse({success: false, reason: err});
        })
        return true;
        break;
      case 'is user logged in':
        persistance.isUserLoggedIn().then(
          function(state){
            console.log('logged in state is ' + state);
            sendResponse({loggedInState: state});
          }
        )
        return true; //alow async response
        break;
      case 'add friend':
        beamHandler.addFriend(request.data.email, sendResponse);
        return true; //alow async response
        break;
    }
  });