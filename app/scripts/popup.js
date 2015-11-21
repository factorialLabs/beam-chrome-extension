'use strict';

var handleLoginState = function(state){
	console.log('logged in state: ' + state);
	if(state){
		//logged in
		$('#beam-login').hide(0);
		$('#beam-action').show(0);
		$('#beam-signup').hide(0);
	}else{
		//not in
		$('#beam-login').show(0);
		$('#beam-action').hide(0);
		$('#beam-signup').hide(0);
	}
}

$('#beam-login').show(0);
$('#beam-signup').hide(0);
$('#beam-action').hide(0);

//handle login button click
$('#beamLogin').click(function(){
	let user = $('#beam-login > #beamUsername').val();
	let pwd = $('#beam-login > #beamPassword').val();
	let userObj = {email:user,password:pwd};
	chrome.runtime.sendMessage({action: 'log in', credentials:userObj}, response => {
		handleLoginState(response.success);
		console.log(response);
	});
});
		
chrome.runtime.sendMessage({action: 'is user logged in'}, response => {
	//callback from background.js
	handleLoginState(response.loggedInState);
});

document.getElementById('beamTab').onclick = () => {
	chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
		//current tab is tabs[0]
		var message = {
			action: "beamTab",
			data: {
				message: document.getElementById("beamMessage").value,
				recipient: document.getElementById("beamRecipient").value,
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