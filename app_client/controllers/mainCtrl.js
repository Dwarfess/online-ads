app.controller("mainCtrl", function ($scope, $http, transport){

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
        $scope.createdUser = h;
        $scope.wrongEmail = h;
        $scope.wrongPass = h;
        
        //cleans forms
        $scope.user={};
        $scope.newUser={}; 
        $scope.newUser.email = "";
    }
    
    $scope.online = {"logged":true};//info about logged user
    //LOGIN OR CREATE NEW USER
    $scope.login = function(user){//for login into the site
        $http.post("api/login", user).then(function (response) {
            console.log('success', response.data);// success
            if (response.data.token) {
                $scope.token = response.data.token;
                transport.setToken($scope.token);//send token with service
                $scope.online.logged = false;//check logged in or not
                $scope.online.login = response.data.name;//add user name
                
                $scope.showForms(false,false,false,false);
                
            } if (response.data.status == 2) {   
                $scope.createdUser = true;
                $scope.wrongPass = false;
                $scope.user={};
            }
            
        }, function (data, status, headers, config) {
            if (data.status == 422) {
                $scope.createdUser = false;
                $scope.wrongPass = data.data.message;
                
            }
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        });
    }
    
    //GET THE USER DATA
    $scope.getUser = function(){
        
        $http.defaults.headers.common['Authorization'] = $scope.token;       
        $http.get("api/me").then(function (response) {
            console.log('success', response.data);// success
            if (response.data.name) {
                $scope.currentUser = response.data;
                $scope.showForms(true, false, true);       
            }
        }, function (data, status, headers, config) {
            if(data.status == 401) {
                console.log("You should log in again");
            }
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        });      
    }
    
    $scope.updateUser = function(user){       
        $http.defaults.headers.common['Authorization'] = $scope.token;
        $http.patch("api/me", user).then(function (response) {
            console.log('success', response.data);// success
            if (response.data.name) {
                $scope.online.login = response.data.name;//add user name
                $scope.currentUser = response.data;
                $scope.showForms(false,false,false,false);
            }
        }, function (data, status, headers, config) {
            if(data.status == 401) {
                console.log("You should log in again");
            }
            if(data.status == 422) {
                console.log(data.data);
            }
            
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        });
    }
    
    $scope.logOut = function(x){//for log out from the site
        $scope.online.logged = true;
        $scope.token = '';
        transport.setToken($scope.token);//send token with service
    }
    
    
                        //FOR ERRORS WHEN FILLING THE FORMS
//    $scope.getError = function (error, type) {
//        if (angular.isDefined(error)) {
//            if (error.email) {
//                return "Wrong email";
//            } else if (error.pattern && type){
//                return "Wrong password";
//            }
//        }
//    }
});
