angular
    .module('isd', [
	    'ngAnimate',
	    'ngRoute',
	    'ngMap'
    ])
    .config(function ($routeProvider) {
    	console.log("in config");
    	
	    $routeProvider.when('/login', {
	    	controller: 'loginCtrl',
	        templateUrl: 'components/views/login.html'
	    });    	
	    $routeProvider.when('/Home', {
	    	//controller: 'indexCtrl',
	        templateUrl: 'components/views/home.html'
	    });
	    $routeProvider.when('/HomeError', {
	        templateUrl: 'components/views/homeError.html'
	    });

	    $routeProvider.otherwise({ redirectTo: '/HomeError' });
	});
