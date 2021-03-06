import React, { Component, PropTypes } from 'react';
import { LOGGED_IN_STATE_CHANGED, FRIEND_LIST_UPDATE, POPUP_OPEN } from '../../constants/actions.js';
import LoginForm from '../components/LoginForm.jsx';
import FriendList from '../components/FriendList.jsx';

require("../../scss/popup.scss");

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
    const _this = this;
    chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
      //current tab is tabs[0]
      var message = {
        action: "background::beam:send",
        data: {
          message: _this.refs.message.value,
          recipient: friend.email,
          url: tabs[0].url,
        }
      }
      chrome.runtime.sendMessage(message, response => {
        //callback from background.js
        console.log(response.status);
        //TODO show currently beaming screen then close the window
        window.close();
      });
    });
  }
  
  handleLogOut() {
    chrome.runtime.sendMessage({action: "background::user:logout"}, response => {
      console.log(response);
      this.handleLoginState(response.loggedIn);
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
        <div>
          <input id="beamMessage" className="beam-input" placeholder="Message" ref="message" />
          <FriendList friendList={ this.state.friendList } onFriendClick={this.handleOnFriendClick.bind(this)}/>
          {
            //<FriendRequests />
          }
          <button className="beam-secondary-button" id="beamLogout" onClick={() => this.handleLogOut()}>Logout</button>
        </div>
      );
    }
  }
}

export default PopupContainer;
