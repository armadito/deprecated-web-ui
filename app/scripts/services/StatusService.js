'use strict';

/**
 * @ngdoc service
 * @name armaditoApp.ScanService
 * @description
 * # ScanService
 * Service in the armaditoApp.
 */
angular.module('armaditoApp')
	.service('StatusService', ['$rootScope', function ($rootScope) {

	  	var factory = {};	  	

	  	factory.getAntivirusStatus = function(){
	  		
	  	};

	  	return factory;
	}]);