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
            ['$rootScope', '$scope', '$uibModal', 'ScanService',
    function ($rootScope,   $scope,   $uibModal,   ScanService) {

      $scope.type = "analyse_view.Choose_analyse_type";
      $scope.scan_progress = 0;
      $scope.scan_files = [];

      $scope.updateScope = function(data){
        if(data.event_type === "DetectionEvent"){
          $scope.scan_files.push(data);
          $scope.$apply();
        }else if (data.event_type === "OnDemandProgressEvent") {
          $scope.displayed_file = data.path;
          $scope.scan_progress = data.progress;
          $scope.scanned_count = data.scanned_count;
          $scope.suspicious_count = data.suspicious_count;
          $scope.malware_count = data.malware_count;
          $scope.$apply();
        }
        //console.log('$scope.scan_files', $scope.scan_files);
        //
        //
        //
        //$scope.displayed_file = ;
        //$scope.canceled = ;
      };

      // This function refresh structure values from data receive from AV. 
      // callback function
      $scope.threatDataFromAv = function(json_object){
      
      };

      $scope.StartScan = function(pathToScan){
        console.log("pathToScan : ", pathToScan);
        $scope.scan_files = [];
        ScanService.scan(pathToScan);
      };

      $scope.configureScan = function(){

      };

      $scope.CancelScan = function(){

      };


      $scope.fullScan = function () {
         $scope.type = "analyse_view.Full_scan";
      };

      $scope.quickScan = function () {
        $scope.type = "analyse_view.Quick_scan";
      };

      $scope.customScan = function () {
        $scope.type = "analyse_view.Custom_scan";
        var size = 'sm';
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'views/CustomAnalyse.html',
          controller: 'CustomAnalyseController',
          size: size,
          resolve: {
              items: function () {
              return $scope.items;
            }
          }
        });

        modalInstance.result.then(function (scanOptions) {
          $scope.scanOptions = scanOptions;
          $scope.path_to_scan = $scope.scanOptions.pathToScan;
          $scope.StartScan($scope.path_to_scan);
        }, function () {
          console.log('Modal dismissed at: ' + new Date());
        });

      };

      $scope.truncate = function (fullStr, strLen) {
          if (fullStr.length <= strLen){
            return fullStr;
          }
          var separator = '...';
          
          var sepLen = separator.length,
              charsToShow = strLen - sepLen,
              frontChars = Math.ceil(charsToShow/2),
              backChars = Math.floor(charsToShow/2);
          
          return fullStr.substr(0, frontChars) + 
                 separator + 
                 fullStr.substr(fullStr.length - backChars);
      };

      $rootScope.$on('OnDemandProgressEvent', function(event, data) { 
        $scope.updateScope(data);
        //console.log("OnDemandProgressEvent : ", data);

      });

      $rootScope.$on('DetectionEvent', function(event, data) {
        $scope.updateScope(data);
        //console.log("DetectionEvent : ", data);
      });

      $rootScope.$on('OnDemandCompletedEvent', function(event, data) {
        //If we want to notify the user that the scan is finished
        //$scope.updateScope(data);
        //console.log("DetectionEvent : ", data);
      });

      ScanService.register();

  }]);
