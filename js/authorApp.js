var authorApp = angular.module('authorApp', [
    'ngResource',
    'ngRoute',
    'authorToolControllers'
]);

authorApp.config(['$routeProvider',
    function($routeProvider){
        $routeProvider.
            when('/article',{
                templateUrl:'includes/composer.html',
                controller: 'articleCtrl'
            }).
            when('/dashboard', {
                templateUrl: 'includes/dashboard.html',
                controller: 'dashboardCtrl'
            }).
            when('/profile', {
                templateUrl: 'includes/profile.html',
                controller: 'profileCtrl'
            }).
            when('/stats', {
                templateUrl: 'includes/stats.html',
                controller: 'statsCtrl'
            }).
            otherwise({
                redirectTo: '/article'
            });
}]);

