var app = angular.module("app", ["ngRoute"])
            .config(function($routeProvider){
            $routeProvider.when('/', {
                templateUrl:'views/table.html',
                controller:'mainCtrl'
            });
            $routeProvider.when('/info', {
                templateUrl:'views/info.html',
                controller:'itemCtrl'
            });
            $routeProvider.when('/edit', {
                templateUrl:'views/edit.html',
                controller:'itemCtrl'
            });
            $routeProvider.when('/userInfo', {
                templateUrl:'views/userInfo.html',
                controller:'itemCtrl'
            });

            $routeProvider.otherwise({redirectTo: '/'});
        });
