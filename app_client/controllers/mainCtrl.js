app.controller("mainCtrl", function ($scope, $http, $window){

    //present view
    
    
                        //FOR LOGIN AND REGISTRATION
    $scope.bg = false;//fixed background 
    $scope.log = false;//form for login
    $scope.reg = false;//form for registration
    
    $scope.existingLogin = false;
    $scope.wrongLogin = false;
    $scope.wrongPass = false;
    
    $scope.showForms = function(x,y,z,h){  //fuction for bg, log and reg
        $scope.bg = x;
        $scope.log = y;
        $scope.reg = z;
        
        //cleans form messages
        $scope.existingLogin = h;
        $scope.wrongLogin = h;
        $scope.wrongPass = h;
        
        //cleans forms
        $scope.user={};
        $scope.newUser={}; 
        $scope.newUser.email = "";
        $scope.newUser2={};
    }
    
    
    //add new users
    $scope.addNewUser = function (newUser) {        
        $http.post('api/users', newUser).then(function (response) {
            console.log('success', response.data);// success
            
            if(response.data == "Error"){
                $scope.existingLogin = true;//error - this login exists
            }else{
                $scope.showForms(false,false,false,false);
            }
            
        }, function (data, status, headers, config) {
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        });       
    }
    
    $scope.online = {"logged":true};//info about logged user
    
    $scope.logIn = function(){//for login into the site

        $http.post("api/auth", {login: $scope.user.login, password: $scope.user.pass}).then(function (response) {
            console.log('success', response.data);// success
            if (response.data.login) {
                $scope.online.logged = false;//check logged in or not
                $scope.online.login = response.data.login;//add user name
                
                $scope.showForms(false,false,false,false);
                
            } if (response.data.status == 1) {
                $scope.wrongLogin = false;
                $scope.wrongPass = true;
                
            } if (response.data.status == 2) {   
                $scope.wrongLogin = true;
                $scope.wrongPass = false;
            }
            
        }, function (data, status, headers, config) {
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        });
    }
    
    $scope.logOut = function(x){//for log out from the site
        $scope.online.logged = true;
        
        $scope.$broadcast('currentView', {
            message: "table"
        });
    }
    
    
                        //FOR ERRORS WHEN FILLING THE FORMS
    $scope.getError = function (error, type) {
        if (angular.isDefined(error)) {
            if (error.email) {
                return "Wrong email";
            } else if (error.pattern && type){
                return "Wrong password";
            }
        }
    }
});
