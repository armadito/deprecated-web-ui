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
 * @name armaditoApp.controller:MainController
 * @description
 * # MainController
 * Controller of the armaditoApp
 */

//var scan_in_progress = 0;
//global.scan_in_progress = 0;

angular.module('armaditoApp')
  .controller('MainController', 
  			[ '$rootScope', '$scope', '$state','$uibModal', '$translate', 'toastr',
  	function ( $rootScope,   $scope,   $state,  $uibModal,   $translate,   toastr) {

  	//Buttons
  	$scope.buttons = [
  			{ 
  				button : {
		  			isActive : true,
		  			tittle : 'information_view.General',
		  			icon : "fa fa-tachometer fa-2x",
		  			view : 'Main.Information',
		  			backgroundColor: 'generalActive'
		  		}
	  		},
	  		{
	  			button : {
		  			isActive : false,
		  			tittle : 'analyse_view.Scan',
		  			icon : 'fa fa-search fa-2x',
		  			view : 'Main.Scan',
		  			backgroundColor: 'analyseActive'
		  		}
	  		},
	  		{
	  			button : {
		  			isActive : false,
		  			tittle : 'history_view.History',
		  			icon : 'fa fa-newspaper-o fa-2x',
		  			view : 'Main.Journal',
		  			backgroundColor:  'journalActive'
		  		}
	  		}/*,
	  		{
	  			button : {
		  			isActive : false,
		  			tittle : "Parameters",
		  			icon : "fa fa-cogs fa-2x",
		  			view : 'Main.Parameters'
		  		}	
	  		}*/
	];

	$rootScope.$on('$stateChangeStart', 
		function(event, toState, toParams, fromState, fromParams){
		    if(toState.url === '/Parameters'){
		    	for (var i = 0; i < $scope.buttons.length; i++) {
		    		$scope.buttons[i].button.isActive = false;
		    		$scope.buttonParameters = true;
		    	}
		    }else{
		    	$scope.buttonParameters = false;
		    }
		})

	$scope.activeButton = function (button){
		for (var i = 0; i < $scope.buttons.length; i++) {
			$scope.buttons[i].button.isActive = false;
		};
		button.isActive = true;
	};

  	$scope.refresh = function () {
  		$state.go('Main.Information');
  	};
	

  	/* 
  		This function process data coming from av service :: 
  		- Notifications
  		- scan information
  	*/
  	$scope.processDataFromAV = function(data){

  		var json_object;  		
  		console.log("[+] Debug :: processDataFromAV :: "+data);
  		try{
  			json_object = JSON.parse(data);
  			
  			if(json_object.ihm_request == "notification"){

  				// Notifications.  				
  				$rootScope.myEmitter.emit('notification', json_object);

  			}else if(json_object.ihm_request == "scan"){

  				// scan information.
  				$rootScope.myEmitter.emit('scan_info', json_object);

  			}else{
  				console.log("[-] Error :: invalid request from av!\n");
				json_object = null;
  				return -1;
  			}
  		}  	
  		catch(e){
  			console.error("[-] Error :: Parsing error:", e); 
			json_object = null;
			return -1;
  		}
		json_object = null;
  		return 0;

  	}

  	$scope.displayNotification = function(json_object){

  		// console.log("[i] Info :: displayNotification :: "+data);
		try {
			if(json_object.params.type == "INFO"){

				toastr.info(json_object.params.message, 'Info');

			}else if(json_object.params.type == "WARNING"){

				toastr.warning(json_object.params.message, 'Warning');

			}else if(json_object.params.type == "ERROR"){

				toastr.error(json_object.params.message, 'Error');
			}	
		}
		catch(e){
			console.error("Parsing error:", e); 
			json_object = null;
			return null;
		}  		

		json_object = null;
  	};

  	//ArmaditoSVC.startNotificationServer($scope.processDataFromAV);

  	$scope.refresh();

  }]);
