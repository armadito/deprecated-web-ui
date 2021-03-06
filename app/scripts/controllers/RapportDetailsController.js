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
 * @name armaditoApp.controller:RapportDetailsController
 * @description
 * # RapportDetailsController
 * Controller of the armaditoApp
 */
angular.module('armaditoApp')
  .controller('RapportDetailsController', ['$scope', '$uibModalInstance', 'items' ,
  		function ($scope, $uibModalInstance, items) {
	   	  $scope.items = items;
		  $scope.selected = {
		    item: $scope.items[0]
		  };

		  $scope.ok = function () {
		    $uibModalInstance.close($scope.selected.item);
		  };

		  $scope.cancel = function () {
		    $uibModalInstance.dismiss('cancel');
		  };
  }]);
