'use strict';

document.getElementById('beamTab').onclick = function () {
	chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
		//current tab is tabs[0]
		chrome.runtime.sendMessage({ action: "beamTab", options: { url: tabs[0].url } }, function (response) {
			//callback from background.js
			console.log(response.status);
		});
	});
};
//# sourceMappingURL=popup.js.map
