import React, { Component, PropTypes } from 'react';
import { LOGGED_IN_STATE_CHANGED, FRIEND_LIST_UPDATE, POPUP_OPEN } from '../../constants/actions.js';
import LoginForm from '../components/LoginForm.jsx';
import FriendList from '../components/FriendList.jsx';

class PopupContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: true, //assume the user is already logged in for nicer animations
      friendList: [],
    };
    this.setUpChromeListeners();
    this.pingBackgroundService();
  }
  
  setUpChromeListeners() {
    const _this = this;
    chrome.runtime.onMessage.addListener(
      (request, sender, sendResponse) => {
      console.log('Got message: ' + request.action);
      switch (request.action){
        case LOGGED_IN_STATE_CHANGED:
          _this.setState({
            loggedIn: request.loggedIn,
          });
          break;
        case FRIEND_LIST_UPDATE:
          _this.setState({
            friendList: request.friendList,
          });
          console.log(request);
          break;
        default:
          break;
      }
    }); 
  }
  
  pingBackgroundService() {
    const _this = this;
    var port = chrome.runtime.connect({name: "startup"});
    port.postMessage({action: POPUP_OPEN});
    port.onMessage.addListener(function(msg) {
      switch (msg.action){
        case LOGGED_IN_STATE_CHANGED:
          _this.setState({
            loggedIn: msg.loggedIn,
          });
          break;
        case FRIEND_LIST_UPDATE:
          _this.setState({
            friendList: msg.friendList,
          });
          break;
        default:
          break;
      }
    });
  }
  
  handleOnFriendClick(friend, beamMsg) {
    chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
      //current tab is tabs[0]
      var message = {
        action: "background::beam:send",
        data: {
          //message: $("#beamMessage").val(),
          recipient: friend.email,
          url: tabs[0].url,
        }
      }
      chrome.runtime.sendMessage(message, response => {
        //callback from background.js
        console.log(response.status);
        //TODO show currently beaming screen then close the window
        //window.close();
      });
    });
  }
  
  render() {
    const { increment, incrementIfOdd, incrementAsync, decrement, state } = this.props;
    console.log('%cRender ' + this.constructor.displayName + ' component', 'background: #FFF; color: #2aa198 ', 'state', this.state, 'props', this.props);
    if (!this.state.loggedIn) {
      return (
        <LoginForm />
      );
    } else {
      return (
        <FriendList friendList={ this.state.friendList } onFriendClick={this.handleOnFriendClick}/>
        //<FriendRequests />
        //<LogOut />
      );
    }
  }
}

export default PopupContainer;
