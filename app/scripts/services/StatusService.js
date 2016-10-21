'use strict';

/**
 * @ngdoc service
 * @name armaditoApp.ScanService
 * @description
 * # ScanService
 * Service in the armaditoApp.
 */
angular.module('armaditoApp')
	.service('StatusService', ['$rootScope', '$interval', function ($rootScope, $interval) {

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
            if (receivedEvent.event_type === "StatusEvent")
        	{
        		$rootScope.$broadcast( "StatusEvent", receivedEvent );
                factory.apiUnregister();
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

	  	factory.apiUnregister = function ()
        {
	  		factory.xmlhttp.open("GET", "/api/unregister", true);
	  		factory.xmlhttp.setRequestHeader("X-Armadito-Token", factory.token);
	  		factory.xmlhttp.send(null);
	  		factory.token = null;
	  	};

        factory.AskForStatus = function()
        {
            factory.xmlhttp.onreadystatechange = function ()
            {
                if (factory.xmlhttp.readyState == 4 && factory.xmlhttp.status == 200)
                {
                    factory.pollEvents();
	            }
            };

		  	factory.xmlhttp.open("GET", "/api/status", true);
		  	factory.xmlhttp.setRequestHeader("X-Armadito-Token", factory.token);
		  	factory.xmlhttp.setRequestHeader("Content-Type", "application/json");
	  		factory.xmlhttp.send(null);
        }

        factory.apiRegister = function ()
        {
            factory.xmlhttp.onreadystatechange = function ()
            {
                if (factory.xmlhttp.readyState == 4 && factory.xmlhttp.status == 200)
                {
                    var jobj = parseJson(factory.xmlhttp.responseText);
                    factory.token = jobj.token;
                    console.log("[+] Registred with token : " + factory.token);
                    factory.AskForStatus();
	            }
            };

	  		factory.xmlhttp.open("GET", "/api/register", true);
	  		factory.xmlhttp.send(null);
	  	};

	  	factory.getStatus = function()
        {
            factory.xmlhttp = new XMLHttpRequest();
            factory.apiRegister();
	  	};

	  	return factory;
	}
]);
