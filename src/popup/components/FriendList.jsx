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
  
  render() {
    if (this.props.friendList.length > 0) {
      let rows = this.props.friendList.map((user, index) => {
        return (<button key={index} onClick={() => this.props.onFriendClick(this.props.friendList[index])} value={ user.email } className='friend beam-button'>
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
  onFriendClick: React.PropTypes.func.isRequired,
};


export default FriendList;
