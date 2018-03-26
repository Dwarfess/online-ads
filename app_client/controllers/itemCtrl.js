app.controller("itemCtrl", function ($scope, $rootScope, $http, $location, transport){
    $scope.json = [{title:"Drill",
                    price:"5.00",
                    image:"",
                    created_at: "2018-03-15T15:38:21.523+0000",
                    user:{
                       name:"Ivan",
                       phone:"+38(098)123 54 04",
                       email:"ivan@ua.fm"
                    }
                   },
                  {title:"Headphone Black",
                   price:"10.00",
                   image:"img/1.jpg",
                   created_at: "2018-03-15T15:38:21.523+0000",
                   user:{
                       name:"Ivan  Michelivier Dev",
                       phone:"+38(098)123 54 04",
                       email:"ivan@ua.fm"
                   }
                  },
                  {title:"Fridge New Super Technology Native Speaker Virification",
                   price:"25.00",
                   image: "img/1.jpg",
                   created_at: "2018-03-15T15:38:21.523+0000",
                   user:{
                       name:"Ivan",
                       phone:"+38(098)123 54 04",
                       email:"ivan@ua.fm"
                   }
                  }];
    
    $scope.order = [1,2];
    //SEARCH ITEMS
    $scope.search = {};
    $scope.searchItems = function(search){

        console.log(search);
        
//        $http.get('/api/item?title=book&user_id=1&order_by=created_at&order_type=desc').then(function (response) {
//            console.log('success', response.data);// success
//            $scope.json = response.data;
//            $scope.currentView = "table";
//
//        }, function (data, status, headers, config) {
//            console.log(data);
//            console.log(status);
//            console.log(headers);
//            console.log(config);
//        });
    }
    
                    //OPTION FOR REGISTERED USERS
        
    //select pressed task 
    $scope.show = function(item){
        $scope.info = item;
        $location.path('/info');
    }

    //select pressed user with ads 
    $scope.getUserInfo = function(user){
        
//        if(!$scope.online.logged){
//            $scope.info = item;
//            $scope.currentView = "info";
        if($scope.online.logged){
            $rootScope.userInfo = user;
            $rootScope.userAds = $scope.json;
            console.log(`User${Math.floor(Math.random()*100000)}`);
//            transport.setCurrent(user);
//            transport.setCurrent($scope.json);
//            $scope.userInfo = transport.getCurrent();
            $location.path('/userInfo');
            
//            $http.get('/api/user/<id>').then(function (response) {
//                console.log('success', response.data);// success
//                $scope.json = response.data;
//                $scope.currentView = "table";
//
//            }, function (data, status, headers, config) {
//                console.log(data);
//                console.log(status);
//                console.log(headers);
//                console.log(config);
//            });
        }else{
            $scope.$parent.bg = true; 
            $scope.$parent.log = true;
        }
    }
    
    $scope.$on('currentView', function (event, data) {//if logout, currentView - table
        $scope.currentView = data.message; 
    });
    
    //return to present view
    $scope.back = function(){
        $location.path('/');
    }
    
    //edit or create new task
    $scope.editOrCreate = function (item, view, currentView, showGroup) {
        $rootScope.currentItem = item ? angular.copy(item) : {};
        $location.path(`/${currentView}`);
        $rootScope.view = view;
    }

    //save changes
    $scope.saveEdit = function (item) {
        try{//check the valid date
            if(new Date(item.due_date).toISOString().substr(0, 10)==item.due_date.substr(0, 10)){
                if (angular.isDefined(item._id)) {
                    console.log("=========== update");
                    $scope.updateTask(item);
                } else {
                    console.log("=========== create");
                    $scope.createTask(item);
                }
            } else {
                $scope.wrongDate = true;
            }       
        } catch (e){
            $scope.wrongDate = true;
        }
    }    
    
    //ADD NEW TASK
    $scope.createTask = function (item) {
        $http.post('api/task', item).then(function (response) {
            console.log('success', response.data);// success
            $scope.json = response.data;
            $scope.currentView = "table";
            
        }, function (data, status, headers, config) {
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        });
    }

    //DELETE THE TASK FROM THE GROUP
    $scope.deleteTask = function (item) {
        $scope.json.forEach(function (e, i) {
            if (e.tasks.indexOf(item) >= 0)
                e.tasks.splice(e.tasks.indexOf(item), 1);
        });
        
        $http.delete('api/deleteTask?id='+item._id).then(function (response) {
            console.log('success', response.data);// success
            $scope.json = response.data;
            
        }, function (data, status, headers, config) {
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        });
        
        $scope.currentView = "table";
    }
    
    
    //UPDATE TASK
    $scope.updateTask = function (item) {
        $http.put('api/update', item).then(function (response) {
            console.log('success', response.data);// success
            $scope.json = response.data;
            
        }, function (data, status, headers, config) {
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        });
        
        $scope.info = item;
        $scope.currentView = "info"
    }

    //cancel changes and return to present table
    $scope.cancelEdit = function (item) {
        $scope.currentItem = {};
        $location.path(`/${$rootScope.view}`);
    }
});
