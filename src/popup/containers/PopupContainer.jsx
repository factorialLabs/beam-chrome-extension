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
    	chrome.runtime.sendMessage({action: POPUP_OPEN});
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
        <FriendList friendList={ this.state.friendList } />
        //<FriendRequests />
        //<LogOut />
      );
    }
  }
}

export default PopupContainer;
