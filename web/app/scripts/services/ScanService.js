'use strict';

/**
 * @ngdoc service
 * @name armaditoApp.ScanService
 * @description
 * # ScanService
 * Service in the armaditoApp.
 */
angular.module('armaditoApp')
	.service('ScanService', ['$rootScope', function ($rootScope) {

	  	var factory = {};
	  	var token = null;
	  	
	  	function long_polling() {
	     	var xmlhttp = new XMLHttpRequest();
	      	xmlhttp.onreadystatechange = function() {
	          	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	            	var ev = JSON.parse(xmlhttp.responseText);
	            	console.log('ev', ev);
	            	if (ev.event_type === "OnDemandProgressEvent") {
	            		$rootScope.$broadcast( "OnDemandProgressEvent", ev );
	            		long_polling();
		                /*document.getElementById("progress").innerHTML = ev.progress;
		                document.getElementById("malware_count").innerHTML = ev.malware_count;
		                document.getElementById("suspicious_count").innerHTML = ev.suspicious_count;
		                document.getElementById("scanned_count").innerHTML = ev.scanned_count;*/
	            	} else if (ev.event_type === "DetectionEvent") {
	            		$rootScope.$broadcast( "DetectionEvent", ev );
	            		long_polling();
	               		/*var results = document.getElementById("results")
		                var row = results.insertRow(1);
		                var path = row.insertCell(0);
		                path.innerHTML = ev.path;
		                var status = row.insertCell(1);
		                status.innerHTML = ev.scan_status;
		                var action = row.insertCell(2);
		                action.innerHTML = ev.scan_action;
		                var module = row.insertCell(3);
		                module.innerHTML = ev.module_name;
		                var module_report = row.insertCell(4);
		                module_report.innerHTML = ev.module_report;*/
	            	} else if (ev.event_type === "OnDemandCompletedEvent") {
	            		$rootScope.$broadcast( "OnDemandCompletedEvent", ev );
	            	}
	          }
	      	};
	      	console.log("sending request");
	      	xmlhttp.open("GET", "/api/event", true);
	      	xmlhttp.setRequestHeader("X-Armadito-Token", token);
	      	xmlhttp.send(null);
	  	};

	  	factory.scan = function(pathToScan){
		  	console.log("scan");
		  	var path_to_scan = pathToScan;
		  	//var path_to_scan = document.getElementById("path").value;
		  	console.log("path to scan: " + path_to_scan);
		  	var data = {path: path_to_scan};
		  	var xmlhttp = new XMLHttpRequest();
		  	xmlhttp.open("POST", "/api/scan", true);
		  	xmlhttp.setRequestHeader("X-Armadito-Token", token);
		  	xmlhttp.setRequestHeader("Content-TYpe", "application/json");
		  	xmlhttp.send(JSON.stringify(data));
	  	
	  		return long_polling();
	  	};

	  	factory.register = function(){
	  		var xmlhttp = new XMLHttpRequest();
	  		xmlhttp.onreadystatechange = function() {
	  	    	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	  	        	var obj = JSON.parse(xmlhttp.responseText);
	  	        	token = obj.token;
	  	        	console.log("token is now: " + token);
	  	    	}
	  		};
	  		xmlhttp.open("GET", "/api/register", true);
	  		xmlhttp.send(null);
	  	};

	  	return factory;
	}]);