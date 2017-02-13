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
    .controller('ScanController', ['$rootScope', '$scope', '$uibModal', 'ScanService', 'ScanData',
        function($rootScope, $scope, $uibModal, ScanService, ScanData) {
            $scope.filePathBeginLimit = 10;
            $scope.filePathEndLimit = 40;

            $scope.synchronizeScopeWithFactory = function() {
                $scope.type = ScanData.data.type;
                $scope.scan_progress = ScanData.data.progress;
                $scope.scan_files = ScanData.data.files;
                $scope.scanned_count = ScanData.data.scanned_count;
                $scope.suspicious_count = ScanData.data.suspicious_count;
                $scope.malware_count = ScanData.data.malware_count;
                $scope.displayed_file = ScanData.data.displayed_file;
                $scope.path_to_scan = ScanData.data.path_to_scan;
                $scope.canceled = ScanData.data.canceled;
            };

            $scope.updateProgress = function(data) {
                if (data.u.ev_on_demand_progress.path) {
                    ScanData.setDisplayedFile(data.u.ev_on_demand_progress.path);
                }

                ScanData.updateCounters(data.u.ev_on_demand_progress.scanned_count,
                    data.u.ev_on_demand_progress.suspicious_count,
                    data.u.ev_on_demand_progress.malware_count,
                    data.u.ev_on_demand_progress.progress);

                $scope.updateScanData(data);
            }

            $scope.addScannedFile = function(data) {
                if (data.u.ev_detection.scan_status === 'A6O_FILE_MALWARE' ||
                    data.u.ev_detection.scan_status === 'A6O_FILE_SUSPICIOUS') {
                    ScanData.addScannedFile(data.u.ev_detection.path,
                        data.u.ev_detection.scan_status,
                        data.u.ev_detection.scan_action,
                        data.u.ev_detection.module_name,
                        data.u.ev_detection.module_report);
                }

                $scope.updateScanData(data);
            }

            $scope.cancelScan = function() {
                if ($scope.canceled == 0) {
                    ScanData.setCanceled();
                }
            };

            $scope.removeEventListeners = function() {
                $rootScope.$$listeners.OnDemandProgressEvent = [];
                $rootScope.$$listeners.DetectionEvent = [];
                $rootScope.$$listeners.OnDemandCompletedEvent = [];
            }

            $scope.updateScanData = function(data) {
                $scope.synchronizeScopeWithFactory();
                $scope.$apply();
            }

            $scope.addEventListeners = function() {
                $rootScope.$on('OnDemandProgressEvent', function(event, data) {
                    $scope.updateProgress(data);
                });

                $rootScope.$on('DetectionEvent', function(event, data) {
                    $scope.addScannedFile(data);
                });

                $rootScope.$on('OnDemandCompletedEvent', function(event, data) {
                    $scope.updateScanData(data);
                });
            }

            $scope.prepareFactoryForScan = function() {
                ScanData.reset();
                ScanData.setScanConf($scope.path_to_scan, $scope.type);
                $scope.synchronizeScopeWithFactory();
            }

            $scope.startScan = function() {
                $scope.prepareFactoryForScan();
                $scope.removeEventListeners();
                $scope.addEventListeners();
                ScanService.newScan($scope.path_to_scan);
            };

            $scope.fullScan = function() {
                $scope.type = "scan_view.Full_scan";
                $scope.path_to_scan = "/"
            };

            $scope.quickScan = function() {
                $scope.type = "scan_view.Quick_scan";
                $scope.path_to_scan = "/home";
            };

            $scope.customScan = function() {
                $scope.type = "scan_view.Custom_scan";

                var size = 'sm';
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'views/CustomScan.html',
                    controller: 'CustomScanController',
                    size: size,
                    resolve: {
                        items: function() {
                            return $scope.items;
                        }
                    }
                });

                modalInstance.result.then(
                    function(scanOptions) {
                        $scope.scanOptions = scanOptions;
                        $scope.path_to_scan = $scope.scanOptions.pathToScan;
                        $scope.startScan();
                    },
                    function() {

                    }
                );
            };

            $scope.truncate = function(string, max_length) {
                if (string.length <= max_length) {
                    return string;
                }

                var separator = '...',
                    chars_to_show = max_length - separator.length,
                    front_chars = Math.ceil(chars_to_show / 2),
                    back_chars = Math.floor(chars_to_show / 2);

                return string.substr(0, front_chars) +
                    separator + string.substr(string.length - back_chars);
            };

            $scope.synchronizeScopeWithFactory();
        }
    ]);
