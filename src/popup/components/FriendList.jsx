import React, { Component, PropTypes } from 'react';

class FriendList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friendList: [],
    };
  }
  
  render() {
    if (this.state.friendList.length > 0) {
      let rows = this.state.friendList.map((user, index) => {
        return (<button value={ user.email } class='friend beam-button'>
                      { (user.isConnected ? "✔ " : "") }
                      { user.email }
                 </button>);
      });
      return (
          <div id="beamFriendList">
              {rows}
          </div>
      );
    } else {
      return null;
    }
  }
}

FriendList.propTypes = {
  friendList: React.PropTypes.array,
};


export default FriendList;
