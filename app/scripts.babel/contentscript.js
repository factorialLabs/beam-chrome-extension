'use strict';

console.log('\'Allo \'Allo! Content script');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	console.log("Message received.");
	if (request.action === "showMessage"){
		console.log("showing message", request.message);
		var messageDiv = $("<div>", {id:"beam-messageDiv", class:"beam-messageDiv visible"});
		messageDiv.text(request.message); 
		var closeBeamMessage = $("<span>X</span>", {id:'beam-closeMessage'});
		closeBeamMessage.click(function(){
			messageDiv.removeClass("visible");
		});
		messageDiv.append(closeBeamMessage);
		$(document.body).prepend(messageDiv);
		sendResponse({status:"Message Shown."});
	}
});
