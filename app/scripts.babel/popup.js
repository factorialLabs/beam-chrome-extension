'use strict';

document.getElementById('beamTab').onclick = () => {
	chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
		//current tab is tabs[0]
		chrome.runtime.sendMessage({action: "beamTab", options: {url: tabs[0].url}}, response => {
			//callback from background.js
			console.log(response.status);
		});
	});
}