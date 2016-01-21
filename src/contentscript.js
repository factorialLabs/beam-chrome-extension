'use strict';
import $ from 'jquery';

console.log('\'Allo \'Allo! Content script');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log("Message received.");
	if (request.action === "contentScript::message:show"){
		console.log("Showing message", request.message);
		let messageDiv = $("<div>", {id:"beam-messageDiv", class:"beam-messageDiv visible"});
		if(request.message){
			messageDiv.text("Beam from "+ request.fromUser + ": " + request.message); 
		}else{
			messageDiv.text("Beam from "+ request.fromUser); 
		}
		let closeBeamMessage = $("<span id='beam-closeMessage'>X</span>");
		closeBeamMessage.click(() => {
			messageDiv.fadeOut(400);
		});
		messageDiv.append(closeBeamMessage);
		$(document.body).prepend(messageDiv);
		sendResponse({status:"Message Shown."});
	}
});
