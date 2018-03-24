var app = angular.module("app", ["ngRoute"])
            .config(function($routeProvider){
            $routeProvider.when('/', {
                templateUrl:'views/table.html',
                controller:'mainCtrl'
            });
            $routeProvider.when('/info', {
                templateUrl:'views/info.html',
                controller:'viewCtrl'
            });
            $routeProvider.when('/edit', {
                templateUrl:'views/edit.html',
                controller:'viewCtrl'
            });
            $routeProvider.when('/userInfo', {
                templateUrl:'views/userInfo.html',
                controller:'viewCtrl'
            });

            $routeProvider.otherwise({redirectTo: '/'});
        });
