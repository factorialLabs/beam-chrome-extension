'use strict';

document.getElementById('beamTab').onclick = () => {
	chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
		//current tab is tabs[0]
		var message = {
			action: "beamTab",
			data: {
				message: document.getElementById("beamMessage").value,
				url: tabs[0].url
			}
		}
		chrome.runtime.sendMessage(message, response => {
			//callback from background.js
			console.log(response.status);
		});
	});
}