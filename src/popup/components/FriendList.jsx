import React, { Component, PropTypes } from 'react';

class FriendList extends Component {
  constructor(props) {
    super(props);
    if(props.friendList == null){
      this.props = {
        friendList: [],
      };
    }
  }
  
  renderList(userList) {
    return userList.map((user, index) => {
        return (
          <li 
            key={index}
            onClick={() => this.props.onFriendClick(this.props.friendList[index])} 
            value={ user.email } 
            className='friend'>
              { user.email }
          </li>
          );
    });
  }
  
  render() {
    if (this.props.friendList && this.props.friendList.length > 0) {
      const onlineAndOfflineUsers = this.props.friendList.reduce((accumulator, user) => {
        if (user.isConnected) {
          accumulator.online.push(user);
        } else {
          accumulator.offline.push(user);
        } 
        return accumulator;
      }, {
        online: [],
        offline: [],
      });

      const onlineLayout = this.renderList(onlineAndOfflineUsers.online);
      const offlineLayout = this.renderList(onlineAndOfflineUsers.offline);

      return (
        <div>
          <ul className="online friend-list">
              {onlineLayout}
          </ul>
          <ul className="offline friend-list">
              {offlineLayout}
          </ul>
        </div>
      );
    } else {
      return null;
    }
  }
}

FriendList.propTypes = {
  friendList: React.PropTypes.array,
  onFriendClick: React.PropTypes.func.isRequired,
};


export default FriendList;
