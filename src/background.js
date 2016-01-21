'use strict';
import BeamHandler from './handler/beamhandler';
import Persistance from './utils/persistance';
import {mode,server} from './serverConfig';

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
    $.post( server[mode] + "/api/login/", user)
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
    $.get(server[mode] + "/logout")
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
      case 'background::beam:send':
        console.log('beaming tab', request.data.url);
        beamHandler.sendBeamTab(request.data);
        sendResponse({status: 'received'});
        break;
      case 'background::user:login':
        logIn(request.credentials)
        .then(function(){
          sendResponse({success: true});
        })
        .catch(function(err){
          sendResponse({success: false, reason: err});
        });
        return true; //alow async response
        break;
      case 'background::user:logout':
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
      case 'background::user:isLoggedIn':
        persistance.isUserLoggedIn().then(
          function(state){
            console.log('logged in state is ' + state);
            sendResponse({loggedInState: state});
          }
        )
        return true; //alow async response
        break;
      case 'background::friend:add':
        beamHandler.addFriend(request.data.email, sendResponse);
        return true; //alow async response
        break;
      case 'background::friend:requests:get':
        console.log(beamHandler.getFriendRequests())
        sendResponse(beamHandler.getFriendRequests());
        break;     
      case 'background::friends:get':
        sendResponse(beamHandler.getFriends());
        break;   
      }
  });