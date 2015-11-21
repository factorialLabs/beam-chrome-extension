'use strict';
/**
 * Class to handle setting persistance using Chrome's storage API and wraps everything around promises.
 */
class Persistance{
	constructor(){
		
	}
	
	setUserToken(token){
		return new Promise(function(resolve, reject) {
		    // Save it using the Chrome extension storage API.
			chrome.storage.sync.set({'login-token': token}, function() {
				// Notify that we saved.
				if(chrome.runtime.lastError == null){
					resolve();
				}else{
					reject({error: 'token not set'});
				}
			});
		});
	}
	
	clearUserToken(){
		return new Promise(function(resolve, reject) {
		    // Save it using the Chrome extension storage API.
			chrome.storage.sync.remove('login-token', function() {
				// Notify that we saved.
				if(chrome.runtime.lastError == null){
					resolve();
				}else{
					reject(chrome.runtime.lastError);
				}
			});
		});
	}
	
	isUserLoggedIn(){
		return new Promise(function(resolve, reject) {
		    // Save it using the Chrome extension storage API.
			chrome.storage.sync.get({'login-token': null}, function(result) {
				// Notify that we saved.
				if(chrome.runtime.lastError == null){
					resolve(result['login-token'] == null ? false : true);
				}else{
					resolve(false);
				}
			});
		});
	}
	
	getUserToken(){
		return new Promise(function(resolve, reject) {
		    // Save it using the Chrome extension storage API.
			chrome.storage.sync.get({'login-token': null}, function(result) {
				// Notify that we saved.
				if(chrome.runtime.lastError == null){
					resolve(result['login-token']);
				}else{
					resolve(false);
				}
			});
		});
	}
}