import React, { Component, PropTypes } from 'react';
import { LOGIN_SUBMIT } from '../../constants/actions.js';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingSignUp: false,
    };
  }
  
  showSignUp() {
    this.setState({
      showingSignUp: true,
    });
  }
  
  hideSignUp() {
    this.setState({
      showingSignUp: false,
    });
  }
  
  logIn() {
    const _this = this;
    const userObj = {
      email: this.refs.username.value,
      password: this.refs.password.value,
    };
    chrome.runtime.sendMessage({action: LOGIN_SUBMIT, credentials: userObj}, response => {
      if (!response.success){
        _this.setState({
          logInError: response.reason,
        });
        console.error('Error:', this.state.logInError);
      }
	  });
  }
  
  signUp() {
    //TODO Implement
  }
  
  renderSignin() {
    return  (
    <section id="beam-login">
      <input id="beamUsername" ref="username" className="beam-input" placeholder="Username" />
      <input id="beamPassword" ref="password" className="beam-input" placeholder="Password" type="password" />
      <button id="beamLogin" className="beam-button" onClick={ this.logIn.bind(this) }>Login!</button>
      <h3 onClick={ this.showSignUp.bind(this) }><u> Or sign up! </u></h3>
    </section>
    );
  }
  
  renderSignup() {
    return  (
      <section id="beam-signup">
          <input id="beamEmail" className="beam-input" placeholder="Email" />
          <input id="beamUsername" className="beam-input" placeholder="Username" />
          <input id="beamPassword" className="beam-input" placeholder="Password" type="password" />
          <button id="beamSignup" className="beam-button" type="submit">Sign up!</button>
          <h3 onClick={ this.hideSignUp.bind(this) }><u> Login! </u></h3>
      </section>
    );
  }
  
  render() {
    if (this.state.showingSignUp) {
      return this.renderSignup();
    } else {
      return this.renderSignin();
    }
  }
}

export default LoginForm;
