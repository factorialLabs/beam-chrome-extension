
import _ from 'underscore';
import io from 'socket.io-client';
import {mode,server} from '../serverConfig';

export default class BeamHandler{
  constructor(token, options) {
    //Load settings
    console.log("logging to ", server[mode]);
    this.settings = options;
    this.socket = io.connect(server[mode], {'force new connection' : true, reconnect : false}); //replace with url later
    let that = this;
    this.socket.on('connect', function (socket) {
      /**
      * Handle login
      */
      that.socket.emit('authenticate', {token: token}); //send the jwt
    });

    this.socket.on('authenticated', function (msg) {
        that.socket.emit('user:show all:request');
    });

   /**
    * Socket.io listeners
    * Handle messages received from socket server
    */
    this.socket.on('incoming beam', that.onIncomingBeam);
    this.socket.on('users:show all', function(requests){
      that.onShowFriends(requests);
    });
    this.socket.on('disconnect', that.onDisconnect);
    this.socket.on('friend:requests', function(requests){
      that.onFriendRequests(requests);
    });

    this.socket.on("unauthorized", function(error) {
        console.error("Error", error.message);
    });
  }
  
  onFriendRequests(msg) {
    console.log('incoming friend requests', msg);
    this.friendRequests = msg.requests;
  }
  
  getFriendRequests() {
    return this.friendRequests;
  }
  
  onConnection(msg) {

  }
  
  onShowFriends(msg) {
    console.log("users", msg.users);
    this.friendList = msg.users;
  }
  
  getFriends() {
      return this.friendList;
  }
  
  onDisconnect(msg) {
    
  }
  
  sendBeamTab(data) {
    console.log("beaming", data);
    this.socket.emit('beam tab', data);
    //TODO handle success from server, etc
  }

  addFriend(email, cb) {
    console.log("adding friend", email);
    this.socket.emit('send friend invite', email);
    //TODO handle success from server, etc
  }
  
  onIncomingBeam(data) {
    chrome.tabs.create({url: data.url}, function(tab){
      // Now in the context of the (new) beamed tab. 
      _.extend(data, {
        action: "contentScript::message:show"
      });
      console.log("Message sent to content script:", data);
      window.setTimeout(function() { 
        chrome.tabs.sendMessage(tab.id, data, function(response){
          console.log(response.status);
        }); 
      }, 1000);
    });
  }
}