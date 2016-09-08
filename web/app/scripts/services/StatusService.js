'use strict';

/**
 * @ngdoc service
 * @name armaditoApp.ScanService
 * @description
 * # ScanService
 * Service in the armaditoApp.
 */
angular.module('armaditoApp')
	.service('StatusService', ['$rootScope','$q', '$interval', function ($rootScope, $q, $interval) {

	  	var factory = {};
	  	var token = null;	  	

	  	function long_polling() {
	     	var xmlhttp = new XMLHttpRequest();
	      	xmlhttp.onreadystatechange = function() {
	          	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	            	var ev = JSON.parse(xmlhttp.responseText);
	            	console.log('ev', ev);
	            	if (ev.event_type === "StatusEvent") {
	            		$rootScope.$broadcast( "StatusEvent", ev );
	            	}
	          }
	      	};
	      	console.log("sending request");
	      	xmlhttp.open("GET", "/api/event", true);
	      	xmlhttp.setRequestHeader("X-Armadito-Token", token);
	      	xmlhttp.send(null);
	  	};

	  	factory.getStatus = function(){
	  		var deferred = $q.defer();

	  		////// REGISTERING /////////
	  		var xmlhttp = new XMLHttpRequest();
	  		xmlhttp.onreadystatechange = function() {
	  	    	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	  	        	var obj = JSON.parse(xmlhttp.responseText);
	  	        	token = obj.token;
	  	        	console.log("token is now: " + token);
	  	        	deferred.resolve('Token is now OK');
	  	    	}
	  		};
	  		xmlhttp.open("GET", "/api/register", true);
	  		xmlhttp.send(null);

	  		////// GETTING STATUS /////////
  		  	var promise = deferred.promise;
  		  	promise.then (function(result){
  		  		if(token !== null){
  				  	console.log("getting Status");
  				  	var xmlhttp = new XMLHttpRequest();
  				  	xmlhttp.open("GET", "/api/status", true);
  				  	xmlhttp.setRequestHeader("X-Armadito-Token", token);
  				  	xmlhttp.setRequestHeader("Content-TYpe", "application/json");
  			  		xmlhttp.send(null);
  			  		var pingAV = function (){
  			  			var xmlhttp = new XMLHttpRequest();
		  				xmlhttp.onreadystatechange = function() {
		  			    	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		  			        	var obj = JSON.parse(xmlhttp.responseText);
		  			        	console.log("object after ping is now: " , obj);
		  			        	$rootScope.$broadcast( "PingEvent", obj );
		  			    	}
		  				};
		  				xmlhttp.open("GET", "/api/ping", true);
		  				xmlhttp.setRequestHeader("X-Armadito-Token", token);
  				  		xmlhttp.setRequestHeader("Content-TYpe", "application/json");
		  				xmlhttp.send(null);
  			  		};
  			  		pingAV();
  			  		$interval(function() {
		  				pingAV();
				    }, 5000);

  			  		return long_polling();
  		  		}
  		  	})
	  	};	  	

	  	return factory;
	}]);