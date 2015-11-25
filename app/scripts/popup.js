'use strict';

var handleLoginState = function(state){
	console.log('logged in state: ' + state);
	if (state) {
		//logged in
		$('#beam-login').hide();
		$('#beam-action').show();
		$('#beam-signup').hide();
	} else {
		//not in
		$('#beam-login').show();
		$('#beam-action').hide();
		$('#beam-signup').hide();
	}
}
// Default State
$('#beam-login').show();
$('#beam-signup').hide();
$('#beam-action').hide();

//handle login button click
$('#beamLogin').click(function(){
	var userObj = {
		email: $('#beam-login > #beamUsername').val(),
		password: $('#beam-login > #beamPassword').val()
	}
	chrome.runtime.sendMessage({action: 'log in', credentials: userObj}, response => {
		handleLoginState(response.success);
		console.log(response);
	});
});
		
$('#beamLogout').click(function(){
	chrome.runtime.sendMessage({action: "user:logout"}, response => {
		console.log(response);
		handleLoginState(response.loggedIn);
	});
});
chrome.runtime.sendMessage({action: 'is user logged in'}, response => {
	//callback from background.js
	handleLoginState(response.loggedInState);
});

$('#beamTab').click = () => {
	chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
		//current tab is tabs[0]
		var message = {
			action: "beamTab",
			data: {
				message: $("#beamMessage").val(),
				recipient: $("#beamRecipient").val(),
				url: tabs[0].url
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

$('#friendAddBtn').click = () => {
	chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
		//current tab is tabs[0]
		var message = {
			action: "add friend",
			data: {
				email: $("#addFriendEmail").val()
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