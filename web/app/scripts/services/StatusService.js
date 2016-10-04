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

	  	factory.apiUnregister = function ()
        {
            var xmlhttp = new XMLHttpRequest();
	  		xmlhttp.open("GET", "/api/unregister", true);
	  		xmlhttp.setRequestHeader("X-Armadito-Token", factory.token);
	  		xmlhttp.send(null);
	  		factory.token = null;
	  	};

        factory.AskForStatus = function()
        {
		  	var xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function ()
            {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
                {
                    factory.pollEvents();
	            }
            };

		  	xmlhttp.open("GET", "/api/status", true);
		  	xmlhttp.setRequestHeader("X-Armadito-Token", factory.token);
		  	xmlhttp.setRequestHeader("Content-Type", "application/json");
	  		xmlhttp.send(null);
        }

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
                    factory.AskForStatus();
	            }
            };

	  		xmlhttp.open("GET", "/api/register", true);
	  		xmlhttp.send(null);
	  	};

	  	factory.getStatus = function()
        {
            factory.apiRegister();
	  	};

	  	return factory;
	}
]);
