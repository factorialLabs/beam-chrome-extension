'use strict';
import $ from 'jquery';

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
$('#pendingFriendRequests').hide();

//handle login button click
$('#beamLogin').click(function(){
	var userObj = {
		email: $('#beam-login > #beamUsername').val(),
		password: $('#beam-login > #beamPassword').val()
	}
	chrome.runtime.sendMessage({action: 'background::user:login', credentials: userObj}, response => {
		handleLoginState(response.success);
		console.log(response);
	});
});
		
$('#beamLogout').click(function(){
	chrome.runtime.sendMessage({action: "background::user:logout"}, response => {
		console.log(response);
		handleLoginState(response.loggedIn);
	});
});

//get logged in state from service
chrome.runtime.sendMessage({action: 'background::user:isLoggedIn'}, response => {
	//callback from background.js
	handleLoginState(response.loggedInState);
});

$(document).ready(function() {
    //get friends from service
    chrome.runtime.sendMessage({action: 'background::friends:get'}, users => {
            if(!users){
                return;
            }
            
            for(let user of users){
                $('#beamFriendList').append(
                    "<button value='"+user.email+"' class='friend beam-button'>" +
                    (user.isConnected ? "✔ " : "") +
                    user.email +
                    "</button>"
                );
            }
            console.log("friend list loaded");
    });   
});

//get friend request state from background.js
chrome.runtime.sendMessage({action: 'background::friend:requests:get'}, response => {
	console.log(response);
    if(!response){
        return;
    }
	for(let i of response){
			$('#pendingFriendRequests').append(
				"<h2>" + i.email + "</h2>"
			);
	}
	$('#pendingFriendRequests').show(500);
});

$(document).on('click', "button.friend", function() {
    console.log('friend clicked');
    var email = $(this).attr("value");
	chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
		//current tab is tabs[0]
		var message = {
			action: "background::beam:send",
			data: {
				message: $("#beamMessage").val(),
				recipient: email,
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
});


$('#friendAddBtn').click(function(){
	chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
		//current tab is tabs[0]
		var message = {
			action: "background::friend:add",
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
});