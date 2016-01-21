'use strict';
import BeamHandler from './handler/beamhandler';
import Persistance from './utils/persistance';
import {mode,server} from './serverConfig';
import $ from 'jquery';

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
let persistance = new Persistance();

persistance.getUserToken().then((token) => {
  beamHandler = new BeamHandler(token);
})


function logIn(user) {
  return new Promise((resolve, reject) => {
    $.post( server[mode] + "/api/login/", user)
    .done((res) => {
      console.log('logged in');
      let token = res.token;
      beamHandler = new BeamHandler(token);
      persistance.setUserToken(token)
        .then(() => { resolve(); })
        .catch(() => { reject('storage error'); });
    })
    .fail((err) => { reject(err); });
  });
};

function logout() {
  return new Promise((resolve, reject) => {
    $.get(server[mode] + "/logout")
    .done((res) => { resolve(); })
    .fail((err) => { reject("Could not logout."); })
  })
}

/**
 * Chrome runtime listeners
 * Messages sent from other parts of the extension will be received here
 */
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    console.log('got message: ' + request.action);
    switch (request.action){
      case 'background::beam:send':
        console.log('beaming tab', request.data.url);
        beamHandler.sendBeamTab(request.data);
        sendResponse({status: 'received'});
        break;
        
      case 'background::user:login':
        logIn(request.credentials)
        .then(() => { sendResponse({success: true}); })
        .catch((err) => { sendResponse({success: false, reason: err}); });
        return true; //alow async response
        break;
        
      case 'background::user:logout':
        logout()
          // Clear the local token
          .then(() => { return persistance.clearUserToken(); })
          // Confirm it's been removed
          .then(() => { return persistance.isUserLoggedIn(); })
          .then((state) => { sendResponse({success: true, loggedIn: state}); })
          .catch((err) => { sendResponse({success: false, reason: err}); })
        return true;
        break;
        
      case 'background::user:isLoggedIn':
        persistance.isUserLoggedIn().then(
          (state) => {
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