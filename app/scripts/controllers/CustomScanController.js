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
 * @name armaditoApp.controller:customScanController
 * @description
 * # customScanController
 * Controller of the armaditoApp
 */
angular.module('armaditoApp')
  .controller('CustomScanController',
            ['$scope', '$uibModalInstance', 'items', 'BrowseService',
    function ($scope,   $uibModalInstance,   items,   BrowseService)
    {
        $scope.items = items;

        $scope.optionScan = {
            pathToScan : '',
            heuristicMode : false,
            scanArchive : false,
            excludeFolder : ''
        };

        $scope.ok = function ()
        {
        	$uibModalInstance.close($scope.optionScan);
        };

        $scope.cancel = function ()
        {
        	$uibModalInstance.dismiss('cancel');
        };

        $scope.chooseFile = function ()
        {
            var chooser = document.querySelector('#pathToScan');
            chooser.addEventListener("change", function(evt)
            {
                var path = this.value;
                $scope.$apply(function()
                {
                   $scope.optionScan.pathToScan = path;
                   
                })
            }, false);
        };

        $scope.excludedFolders = [];
        $scope.chooseFileToExclude = function ()
        {
            var name = '#fileToExclude';
            var chooser = document.querySelector(name);
            chooser.addEventListener("change", function(evt)
            {
                
                var path = this.value;
                $scope.$apply(function()
                {
                    $scope.pathToExclude = path;
                    var optionScan = {
                        pathToScan : $scope.pathToExclude
                    };
                    $scope.excludedFolders.push(optionScan);
                    
                })
            }, false);
        };

        $scope.tree = [{
                name: "/",
                image: "/app/images/disk.png",
                full_path: "/",
                type : "root"
        }];

        $scope.optionsTreeWidget = { expandOnClick: true, showIcon : true};

        $scope.$on('selection-changed', function (e, node)
        {
            $scope.breadcrums = [];
            var testBread = node.full_path.split("/");
            testBread.shift();
            $scope.breadcrums = testBread;
            $scope.optionScan.pathToScan = node.full_path;

            if(node.type === "folder" || node.type === "root")
            {
                BrowseService.browse(node.full_path).then(
                    function (successData)
                    {
                        $scope.showError = false;
                        node.children = [];
                        for (var i = 0; i < successData.content.length; i++)
                        {
                            if((successData.content[i].type === "folder") && (!successData.content[i].expanded))
                            {
                                successData.content[i].image = "/app/images/folder.png";
                            }
                            else if ((successData.content[i].type === "folder") && (successData.content[i].expanded))
                            {
                                successData.content[i].image = "/app/images/folder-open.png";
                            }
                            node.children.push(successData.content[i]);
                        }
                    },
                    function(error)
                    {
                        $scope.showError = true;
                        $scope.error = "Error cannot access to path : " + "<b>"+ error.data.data.path + "</b> " + " reason : " + "<b>" + error.data.data.error + "</b>";
                        console.error('Error : ' + $scope.error);

                    },
                    function (progress)
                    {
                        console.info('Progress : ' + progress);
                    }
                );
            }
        });
    }
]);
