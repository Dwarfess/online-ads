angular.module("app", ["dndLists", "ngRoute"]);

function config($routeProvider){
    .when('/', {
        templateUrl:'view/table.html',
        controller:'mainCtrl'
    }).otherwise)({redirectTo:'/'});
}