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
 * @name armaditoApp.controller:ScanController
 * @description
 * # ScanController
 * Controller of the Armadito-av
 */

angular.module('armaditoApp')
  .controller('ScanController',
            ['$rootScope', '$scope', '$uibModal', 'ScanService', 'ScanDataFactory',
    function ($rootScope,   $scope,   $uibModal,   ScanService,   ScanDataFactory)
    {

        $scope.synchronizeScopeWithFactory = function ()
        {
            $scope.type = ScanDataFactory.data.type;
            $scope.scan_progress = ScanDataFactory.data.progress;
            $scope.scan_files = ScanDataFactory.data.files;
            $scope.scanned_count = ScanDataFactory.data.scanned_count;
            $scope.suspicious_count = ScanDataFactory.data.suspicious_count;
            $scope.malware_count = ScanDataFactory.data.malware_count;
            $scope.displayed_file = ScanDataFactory.data.displayed_file;
            $scope.path_to_scan = ScanDataFactory.data.path_to_scan;
            $scope.canceled = ScanDataFactory.data.canceled;
        };

        $scope.updateScanDataFactory = function (data)
        {
            if(data.event_type === "DetectionEvent")
            {
                $scope.scan_files.push(data);
            }
            else if (data.event_type === "OnDemandProgressEvent")
            {
                if(data.path)
                {
                    ScanDataFactory.setDisplayedFile(data.path);
                    $scope.displayed_file = ScanDataFactory.data.displayed_file;
                }

                if(json_object.params.scan_status === 'malware'
                || json_object.params.scan_status === 'suspicious')
                {
                    ScanDataFactory.addScannedFile(data.path,
                                                     data.scan_status,
                                                     data.scan_action,
                                                     data.mod_name,
                                                     data.mod_report);

                ScanDataFactory.updateCounters(data.scanned_count,
                                                data.suspicious_count,
                                                data.malware_count,
                                                data.progress);
            }
            else if (data.event_type === "OnDemandCompletedEvent")
            {
                // TODO
            }

            $scope.synchronizeScopeWithFactory();
            $scope.$apply();
        }

        $scope.configureScan = function ()
        {
            // TODO
        };

        $scope.cancelScan = function ()
        {
            if($scope.canceled == 0)
            {
                ScanDataFactory.setCanceled();
            }
        };

        $scope.startScan = function ()
        {
            console.log("[+] New Scan ::\n");

            ScanDataFactory.reset();
            $scope.scan_files = [];

            $scope.configureScan();
            ScanDataFactory.setScanConf($scope.path_to_scan, $scope.type);
            $scope.synchronizeScopeWithFactory();

            console.log("[+] Debug :: New Scan ::\n");
            ScanService.newScan($scope.path_to_scan);
        };

        $scope.fullScan = function ()
        {
            $scope.type = "analyse_view.Full_scan";
        };

        $scope.quickScan = function ()
        {
            $scope.type = "analyse_view.Quick_scan";
        };

        $scope.customScan = function ()
        {
            $scope.type = "analyse_view.Custom_scan";

            var size = 'sm';
            var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'views/CustomAnalyse.html',
              controller: 'CustomAnalyseController',
              size: size,
              resolve:
              {
                items: function ()
                {
                    return $scope.items;
                }
              }
            });

            modalInstance.result.then(
                function (scanOptions)
                {
                    $scope.scanOptions = scanOptions;
                    $scope.path_to_scan = $scope.scanOptions.pathToScan;
                    $scope.startScan();
                },
                function ()
                {
                    console.log('Modal dismissed at: ' + new Date());
                }
            );
        };

        $scope.truncateString = function (string, max_length)
        {
            if (string.length <= max_length){
                return string;
            }

            var separator = '...',
                chars_to_show = max_length - separator.length,
                front_chars = Math.ceil(chars_to_show/2),
                back_chars = Math.floor(chars_to_show/2);

            return string.substr(0, front_chars) +
                 separator + string.substr(string.length - back_chars);
        };

        $rootScope.$on('OnDemandProgressEvent', function(event, data)
        {
            $scope.updateScanDataFactory(data);
            console.log("OnDemandProgressEvent : ", data);
        });

        $rootScope.$on('DetectionEvent', function(event, data)
        {
            $scope.updateScanDataFactory(data);
            console.log("DetectionEvent : ", data);
        });

        $rootScope.$on('OnDemandCompletedEvent', function(event, data)
        {
            $scope.updateScanDataFactory(data);
            console.log("OnDemandCompletedEvent : ", data);
        });

    }
]);
