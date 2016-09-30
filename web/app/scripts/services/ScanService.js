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

        function handleEvent(received_event)
        {
            if (received_event.event_type === "OnDemandProgressEvent")
            {
                $rootScope.$broadcast( "OnDemandProgressEvent", received_event );
                pollEvents();
            }
            else if (received_event.event_type === "DetectionEvent")
            {
                $rootScope.$broadcast( "DetectionEvent", received_event );
                pollEvents();
            }
            else if (received_event.event_type === "OnDemandCompletedEvent")
            {
                $rootScope.$broadcast( "OnDemandCompletedEvent", received_event );
            }
        }

        function pollEvents()
        {
	     	var xmlhttp = new XMLHttpRequest();

	      	xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
                {
	                var event = JSON.parse(xmlhttp.responseText);
	                handleEvent(event);
                 }
	      	};

	      	xmlhttp.open("GET", "/api/event", true);
	      	xmlhttp.setRequestHeader("X-Armadito-Token", token);
	      	xmlhttp.send(null);
	  	};

        factory.newScan = function(path_to_scan)
        {
            apiRegister();

            var data = {path: path_to_scan},
                xmlhttp = new XMLHttpRequest();

            xmlhttp.open("POST", "/api/scan", true);
            xmlhttp.setRequestHeader("X-Armadito-Token", token);
            xmlhttp.setRequestHeader("Content-TYpe", "application/json");
            xmlhttp.send(JSON.stringify(data));

            pollEvents();
        };

        factory.apiRegister = function()
        {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function()
            {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
                {
                    var obj = JSON.parse(xmlhttp.responseText);
                    token = obj.token;
	            }
            };

	  		xmlhttp.open("GET", "/api/register", true);
	  		xmlhttp.send(null);
	  	};

	  	return factory;
	}
]);
