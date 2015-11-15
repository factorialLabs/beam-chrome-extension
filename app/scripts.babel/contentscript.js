'use strict';

console.log('\'Allo \'Allo! Content script');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	console.log("Message received.");
	if (request.action === "showMessage"){
		console.log("showing message", request.message);
		var messageDiv = $("<div>", {id:"beam-messageDiv"});
		messageDiv.text(request.message); 
		$(document.body).prepend(messageDiv);
		sendResponse({status:"Message Shown."});
	}
});
