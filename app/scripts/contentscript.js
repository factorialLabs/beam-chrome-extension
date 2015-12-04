'use strict';

console.log('\'Allo \'Allo! Content script');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	console.log("Message received.");
	if (request.action === "contentScript::message:show"){
		console.log("showing message", request.message);
		var messageDiv = $("<div>", {id:"beam-messageDiv", class:"beam-messageDiv visible"});
		if(request.message){
			messageDiv.text("Beam from "+ request.fromUser + ": " + request.message); 
		}else{
			messageDiv.text("Beam from "+ request.fromUser); 
		}
		var closeBeamMessage = $("<span id='beam-closeMessage'>X</span>");
		closeBeamMessage.click(function(){
			messageDiv.fadeOut(400, function(){

			});
		});
		messageDiv.append(closeBeamMessage);
		$(document.body).prepend(messageDiv);
		sendResponse({status:"Message Shown."});
	}
});
