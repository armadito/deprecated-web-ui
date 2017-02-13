/***

Copyright (C) 2015, 2016 Teclib'

This file is part of Armadito gui.

Armadito gui is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Armadito gui is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Armadito gui.  If not, see <http://www.gnu.org/licenses/>.

***/
'use strict';

angular.module('armaditoApp')
    .service('StatusService', ['$rootScope', function($rootScope) {

        var factory = {};

        function parseJson(json) {
            var parsed;
            try {
                parsed = JSON.parse(json);
            } catch (e) {
                console.error("Error when parsing JSON : " + e);
            }
            return parsed;
        };

        factory.handleEvent = function(jobj) {
            if (typeof jobj.global_status != "undefined") {
                $rootScope.$broadcast("StatusEvent", jobj);
                factory.apiUnregister();
            }
        };

        factory.pollEvents = function() {
            factory.xmlhttp.onreadystatechange = function() {
                if (factory.xmlhttp.readyState == 4 && factory.xmlhttp.status == 200) {
                    var jobj = parseJson(factory.xmlhttp.responseText);
                    factory.handleEvent(jobj);
                }
            };

            factory.xmlhttp.open("GET", "/api/event", true);
            factory.xmlhttp.setRequestHeader("X-Armadito-Token", factory.token);
            factory.xmlhttp.send(null);
        };

        factory.apiUnregister = function() {
            factory.xmlhttp.open("GET", "/api/unregister", true);
            factory.xmlhttp.setRequestHeader("X-Armadito-Token", factory.token);
            factory.xmlhttp.send(null);
            factory.token = null;
        };

        factory.AskForStatus = function() {
            factory.xmlhttp.onreadystatechange = function() {
                if (factory.xmlhttp.readyState == 4 && factory.xmlhttp.status == 200) {
                    factory.pollEvents();
                }
            };

            factory.xmlhttp.open("GET", "/api/status", true);
            factory.xmlhttp.setRequestHeader("X-Armadito-Token", factory.token);
            factory.xmlhttp.setRequestHeader("Content-Type", "application/json");
            factory.xmlhttp.send(null);
        }

        factory.apiRegister = function() {
            factory.xmlhttp.onreadystatechange = function() {
                if (factory.xmlhttp.readyState == 4 && factory.xmlhttp.status == 200) {
                    var jobj = parseJson(factory.xmlhttp.responseText);
                    factory.token = jobj.token;

                    factory.AskForStatus();
                }
            };

            factory.xmlhttp.open("GET", "/api/register", true);
            factory.xmlhttp.send(null);
        };

        factory.getStatus = function() {
            factory.xmlhttp = new XMLHttpRequest();
            factory.apiRegister();
        };

        return factory;
    }]);
