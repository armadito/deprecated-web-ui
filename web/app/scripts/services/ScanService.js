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

        function parseJson(json)
        {
            var parsed;
            try {
                parsed = JSON.parse(json);
            }
            catch(e)
            {
                console.error("Error when parsing JSON : "+e);
            }
            return parsed;
        };

        factory.handleEvent = function (receivedEvent)
        {
            if (receivedEvent.event_type === "OnDemandProgressEvent")
            {
                $rootScope.$broadcast( "OnDemandProgressEvent", receivedEvent );
                factory.pollEvents();
            }
            else if (receivedEvent.event_type === "DetectionEvent")
            {
                $rootScope.$broadcast( "DetectionEvent", receivedEvent );
                factory.pollEvents();
            }
            else if (receivedEvent.event_type === "OnDemandCompletedEvent")
            {
                factory.apiUnregister();
                $rootScope.$broadcast( "OnDemandCompletedEvent", receivedEvent );
            }
        };

        factory.pollEvents = function ()
        {
	     	var xmlhttp = new XMLHttpRequest();

	      	xmlhttp.onreadystatechange = function ()
	      	{
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
                {
	                var jobj = parseJson(xmlhttp.responseText);
	                factory.handleEvent(jobj);
                 }
	      	};

	      	xmlhttp.open("GET", "/api/event", true);
	      	xmlhttp.setRequestHeader("X-Armadito-Token", factory.token);
	      	xmlhttp.send(null);
	  	};

	  	factory.AskForNewScan = function ()
	  	{
            var data = {path: factory.path_to_scan},
                xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function ()
            {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
                {
                    factory.pollEvents();
	            }
            };

            xmlhttp.open("POST", "/api/scan", true);
            xmlhttp.setRequestHeader("X-Armadito-Token", factory.token);
            xmlhttp.setRequestHeader("Content-Type", "application/json");
            xmlhttp.send(JSON.stringify(data));
	  	}

	  	factory.apiUnregister = function ()
        {
            var xmlhttp = new XMLHttpRequest();
	  		xmlhttp.open("GET", "/api/unregister", true);
	  		xmlhttp.setRequestHeader("X-Armadito-Token", factory.token);
	  		xmlhttp.send(null);
	  		factory.token = null;
	  	};

        factory.apiRegister = function ()
        {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function ()
            {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
                {
                    var jobj = parseJson(xmlhttp.responseText);
                    factory.token = jobj.token;
                    console.log("[+] Registred with token : " + factory.token);
                    factory.AskForNewScan();
	            }
            };

	  		xmlhttp.open("GET", "/api/register", true);
	  		xmlhttp.send(null);
	  	};

        factory.newScan = function (path_to_scan)
        {
            factory.path_to_scan = path_to_scan;
            factory.apiRegister();
        };

	  	return factory;
	}
]);
