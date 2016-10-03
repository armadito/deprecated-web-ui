'use strict';

/**
 * @ngdoc service
 * @name armaditoApp.BrowseService
 * @description
 * # BrowseService
 * Service in the armaditoApp.
 */
angular.module('armaditoApp')
	.service('BrowseService', function ($http)
	{
	  	var BrowseService = {
	  		browse:
	  		function(path)
	  		{
		     	var promise = $http(
			    {
		      		method: 'GET',
		      		url: '/api/browse',
		      		headers: {
    					"Content-Type": "application/json"
    				},
    				params : {path : path}
				}
			    ).then(
			        function (response)
			        {
			            return response.data;
		        	}
		    	);
		      	return promise;
		    }
		};
		return BrowseService;
	}
);
