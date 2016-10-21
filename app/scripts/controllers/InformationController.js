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

/**
 * @ngdoc function
 * @name armaditoApp.controller:InformationController
 * @description
 * # InformationController
 * Controller of the armaditoApp
 */
angular.module('armaditoApp')
  .controller('InformationController', ['$rootScope', '$scope', 'StatusService', 
    function ($rootScope, $scope, StatusService)
    {
		$scope.state = {
			status : 0,
			service : false,
			realtime : false,
			upToDate : false,
			update : "critical",
			last_update : "Not determined",
			last_update_timestamp : 0,
			version : "Not determined"
		};

		$scope.timeConverter = function(timestamp)
        {
            var a = new Date(timestamp * 1000);
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes();
            var sec = a.getSeconds();

            return sprintf("%02d %s %d %02d:%02d:%02d", date, month, year, hour, min, sec);
		};

		$scope.state.modules = [];
	    StatusService.getStatus();

	    $rootScope.$on('StatusEvent', function(event, data)
        {
            $scope.databases_update = data.global_status;
            $scope.last_update = data.global_update_timestamp;
            $scope.modules = data.modules;
            $scope.$apply();
	    });
    }
]);
