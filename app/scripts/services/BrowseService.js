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
    .service('BrowseService', function($http) {
        var BrowseService = {
            browse: function(path) {
                var promise = $http({
                    method: 'GET',
                    url: '/api/browse',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    params: {
                        path: path
                    }
                }).then(
                    function(response) {
                        return response.data;
                    }
                );
                return promise;
            }
        };
        return BrowseService;
    });
