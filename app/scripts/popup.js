'use strict';

$('#beam-login').show();
$('#beam-signup').hide();
$('#beam-action').hide();

//handle login button click
$('#loginBtn').click(function(){
	chrome.runtime.sendMessage({action: 'is user logged in'}, response => {
		
	});
});
		
chrome.runtime.sendMessage({action: 'is user logged in'}, response => {
	//callback from background.js
	console.log('logged in state: ' + response.loggedInState);
	if(response.loggedInState){
		//logged in
		$('#login-pane').hide();
		$('#action-pane').show();
		$('#beam-signup').hide();
	}else{
		//not in
		$('#login-pane').show();
		$('#action-pane').hide();
		$('#beam-signup').hide();
	}
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
		});
	});
}