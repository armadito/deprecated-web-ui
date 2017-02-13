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
    .controller('StatusController', ['$rootScope', '$scope', 'StatusService',
        function($rootScope, $scope, StatusService) {

            $scope.timeConverter = function(timestamp) {
                var date = new Date(timestamp * 1000);
                var datevalues = ('0' + date.getDate()).slice(-2) + '-' +
                    ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
                    date.getFullYear() + ' ' +
                    date.getHours() + ':' +
                    date.getMinutes();

                return datevalues;
            };

            StatusService.getStatus();

            $rootScope.$on('StatusEvent', function(event, data) {
                $scope.databases_update = data.global_status;
                $scope.last_update = $scope.timeConverter(data.global_update_ts);
                $scope.module_infos = data.module_infos;

                for (var i = 0; i < $scope.module_infos.length; i++) {
                    $scope.module_infos[i].mod_update_ts = $scope.timeConverter($scope.module_infos[i].mod_update_ts);
                }

                $scope.$apply();
            });
        }
    ]);
