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
	      	factory.xmlhttp.onreadystatechange = function ()
	      	{
                if (factory.xmlhttp.readyState == 4 && factory.xmlhttp.status == 200)
                {
	                var jobj = parseJson(factory.xmlhttp.responseText);
	                factory.handleEvent(jobj);
                 }
	      	};

	      	factory.xmlhttp.open("GET", "/api/event", true);
	      	factory.xmlhttp.setRequestHeader("X-Armadito-Token", factory.token);
	      	factory.xmlhttp.send(null);
	  	};

	  	factory.AskForNewScan = function ()
	  	{
            var data = {path: factory.path_to_scan};

            factory.xmlhttp.onreadystatechange = function ()
            {
                if (factory.xmlhttp.readyState == 4 && factory.xmlhttp.status == 200)
                {
                    factory.pollEvents();
	            }
            };

            factory.xmlhttp.open("POST", "/api/scan", true);
            factory.xmlhttp.setRequestHeader("X-Armadito-Token", factory.token);
            factory.xmlhttp.setRequestHeader("Content-Type", "application/json");
            factory.xmlhttp.send(JSON.stringify(data));
	  	}

	  	factory.apiUnregister = function ()
        {
	  		factory.xmlhttp.open("GET", "/api/unregister", true);
	  		factory.xmlhttp.setRequestHeader("X-Armadito-Token", factory.token);
	  		factory.xmlhttp.send(null);
	  		factory.token = null;
	  	};

        factory.apiRegister = function ()
        {
            factory.xmlhttp = new XMLHttpRequest();
            factory.xmlhttp.onreadystatechange = function ()
            {
                if (factory.xmlhttp.readyState == 4 && factory.xmlhttp.status == 200)
                {
                    var jobj = parseJson(factory.xmlhttp.responseText);
                    factory.token = jobj.token;
                    console.log("[+] Registred with token : " + factory.token);
                    factory.AskForNewScan();
	            }
            };

	  		factory.xmlhttp.open("GET", "/api/register", true);
	  		factory.xmlhttp.send(null);
	  	};

        factory.newScan = function (path_to_scan)
        {
            factory.path_to_scan = path_to_scan;
            factory.apiRegister();
        };

	  	return factory;
	}
]);
